import { validationResult } from "express-validator";

export function validate(req, res, next) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = result.array().map((e) => ({
        msg: e.msg,
        param: e.param,
        location: e.location,
        value: e.value,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    return next(); // <-- IMPORTANT
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Validation middleware error",
      error: err?.message || String(err),
    });
  }
}
