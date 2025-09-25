import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const SupportRequestSchema = new mongoose.Schema(
  {
    seniorId: {
      type: ObjectId,
      ref: "Senior",
      required: true,
      index: true,
    },
    supportType: {
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
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    preferredDate: Date,
    status: {
      type: String,
      enum: ["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    notes: String,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
SupportRequestSchema.index({ seniorId: 1, status: 1 });
SupportRequestSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("SupportRequest", SupportRequestSchema);
