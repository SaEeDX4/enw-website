import { Router } from "express";
import { ping, createVolunteer } from "../controllers/volunteers.controller.js";

const router = Router();

// Health/test
router.get("/ping", ping);

// Create volunteer application
router.post("/", createVolunteer);

// Alias to match frontend that posts to /volunteers/applications
router.post("/applications", createVolunteer);

// (Future)
// router.get("/", listVolunteers);
// router.get("/:id", getVolunteerById);
// router.put("/:id", updateVolunteer);
// router.delete("/:id", deleteVolunteer);

export default router;
