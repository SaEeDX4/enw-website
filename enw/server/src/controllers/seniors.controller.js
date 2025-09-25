// server/src/controllers/supportRequest.controller.js
import mongoose from "mongoose";
import Senior from "../models/senior.model.js";
import SupportRequest from "../models/supportRequest.model.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";
import logger from "../utils/logger.js";

// small helpers (or import from utils/mongoErrors.js if you created it)
const isDup = (err) => err && err.code === 11000;
const dupField = (err) =>
  err?.keyPattern ? Object.keys(err.keyPattern)[0] : undefined;
const dupValue = (err) => {
  const f = dupField(err);
  return f && err?.keyValue ? err.keyValue[f] : undefined;
};

export const submitSupportRequest = catchAsync(async (req, res, next) => {
  // start a transaction so both inserts succeed or both fail
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) Create senior
    const senior = await Senior.create([req.body], { session }); // array form is required when using session with create
    const seniorDoc = senior[0];

    logger.info(`New senior registered: ${seniorDoc._id}`);

    // 2) Create initial support request
    const supportRequest = await SupportRequest.create(
      [
        {
          seniorId: seniorDoc._id,
          supportType: req.body.supportNeeds || "OTHER",
          description: req.body.additionalInfo || "Initial support request",
          urgency: "medium",
        },
      ],
      { session }
    );
    const reqDoc = supportRequest[0];

    // 3) Commit both writes
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Support request submitted successfully",
      data: {
        seniorId: seniorDoc._id,
        requestId: reqDoc._id,
        status: reqDoc.status,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    // Duplicate email on Senior (unique index)
    if (isDup(err)) {
      const field = dupField(err) || "email";
      const value = dupValue(err);
      return res.status(409).json({
        success: false,
        message: `${field} already exists.`,
        field,
        value,
        code: "DUPLICATE_KEY",
      });
    }

    // Mongoose validation errors → 400
    if (err?.name === "ValidationError") {
      const errors = {};
      for (const [path, detail] of Object.entries(err.errors || {})) {
        errors[path] = detail?.message || "Invalid value";
      }
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
        code: "VALIDATION_ERROR",
      });
    }

    return next(err); // fallback to global error handler
  }
});

export const getSupportRequests = catchAsync(async (req, res) => {
  // sanitize pagination
  const limit = Math.min(
    Math.max(parseInt(req.query.limit ?? "10", 10), 1),
    100
  );
  const offset = Math.max(parseInt(req.query.offset ?? "0", 10), 0);

  const { status } = req.query;
  const filter = status ? { status } : {};

  const [data, total] = await Promise.all([
    SupportRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("seniorId", "firstName lastName phone email")
      .lean(),
    SupportRequest.countDocuments(filter),
  ]);

  res.json({ success: true, data, total, limit, offset });
});

export const getSupportRequestById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const request = await SupportRequest.findById(id)
    .populate("seniorId", "firstName lastName phone email address")
    .lean();

  if (!request) throw new AppError("Support request not found", 404);

  res.json({ success: true, data: request });
});

export const updateRequestStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "PENDING",
    "ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];
  if (!validStatuses.includes(status))
    throw new AppError("Invalid status", 400);

  const update = {
    status,
    ...(status === "COMPLETED" ? { completedAt: new Date() } : {}),
  };

  const request = await SupportRequest.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!request) throw new AppError("Support request not found", 404);

  logger.info(`Support request ${id} status updated to ${status}`);

  res.json({
    success: true,
    message: "Status updated successfully",
    data: request,
  });
});
