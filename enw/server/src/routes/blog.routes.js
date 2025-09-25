// src/routes/blog.routes.js
import { Router } from "express";
import { body, query, param } from "express-validator";
import * as blogController from "../controllers/blog.controller.js";
import { validate } from "../middleware/validation.js";

const router = Router();

// ---------- Public routes ----------
router.get(
  "/posts",
  [
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("offset").optional().isInt({ min: 0 }),
  ],
  validate,
  blogController.getPosts
);

router.get(
  "/posts/:slug",
  [param("slug").notEmpty().isSlug()],
  validate,
  blogController.getPostBySlug
);

router.get(
  "/posts/:slug/related",
  [param("slug").notEmpty().isSlug()],
  validate,
  blogController.getRelatedPosts
);

router.get("/categories", blogController.getCategories);
router.get("/tags", blogController.getTags);

// ---------- Admin routes (add auth in prod) ----------
router.post(
  "/posts",
  [
    body("title").trim().notEmpty().isLength({ max: 200 }),
    body("content").notEmpty(),
    body("status").optional().isIn(["draft", "published", "archived"]),
  ],
  validate,
  blogController.createPost
);

router.patch(
  "/posts/:id",
  [
    param("id").isMongoId(),
    body("title").optional().trim().isLength({ max: 200 }),
    body("content").optional().notEmpty(),
  ],
  validate,
  blogController.updatePost
);

router.delete(
  "/posts/:id",
  [param("id").isMongoId()],
  validate,
  blogController.deletePost
);

router.post(
  "/categories",
  [body("name").trim().notEmpty(), body("description").optional().trim()],
  validate,
  blogController.createCategory
);

// ---------- DEBUG (temporary) ----------
router.get("/debug/ping", (req, res) => {
  res.status(200).json({ ok: true, now: new Date().toISOString() });
});

export default router; // 👈 IMPORTANT: default export
