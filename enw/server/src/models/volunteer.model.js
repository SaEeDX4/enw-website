import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema(
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
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      trim: true,
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
    occupation: String,
    skills: [
      {
        type: String,
        enum: [
          "SHOPPING",
          "TRANSPORTATION",
          "COMPANIONSHIP",
          "HOUSEWORK",
          "MEDICATION",
          "TECHNOLOGY",
          "OTHER",
        ],
      },
    ],
    availability: [{ type: String }],
    experience: String,
    motivation: {
      type: String,
      required: true,
      minlength: 20,
    },
    references: String,
    emergencyContact: {
      type: String,
      required: true,
    },
    emergencyPhone: {
      type: String,
      required: true,
    },
    backgroundCheck: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["PENDING_VERIFICATION", "ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "PENDING_VERIFICATION",
      // ⚠️ index: true حذف شد تا تکراری نشه
    },
    consent: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes — همه ایندکس‌ها یک‌جا برای یکدستی
VolunteerSchema.index({ email: 1 }, { unique: true }); // چون email الزامی است، sparse لازم نیست
VolunteerSchema.index({ status: 1 });
VolunteerSchema.index({ createdAt: -1 });

export default mongoose.model("Volunteer", VolunteerSchema);
