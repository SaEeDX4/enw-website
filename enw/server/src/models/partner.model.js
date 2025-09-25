import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      minlength: 2,
      trim: true, // FIX: normalize
    },
    contactPerson: {
      type: String,
      required: true,
      minlength: 2,
      trim: true, // FIX: normalize
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      trim: true, // FIX: normalize
    },
    phone: {
      type: String,
      required: true,
      trim: true, // FIX: normalize
      match: /^[\d\s()+\-]{7,20}$/, // FIX: basic phone sanity check (matches frontend)
    },
    website: {
      type: String,
      trim: true, // FIX: normalize
      match: /^https?:\/\/[^\s/$.?#].[^\s]*$/i, // FIX: optional URL format if provided
    },
    organizationType: {
      type: String,
      enum: [
        "HEALTHCARE",
        "PHARMACY",
        "GROCERY",
        "BUSINESS",
        "NONPROFIT",
        "GOVERNMENT",
        "RELIGIOUS",
        "EDUCATION",
        "OTHER",
      ],
      required: true,
      index: true,
      trim: true, // FIX: normalize
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
      trim: true, // FIX: normalize
    },
    partnershipType: {
      type: String,
      required: true,
      trim: true, // FIX: normalize
      // TIP: you can later add enum here to mirror UI options if you want
    },
    services: {
      type: String,
      required: true,
      minlength: 20,
      trim: true, // FIX: normalize
    },
    targetAudience: { type: String, trim: true }, // FIX: normalize
    experience: { type: String, trim: true }, // FIX: normalize
    goals: {
      type: String,
      required: true,
      minlength: 20,
      trim: true, // FIX: normalize
    },
    resources: { type: String, trim: true }, // FIX: normalize
    timeline: { type: String, trim: true }, // FIX: normalize
    additionalInfo: { type: String, trim: true }, // FIX: normalize
    consent: {
      type: Boolean,
      default: false,
      required: true,
      // FIX: enforce explicit opt-in (aligns with frontend rule)
      validate: {
        validator: (v) => v === true,
        message: "You must agree to the partnership terms",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// NOTE: These were duplicating the inline `index: true` on fields above.
// PartnerSchema.index({ isActive: 1 });
// PartnerSchema.index({ organizationType: 1 });

export default mongoose.model("Partner", PartnerSchema);
