const recipeService = require("../services/recipe.service");
const catchAsync = require("../utils/catchAsync");

/**
 * @desc    Get all recipes
 * @route   GET /api/v1/recipes
 * @access  Public
 */
const getRecipes = catchAsync(async (req, res) => {
  const result = await recipeService.getRecipes(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get single recipe
 * @route   GET /api/v1/recipes/:id
 * @access  Public
 */
const getRecipeById = catchAsync(async (req, res) => {
  const recipe = await recipeService.getRecipeById(req.params.id);

  res.status(200).json({
    success: true,
    data: recipe,
  });
});

/**
 * @desc    Create new recipe
 * @route   POST /api/v1/recipes
 * @access  Private
 */
const createRecipe = catchAsync(async (req, res) => {
  const recipe = await recipeService.createRecipe(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: "Recipe created successfully",
    data: recipe,
  });
});

/**
 * @desc    Update recipe
 * @route   PUT /api/v1/recipes/:id
 * @access  Private
 */
const updateRecipe = catchAsync(async (req, res) => {
  const recipe = await recipeService.updateRecipe(
    req.params.id,
    req.user._id,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Recipe updated successfully",
    data: recipe,
  });
});

/**
 * @desc    Delete recipe
 * @route   DELETE /api/v1/recipes/:id
 * @access  Private
 */
const deleteRecipe = catchAsync(async (req, res) => {
  const result = await recipeService.deleteRecipe(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * @desc    React to recipe
 * @route   POST /api/v1/recipes/:id/react
 * @access  Private
 */
const reactToRecipe = catchAsync(async (req, res) => {
  const recipe = await recipeService.reactToRecipe(
    req.params.id,
    req.user._id,
    req.body.type,
  );

  res.status(200).json({
    success: true,
    message: "Reaction added successfully",
    data: recipe,
  });
});

/**
 * @desc    Remove reaction from recipe
 * @route   DELETE /api/v1/recipes/:id/react
 * @access  Private
 */
const removeReaction = catchAsync(async (req, res) => {
  const recipe = await recipeService.removeReaction(
    req.params.id,
    req.user._id,
  );

  res.status(200).json({
    success: true,
    message: "Reaction removed successfully",
    data: recipe,
  });
});

/**
 * @desc    Save recipe
 * @route   POST /api/v1/recipes/:id/save
 * @access  Private
 */
const saveRecipe = catchAsync(async (req, res) => {
  const result = await recipeService.saveRecipe(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * @desc    Unsave recipe
 * @route   DELETE /api/v1/recipes/:id/save
 * @access  Private
 */
const unsaveRecipe = catchAsync(async (req, res) => {
  const result = await recipeService.unsaveRecipe(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

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
