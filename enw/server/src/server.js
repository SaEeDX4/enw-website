// src/server.js
import express from "express";
import config from "./config/config.js";
import logger from "./utils/logger.js";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js"; // 👈 import the main router
import cors from "cors"; // ✅ CORS

const app = express();
const PORT = config.port;

/**
 * ✅ CORS (prod + local)
 * - Allows your Render frontend and localhost:5173
 * - Uses CLIENT_URL from config/env if set
 * - Handles preflight + common headers
 */
const ALLOWED_ORIGINS = [
  "https://enw-frontend.onrender.com",
  "http://localhost:5173",
  config.clientUrl, // optional: if you set CLIENT_URL in env
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // allow non-browser requests (no Origin) and whitelisted origins
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors()); // preflight

// Body parser
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
      logger.info(`🌐 CORS allowed: ${ALLOWED_ORIGINS.join(", ")}`);
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
