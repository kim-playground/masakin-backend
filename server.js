require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5001;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║              🍳  MASAKIN API SERVER  🍳            ║
║                                                    ║
║  Solusi sebelum kamu pesan online                 ║
║                                                    ║
╚════════════════════════════════════════════════════╝

✅ Server running in ${process.env.NODE_ENV || "development"} mode
🚀 Server is running on port ${PORT}
📚 API Documentation: http://localhost:${PORT}/api-docs
🌐 API Base URL: http://localhost:${PORT}/api/v1
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Process terminated");
  });
});
