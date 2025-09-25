import dotenv from "dotenv";
import path from "path";

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const toInt = (v, fallback) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
};

const config = {
  env: process.env.NODE_ENV || "development",
  port: toInt(process.env.PORT, 3000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  // MongoDB (Atlas) — primary database
  mongoUri: process.env.MONGODB_URI || "",

  // Email config
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: toInt(process.env.EMAIL_PORT, 587),
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
    from: process.env.EMAIL_FROM || "noreply@elderlyneighbourwatch.com",
  },

  // Security
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  bcryptRounds: toInt(process.env.BCRYPT_ROUNDS, 10),

  // Rate limiting
  rateLimit: {
    windowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000), // 15m
    maxRequests: toInt(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
  },

  // NOTE: Legacy Postgres placeholders kept for future reference; unused with Mongo.
  // database: { ... }
};

// Basic validation
if (!config.clientUrl)
  throw new Error("Missing required configuration: clientUrl");

export default config;
