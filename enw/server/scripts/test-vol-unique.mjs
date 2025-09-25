import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Volunteer from "../src/models/volunteer.model.js";

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = "unique-vol@example.com";
    await Volunteer.deleteMany({ email });

    await Volunteer.create({
      firstName: "SAEED",
      lastName: "SHARIFZADEH",
      email,
      phone: "111",
      age: 25,
      address: "Burnaby, BC",
      motivation: "I want to help seniors in my community.",
      emergencyContact: "X",
      emergencyPhone: "999",
      consent: true,
    });
    console.log("✅ First insert ok");

    try {
      await Volunteer.create({
        firstName: "MASSI",
        lastName: "JAFARZADEH",
        email,
        phone: "222",
        age: 30,
        address: "Vancouver, BC",
        motivation: "Another motivation text with enough length.",
        emergencyContact: "Y",
        emergencyPhone: "888",
        consent: true,
      });
      console.log("❌ Second insert unexpectedly succeeded");
    } catch (e) {
      if (e?.code === 11000) {
        console.log("✅ Unique enforced: duplicate key error (E11000)");
      } else {
        console.error("❌ Unexpected error:", e);
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
