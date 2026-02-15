const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const { generalLimiter } = require("./middleware/rateLimiter.middleware");
const { errorHandler, notFound } = require("./middleware/error.middleware");
const {
  swaggerUi,
  swaggerDocument,
  swaggerOptions,
} = require("./config/swagger");

// Import routes
const authRoutes = require("./routes/auth.routes");
const recipeRoutes = require("./routes/recipe.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rate limiting for API routes
app.use("/api", generalLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Documentation - Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recipes", recipeRoutes);
app.use("/api/v1/users", userRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Masakin API - Solusi sebelum kamu pesan online",
    version: "1.0.0",
    documentation: "/api-docs",
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
