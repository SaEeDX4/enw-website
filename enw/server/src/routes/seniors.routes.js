// server/src/routes/seniors.routes.js
import { Router } from "express";
import { body, param } from "express-validator";

import * as seniorsController from "../controllers/supportRequest.controller.js";
import { validate } from "../middleware/validation.js";

const router = Router();

/**
 * Validation for submitting a Support Request (creates Senior + SupportRequest)
 * Notes:
 * - Use .isMobilePhone("any") so it doesn't fail on locale.
 * - consent is a real boolean true in JSON (not the string "true").
 */
const supportRequestValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .normalizeEmail(),
  body("phone").isMobilePhone("any").withMessage("Invalid phone number"),
  body("age")
    .isInt({ min: 18, max: 120 })
    .withMessage("Age must be between 18 and 120"),
  body("address")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Address must be at least 10 characters"),
  body("emergencyContact")
    .trim()
    .notEmpty()
    .withMessage("Emergency contact is required"),
  body("emergencyPhone")
    .isMobilePhone("any")
    .withMessage("Invalid emergency phone number"),
  body("supportNeeds")
    .trim()
    .notEmpty()
    .withMessage("Support needs must be specified"),
  body("consent")
    .isBoolean()
    .withMessage("Consent must be a boolean")
    .bail()
    .custom((v) => v === true)
    .withMessage("Consent must be provided (true)"),
];

// --- Routes ---

// ✅ Create SupportRequest (alias both plural and singular)
router.post(
  "/support-requests",
  supportRequestValidation,
  validate,
  seniorsController.submitSupportRequest
);
router.post(
  "/support-request", // singular for tests
  supportRequestValidation,
  validate,
  seniorsController.submitSupportRequest
);

// List SupportRequests — GET /api/seniors/support-requests
router.get("/support-requests", seniorsController.getSupportRequests);

// Get one SupportRequest — GET /api/seniors/support-requests/:id
router.get(
  "/support-requests/:id",
  [param("id").isMongoId().withMessage("Invalid request id")],
  validate,
  seniorsController.getSupportRequestById
);

// Update SupportRequest status — PUT /api/seniors/support-requests/:id/status
router.put(
  "/support-requests/:id/status",
  [param("id").isMongoId().withMessage("Invalid request id")],
  validate,
  seniorsController.updateRequestStatus
);

// ✅ Alias for integration test: PATCH /api/seniors/support-request/:id/status (singular + PATCH)
router.patch(
  "/support-request/:id/status",
  [param("id").isMongoId().withMessage("Invalid request id")],
  validate,
  seniorsController.updateRequestStatus
);

export default router;
