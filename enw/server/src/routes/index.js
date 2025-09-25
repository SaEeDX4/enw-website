import { Router } from "express";
import seniorsRoutes from "./seniors.routes.js";
import volunteersRoutes from "./volunteers.routes.js";
import partnersRoutes from "./partners.routes.js";
import blogRoutes from "./blog.routes.js"; // 👈 Added for Module 8

const router = Router();

// API welcome message
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to ENW API",
    version: "1.0.0",
    endpoints: {
      seniors: "/api/seniors",
      volunteers: "/api/volunteers",
      partners: "/api/partners",
      blog: "/api/blog", // 👈 Added for clarity
    },
  });
});

// Mount route modules
router.use("/seniors", seniorsRoutes);
router.use("/volunteers", volunteersRoutes);
router.use("/partners", partnersRoutes);
router.use("/blog", blogRoutes); // 👈 Mount blog routes

export default router;
