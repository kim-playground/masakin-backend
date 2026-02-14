const commentService = require("../services/comment.service");
const catchAsync = require("../utils/catchAsync");

/**
 * @desc    Create comment
 * @route   POST /api/v1/recipes/:id/comments
 * @access  Private
 */
const createComment = catchAsync(async (req, res) => {
  const comment = await commentService.createComment(
    req.params.id,
    req.user._id,
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Comment created successfully",
    data: comment,
  });
});

/**
 * @desc    Get comments for recipe
 * @route   GET /api/v1/recipes/:id/comments
 * @access  Public
 */
const getComments = catchAsync(async (req, res) => {
  const result = await commentService.getComments(req.params.id, req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  createComment,
  getComments,
};
