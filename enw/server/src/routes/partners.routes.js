import { Router } from "express";
import { ping, createPartner } from "../controllers/partners.controller.js";

const router = Router();

router.get("/ping", ping);
router.post("/", createPartner);

export default router;
