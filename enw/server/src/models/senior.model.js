import mongoose from "mongoose";

const SeniorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      // ⚠️ اینجا index و unique حذف شدن
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 120,
      required: true,
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
    },
    emergencyContact: {
      type: String,
      required: true,
    },
    emergencyPhone: {
      type: String,
      required: true,
    },
    healthConditions: String,
    preferredTimes: String,
    additionalInfo: String,
    consent: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes — فقط یک بار، پایین مدل
SeniorSchema.index({ email: 1 }, { unique: true }); // unique اینجا تعریف شد
SeniorSchema.index({ createdAt: -1 });

export default mongoose.model("Senior", SeniorSchema);
