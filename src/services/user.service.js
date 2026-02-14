const User = require("../models/User");
const Recipe = require("../models/Recipe");
const ApiError = require("../utils/ApiError");

/**
 * Get user profile by ID
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -refreshToken")
    .populate("followers", "name email avatar")
    .populate("following", "name email avatar");

  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  return user;
};

/**
 * Update user profile
 */
const updateProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  return user;
};

/**
 * Get user's recipes
 */
const getUserRecipes = async (userId, query) => {
  const { page = 1, limit = 10, status } = query;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const filter = { author: userId };

  if (status) {
    filter.status = status;
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
 * Follow user
 */
const followUser = async (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new ApiError(400, "You cannot follow yourself", "CANNOT_FOLLOW_SELF");
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const currentUser = await User.findById(currentUserId);

  // Check if already following
  if (currentUser.following.includes(targetUserId)) {
    throw new ApiError(
      400,
      "You are already following this user",
      "ALREADY_FOLLOWING",
    );
  }

  // Add to current user's following
  currentUser.following.push(targetUserId);
  await currentUser.save();

  // Add to target user's followers
  targetUser.followers.push(currentUserId);
  await targetUser.save();

  return { message: "User followed successfully" };
};

/**
 * Unfollow user
 */
const unfollowUser = async (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new ApiError(400, "Invalid operation", "INVALID_OPERATION");
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const currentUser = await User.findById(currentUserId);

  // Check if following
  if (!currentUser.following.includes(targetUserId)) {
    throw new ApiError(400, "You are not following this user", "NOT_FOLLOWING");
  }

  // Remove from current user's following
  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId.toString(),
  );
  await currentUser.save();

  // Remove from target user's followers
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUserId.toString(),
  );
  await targetUser.save();

  return { message: "User unfollowed successfully" };
};

/**
 * Get user analytics
 */
const getAnalytics = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const recipes = await Recipe.find({ author: userId });

  const totalRecipes = recipes.length;
  const publishedRecipes = recipes.filter(
    (r) => r.status === "published",
  ).length;
  const draftRecipes = recipes.filter((r) => r.status === "draft").length;

  let totalLikes = 0;
  let totalLoves = 0;
  let totalFires = 0;
  let totalSaves = 0;
  let totalComments = 0;

  recipes.forEach((recipe) => {
    totalLikes += recipe.reactions.like.length;
    totalLoves += recipe.reactions.love.length;
    totalFires += recipe.reactions.fire.length;
    totalSaves += recipe.savesCount;
    totalComments += recipe.commentsCount;
  });

  return {
    totalRecipes,
    publishedRecipes,
    draftRecipes,
    engagement: {
      totalReactions: totalLikes + totalLoves + totalFires,
      likes: totalLikes,
      loves: totalLoves,
      fires: totalFires,
      saves: totalSaves,
      comments: totalComments,
    },
    social: {
      followers: user.followers.length,
      following: user.following.length,
    },
  };
};

module.exports = {
  getUserProfile,
  updateProfile,
  getUserRecipes,
  followUser,
  unfollowUser,
  getAnalytics,
};
