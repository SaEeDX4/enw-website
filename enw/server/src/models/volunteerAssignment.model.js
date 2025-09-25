import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const VolunteerAssignmentSchema = new mongoose.Schema(
  {
    volunteerId: {
      type: ObjectId,
      ref: "Volunteer",
      required: true,
      index: true,
    },
    seniorId: {
      type: ObjectId,
      ref: "Senior",
      required: true,
      index: true,
    },
    requestId: {
      type: ObjectId,
      ref: "SupportRequest",
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    status: {
      type: String,
      default: "active",
      index: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Ensure unique assignments
VolunteerAssignmentSchema.index(
  { volunteerId: 1, seniorId: 1, requestId: 1 },
  { unique: true, sparse: true }
);

export default mongoose.model("VolunteerAssignment", VolunteerAssignmentSchema);
