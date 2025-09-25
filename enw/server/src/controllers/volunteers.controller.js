import Volunteer from "../models/volunteer.model.js";
import {
  isDuplicateKeyError,
  getDuplicateDetails,
  formatValidationErrors,
} from "../utils/mongoErrors.js";

export async function createVolunteer(req, res, next) {
  try {
    const doc = await Volunteer.create(req.body);
    return res.status(201).json({ data: doc });
  } catch (err) {
    // 1) Duplicate key (unique index)
    if (isDuplicateKeyError(err)) {
      const { field = "email", value } = getDuplicateDetails(err);
      return res.status(409).json({
        message: `${field} already exists.`,
        field,
        value,
        code: "DUPLICATE_KEY",
      });
    }

    // 2) Mongoose validation
    const v = formatValidationErrors(err);
    if (v) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: v,
        code: "VALIDATION_ERROR",
      });
    }

    // 3) Anything else -> global handler
    return next(err);
  }
}
// server/src/controllers/volunteers.controller.js

export const ping = (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
};
