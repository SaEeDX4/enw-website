import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import config from "./config/config.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";
// FIX: add partners router
import partnersRouter from "./routes/partners.routes.js";
// FIX: add seniors router (to satisfy tests hitting /api/seniors/...)
import seniorsRouter from "./routes/seniors.routes.js";

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.env !== "test") {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

// FIX: mount partners API directly (alongside your routes index)
app.use("/api/partners", partnersRouter);

// ✅ NEW: mount seniors API directly to satisfy tests like POST /api/seniors/support-request
app.use("/api/seniors", seniorsRouter);

// API routes (central index)
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    path: req.path,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
