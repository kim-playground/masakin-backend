const ApiError = require("../utils/ApiError");

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.errorCode = err.errorCode || "INTERNAL_SERVER_ERROR";

  // Log error for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ApiError(404, message, "RESOURCE_NOT_FOUND");
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new ApiError(400, message, "DUPLICATE_FIELD");
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ApiError(400, message, "VALIDATION_ERROR");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token", "INVALID_TOKEN");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired", "TOKEN_EXPIRED");
  }

  // Send response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errorCode: error.errorCode,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
  const error = new ApiError(
    404,
    `Route ${req.originalUrl} not found`,
    "ROUTE_NOT_FOUND",
  );
  next(error);
};

module.exports = { errorHandler, notFound };
