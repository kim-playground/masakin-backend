const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

/**
 * Register a new user
 */
const registerUser = async (userData) => {
  const { name, email, password, avatar, bio } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered", "EMAIL_EXISTS");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    avatar,
    bio,
  });

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

/**
 * Login user
 */
const loginUser = async (email, password) => {
  // Find user with password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(
      401,
      "Refresh token is required",
      "REFRESH_TOKEN_REQUIRED",
    );
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
    }

    // Check if refresh token matches
    if (user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    return {
      accessToken: newAccessToken,
    };
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new ApiError(
        401,
        "Invalid or expired refresh token",
        "INVALID_REFRESH_TOKEN",
      );
    }
    throw error;
  }
};

/**
 * Logout user
 */
const logoutUser = async (userId) => {
  // Remove refresh token
  await User.findByIdAndUpdate(userId, { refreshToken: null });

  return { message: "Logged out successfully" };
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
