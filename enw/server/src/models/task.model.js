import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const TaskSchema = new mongoose.Schema(
  {
    requestId: {
      type: ObjectId,
      ref: "SupportRequest",
      required: true,
      index: true,
    },
    volunteerId: {
      type: ObjectId,
      ref: "Volunteer",
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    scheduledDate: Date,
    completedDate: Date,
    duration: Number, // in minutes
    status: {
      type: String,
      default: "pending",
      index: true,
    },
    feedback: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for task queries
TaskSchema.index({ requestId: 1, status: 1 });
TaskSchema.index({ volunteerId: 1, scheduledDate: 1 });

export default mongoose.model("Task", TaskSchema);
