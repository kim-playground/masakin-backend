const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
const getUserProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserProfile(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/:id
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res) => {
  // Ensure user can only update their own profile
  if (req.user._id.toString() !== req.params.id) {
    throw new ApiError(
      403,
      "You can only update your own profile",
      "FORBIDDEN",
    );
  }

  const user = await userService.updateProfile(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

/**
 * @desc    Get user's recipes
 * @route   GET /api/v1/users/:id/recipes
 * @access  Public
 */
const getUserRecipes = catchAsync(async (req, res) => {
  const result = await userService.getUserRecipes(req.params.id, req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Follow user
 * @route   POST /api/v1/users/:id/follow
 * @access  Private
 */
const followUser = catchAsync(async (req, res) => {
  const result = await userService.followUser(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * @desc    Unfollow user
 * @route   DELETE /api/v1/users/:id/follow
 * @access  Private
 */
const unfollowUser = catchAsync(async (req, res) => {
  const result = await userService.unfollowUser(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * @desc    Get user analytics
 * @route   GET /api/v1/users/me/analytics
 * @access  Private
 */
const getAnalytics = catchAsync(async (req, res) => {
  const analytics = await userService.getAnalytics(req.user._id);

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

module.exports = {
  getUserProfile,
  updateProfile,
  getUserRecipes,
  followUser,
  unfollowUser,
  getAnalytics,
};
