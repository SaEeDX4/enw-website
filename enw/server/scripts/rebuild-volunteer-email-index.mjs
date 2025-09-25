import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Volunteer from "../src/models/volunteer.model.js";

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected");

    const coll = mongoose.connection.db.collection("volunteers");

    // 1) Drop old index if it exists
    const indexes = await coll.indexes();
    const hasEmailIndex = indexes.some((i) => i.name === "email_1");
    if (hasEmailIndex) {
      console.log("ℹ️ Dropping existing email_1 index...");
      try {
        await coll.dropIndex("email_1");
        console.log("✅ Dropped email_1");
      } catch (e) {
        console.log("⚠️ dropIndex warning:", e.message);
      }
    } else {
      console.log("ℹ️ No existing email_1 index found, continue...");
    }

    // 2) Rebuild from model (unique:true is defined in the schema indexes)
    await Volunteer.syncIndexes();
    console.log("✅ syncIndexes() done");

    // 3) Show final indexes
    const final = await coll.indexes();
    console.table(
      final.map((i) => ({ name: i.name, key: i.key, unique: !!i.unique }))
    );

    await mongoose.disconnect();
    console.log("👋 Done");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
