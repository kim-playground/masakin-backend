const Recipe = require("../models/Recipe");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

/**
 * Get all recipes with filtering and pagination
 */
const getRecipes = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    difficulty,
    tags,
    status = "published",
    author,
  } = query;

  const filter = { status };

  // Search by title or description
  if (search) {
    filter.$text = { $search: search };
  }

  // Filter by category
  if (category) {
    filter.category = category;
  }

  // Filter by difficulty
  if (difficulty) {
    filter.difficulty = difficulty;
  }

  // Filter by tags
  if (tags) {
    const tagsArray = tags.split(",").map((tag) => tag.trim());
    filter.tags = { $in: tagsArray };
  }

  // Filter by author
  if (author) {
    filter.author = author;
  }

  const skip = (page - 1) * limit;

  const recipes = await Recipe.find(filter)
    .populate("author", "name email avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Recipe.countDocuments(filter);

  return {
    recipes,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalRecipes: total,
      limit: parseInt(limit),
    },
  };
};

/**
 * Get single recipe by ID
 */
const getRecipeById = async (recipeId) => {
  const recipe = await Recipe.findById(recipeId).populate(
    "author",
    "name email avatar bio",
  );

  if (!recipe) {
    throw new ApiError(404, "Recipe not found", "RECIPE_NOT_FOUND");
  }

  return recipe;
};

/**
 * Create new recipe
 */
const createRecipe = async (userId, recipeData) => {
  const recipe = await Recipe.create({
    ...recipeData,
    author: userId,
  });

  const populatedRecipe = await Recipe.findById(recipe._id).populate(
    "author",
    "name email avatar",
  );

  return populatedRecipe;
};

/**
 * Update recipe
 */
const updateRecipe = async (recipeId, userId, updateData) => {
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new ApiError(404, "Recipe not found", "RECIPE_NOT_FOUND");
  }

  // Check if user is the author
  if (recipe.author.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this recipe",
      "FORBIDDEN",
    );
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updateData, {
    new: true,
    runValidators: true,
  }).populate("author", "name email avatar");

  return updatedRecipe;
};

/**
 * Delete recipe
 */
const deleteRecipe = async (recipeId, userId) => {
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new ApiError(404, "Recipe not found", "RECIPE_NOT_FOUND");
  }

  // Check if user is the author
  if (recipe.author.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to delete this recipe",
      "FORBIDDEN",
    );
  }

  await Recipe.findByIdAndDelete(recipeId);

  // Remove from all users' saved recipes
  await User.updateMany(
    { savedRecipes: recipeId },
    { $pull: { savedRecipes: recipeId } },
  );

  return { message: "Recipe deleted successfully" };
};

/**
 * React to recipe
 */
const reactToRecipe = async (recipeId, userId, reactionType) => {
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new ApiError(404, "Recipe not found", "RECIPE_NOT_FOUND");
  }

  // Remove user from all reaction types first
  recipe.reactions.like = recipe.reactions.like.filter(
    (id) => id.toString() !== userId.toString(),
  );
  recipe.reactions.love = recipe.reactions.love.filter(
    (id) => id.toString() !== userId.toString(),
  );
  recipe.reactions.fire = recipe.reactions.fire.filter(
    (id) => id.toString() !== userId.toString(),
  );

  // Add user to the specified reaction type
  recipe.reactions[reactionType].push(userId);

  await recipe.save();

  return recipe;
};

/**
 * Remove reaction from recipe
 */
const removeReaction = async (recipeId, userId) => {
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new ApiError(404, "Recipe not found", "RECIPE_NOT_FOUND");
  }

  // Remove user from all reaction types
  recipe.reactions.like = recipe.reactions.like.filter(
    (id) => id.toString() !== userId.toString(),
  );
  recipe.reactions.love = recipe.reactions.love.filter(
    (id) => id.toString() !== userId.toString(),
  );
  recipe.reactions.fire = recipe.reactions.fire.filter(
    (id) => id.toString() !== userId.toString(),
  );

  await recipe.save();

  return recipe;
};

/**
 * Save/bookmark recipe
 */
const saveRecipe = async (recipeId, userId) => {
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new ApiError(404, "Recipe not found", "RECIPE_NOT_FOUND");
  }

  const user = await User.findById(userId);

  // Check if already saved
  if (user.savedRecipes.includes(recipeId)) {
    throw new ApiError(400, "Recipe already saved", "ALREADY_SAVED");
  }

  // Add to user's saved recipes
  user.savedRecipes.push(recipeId);
  await user.save();

  // Increment saves count
  recipe.savesCount += 1;
  await recipe.save();

  return { message: "Recipe saved successfully" };
};

/**
 * Unsave/unbookmark recipe
 */
const unsaveRecipe = async (recipeId, userId) => {
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new ApiError(404, "Recipe not found", "RECIPE_NOT_FOUND");
  }

  const user = await User.findById(userId);

  // Check if saved
  if (!user.savedRecipes.includes(recipeId)) {
    throw new ApiError(400, "Recipe not saved", "NOT_SAVED");
  }

  // Remove from user's saved recipes
  user.savedRecipes = user.savedRecipes.filter(
    (id) => id.toString() !== recipeId.toString(),
  );
  await user.save();

  // Decrement saves count
  recipe.savesCount = Math.max(0, recipe.savesCount - 1);
  await recipe.save();

  return { message: "Recipe unsaved successfully" };
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  reactToRecipe,
  removeReaction,
  saveRecipe,
  unsaveRecipe,
};
