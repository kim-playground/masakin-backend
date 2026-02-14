const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");

/**
 * Middleware to authenticate user using JWT
 */
const authenticate = catchAsync(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access token is required", "UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Access token is required", "UNAUTHORIZED");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "User not found", "UNAUTHORIZED");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token", "INVALID_TOKEN");
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired", "TOKEN_EXPIRED");
    }
    throw error;
  }
});

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select(
      "-password -refreshToken",
    );

    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
});

module.exports = { authenticate, optionalAuth };
