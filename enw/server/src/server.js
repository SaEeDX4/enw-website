// src/server.js
import express from "express";
import config from "./config/config.js";
import logger from "./utils/logger.js";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js"; // 👈 import the main router
import cors from "cors"; // ✅ added

const app = express();
const PORT = config.port;

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // ✅ allow your Vite frontend
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Mount all API routes
app.use("/api", routes);

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${config.env}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        logger.info("HTTP server closed");
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app; // 👈 export app (for testing or seeding if needed)
