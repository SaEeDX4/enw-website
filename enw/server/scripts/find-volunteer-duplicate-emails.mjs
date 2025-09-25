import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    const dups = await mongoose.connection.db
      .collection("volunteers")
      .aggregate([
        {
          $group: {
            _id: "$email",
            count: { $sum: 1 },
            ids: { $push: { id: "$_id", createdAt: "$createdAt" } },
          },
        },
        { $match: { count: { $gt: 1 } } },
      ])
      .toArray();

    if (!dups.length) {
      console.log("✅ No duplicate emails found in volunteers.");
    } else {
      console.log("⚠️ Duplicates found:");
      dups.forEach((g) => {
        console.log(`- email: ${g._id} | count: ${g.count}`);
      });
      console.log(
        "\n👉 You must remove duplicates before creating a unique index."
      );
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
