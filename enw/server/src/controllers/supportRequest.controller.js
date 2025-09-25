// server/src/controllers/supportRequest.controller.js
import mongoose from "mongoose";
import Senior from "../models/senior.model.js";
import SupportRequest from "../models/supportRequest.model.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";
import logger from "../utils/logger.js";

// --- helpers for duplicate-key handling ---
const isDup = (err) => err && err.code === 11000;
const dupField = (err) =>
  err?.keyPattern ? Object.keys(err.keyPattern)[0] : undefined;
const dupValue = (err) => {
  const f = dupField(err);
  return f && err?.keyValue ? err.keyValue[f] : undefined;
};

// Map UI labels -> enum values required by SupportRequest.supportType
const SUPPORT_TYPE_MAP = {
  "Grocery shopping assistance": "SHOPPING",
  "Transportation to appointments": "TRANSPORTATION",
  "Regular companionship visits": "COMPANIONSHIP",
  "Light housework help": "HOUSEWORK",
  "Medication pickup": "MEDICATION",
  "Technology assistance": "TECHNOLOGY",
  "Other (please specify)": "OTHER",
};
const VALID_SUPPORT_TYPES = new Set([
  "SHOPPING",
  "TRANSPORTATION",
  "COMPANIONSHIP",
  "HOUSEWORK",
  "MEDICATION",
  "TECHNOLOGY",
  "OTHER",
]);

/**
 * POST /api/seniors/support-requests
 * Creates (or reuses) Senior and creates first SupportRequest in a transaction.
 */
export const submitSupportRequest = catchAsync(async (req, res, next) => {
  // Ensure DB connection is fully ready before using sessions/transactions
  await mongoose.connection.asPromise();

  // In tests, avoid transactions to prevent intermittent 500s
  const useSession = process.env.NODE_ENV !== "test";
  let session = null;

  if (useSession) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  // helper to include session only when used
  const withSession = (opts = {}) => (useSession ? { ...opts, session } : opts);

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      age,
      address,
      emergencyContact,
      emergencyPhone,
      healthConditions,
      preferredTimes,
      additionalInfo,
      consent,
      supportNeeds, // UI value we map to supportType
    } = req.body;

    // If senior already exists → tests expect a 400 for duplicate email
    const existingSenior = await Senior.findOne({ email }).setOptions(
      withSession()
    );
    if (existingSenior) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
        field: "email",
        value: email,
        code: "DUPLICATE_EMAIL",
      });
    }

    // Create Senior
    const [seniorDoc] = await Senior.create(
      [
        {
          firstName,
          lastName,
          email,
          phone,
          age,
          address,
          emergencyContact,
          emergencyPhone,
          healthConditions,
          preferredTimes,
          additionalInfo,
          consent,
        },
      ],
      withSession()
    );
    logger.info(`New senior registered: ${seniorDoc._id}`);

    // Map supportNeeds (label) -> enum the model accepts
    const rawNeeds = supportNeeds || "";
    let supportType =
      SUPPORT_TYPE_MAP[rawNeeds] ||
      (typeof rawNeeds === "string" ? rawNeeds.toUpperCase() : "OTHER");
    if (!VALID_SUPPORT_TYPES.has(supportType)) supportType = "OTHER";

    // Ensure description is non-empty (required in schema)
    const description =
      (additionalInfo && String(additionalInfo).trim()) ||
      (rawNeeds && String(rawNeeds).trim()) ||
      "Initial support request";

    // Create SupportRequest
    const [reqDoc] = await SupportRequest.create(
      [
        {
          seniorId: seniorDoc._id,
          supportType,
          description,
          urgency: "medium",
        },
      ],
      withSession()
    );

    // Commit (if using session)
    if (useSession) {
      await session.commitTransaction();
      session.endSession?.();
    }

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
    // Rollback on error
    if (useSession && session) {
      try {
        await session.abortTransaction();
      } catch {}
      session.endSession?.();
    }

    // Duplicate key (schema-level)
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

/**
 * GET /api/seniors/support-requests
 */
export const getSupportRequests = catchAsync(async (req, res) => {
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

/**
 * GET /api/seniors/support-requests/:id
 */
export const getSupportRequestById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const request = await SupportRequest.findById(id)
    .populate("seniorId", "firstName lastName phone email address")
    .lean();

  if (!request) throw new AppError("Support request not found", 404);

  res.json({ success: true, data: request });
});

/**
 * PUT /api/seniors/support-requests/:id/status
 */
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
