// src/config/db.js
import mongoose from "mongoose";
import logger from "../utils/logger.js";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
      // اگر جایی dbName جدا داری، اینجا هم ست کن:
      // dbName: process.env.MONGODB_DB || undefined,
    });

    // ✅ بلافاصله بعد از اتصال موفق، اطلاعات دیتابیس را لاگ کن
    const { name, host, port } = mongoose.connection;
    logger.info(`[DB] name: ${name}  host: ${host}  port: ${port ?? "-"}`);

    logger.info("✅ MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function disconnectDB() {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
}

// (اختیاری) تابع کمک‌کننده برای چاپ سریع اطلاعات اتصال
export function logDbInfo() {
  const { name, host, port } = mongoose.connection;
  logger.info(
    `[DB] name: ${name ?? "-"}  host: ${host ?? "-"}  port: ${port ?? "-"}`
  );
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});
