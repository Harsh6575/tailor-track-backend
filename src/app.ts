import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import routes from "./router/index.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import morganLogger from "./middleware/morganLogger.js";

const app = express();

// Core middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// HTTP request logging
app.use(morganLogger);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

// Not Found handler (MUST be before error handler)
app.use(notFoundHandler);

// Global error handler (last middleware)
app.use(errorHandler);

export default app;
