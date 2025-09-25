// scripts/check-indexes.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";

// env رو لود کن
dotenv.config();

// مدل‌ها رو ایمپورت کن (مسیرها رو مطابق پروژهٔ خودت اصلاح کن)
import Senior from "../src/models/senior.model.js";
import Volunteer from "../src/models/volunteer.model.js";

(async () => {
  try {
    // توصیه: در محیط توسعه autoIndex روشن باشد
    mongoose.set("autoIndex", true);

    // اتصال به دیتابیس
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB");

    // سینک ایندکس‌ها با مدل‌ها
    await Senior.syncIndexes();
    await Volunteer.syncIndexes();
    console.log("✅ syncIndexes() done for Senior & Volunteer");

    // گرفتن لیست ایندکس‌ها
    const seniorIndexes = await mongoose.connection.db
      .collection("seniors")
      .indexes();
    const volunteerIndexes = await mongoose.connection.db
      .collection("volunteers")
      .indexes();

    console.log("\n📚 seniors indexes:");
    console.table(
      seniorIndexes.map((i) => ({
        name: i.name,
        key: i.key,
        unique: !!i.unique,
        sparse: !!i.sparse,
      }))
    );

    console.log("\n📚 volunteers indexes:");
    console.table(
      volunteerIndexes.map((i) => ({
        name: i.name,
        key: i.key,
        unique: !!i.unique,
        sparse: !!i.sparse,
      }))
    );

    // خروج
    await mongoose.disconnect();
    console.log("\n👋 Done.");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
