import dotenv from "dotenv";
import app from "./app.js";
import logger from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

// console.log("🧩 DB ENV:", {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB,
// });

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  logger.warn(`${signal} received. Closing server...`);

  server.close(() => {
    logger.info("✅ Server closed gracefully");
    process.exit(0);
  });

  // Force close after 10 seconds if something hangs
  setTimeout(() => {
    logger.error("❌ Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
};

// Handle termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught errors
process.on("uncaughtException", (err) => {
  logger.error("💥 Uncaught Exception:", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error("💥 Unhandled Rejection:", {
    reason,
  });
  process.exit(1);
});

// Export server for testing purposes
export default server;
