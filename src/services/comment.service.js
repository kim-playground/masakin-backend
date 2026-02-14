const Comment = require("../models/Comment");
const Recipe = require("../models/Recipe");
const ApiError = require("../utils/ApiError");

/**
 * Create comment on recipe
 */
const createComment = async (recipeId, userId, commentData) => {
  const { message, parentComment } = commentData;

  // Check if recipe exists
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new ApiError(404, "Recipe not found", "RECIPE_NOT_FOUND");
  }

  // If parent comment provided, verify it exists
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent) {
      throw new ApiError(
        404,
        "Parent comment not found",
        "PARENT_COMMENT_NOT_FOUND",
      );
    }
  }

  // Create comment
  const comment = await Comment.create({
    recipe: recipeId,
    user: userId,
    message,
    parentComment: parentComment || null,
  });

  // Increment recipe comment count
  recipe.commentsCount += 1;
  await recipe.save();

  // Populate user details
  const populatedComment = await Comment.findById(comment._id).populate(
    "user",
    "name email avatar",
  );

  return populatedComment;
};

/**
 * Get comments for a recipe
 */
const getComments = async (recipeId, query) => {
  const { page = 1, limit = 20 } = query;

  // Check if recipe exists
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new ApiError(404, "Recipe not found", "RECIPE_NOT_FOUND");
  }

  const skip = (page - 1) * limit;

  // Get parent comments (top-level)
  const parentComments = await Comment.find({
    recipe: recipeId,
    parentComment: null,
  })
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // For each parent comment, get its replies
  const commentsWithReplies = await Promise.all(
    parentComments.map(async (parentComment) => {
      const replies = await Comment.find({
        parentComment: parentComment._id,
      })
        .populate("user", "name email avatar")
        .sort({ createdAt: 1 });

      return {
        ...parentComment.toObject(),
        replies,
      };
    }),
  );

  const total = await Comment.countDocuments({
    recipe: recipeId,
    parentComment: null,
  });

  return {
    comments: commentsWithReplies,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalComments: total,
      limit: parseInt(limit),
    },
  };
};

module.exports = {
  createComment,
  getComments,
};
