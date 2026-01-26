import { Router } from "express";
import { getAiPicks } from "../controllers/ai.controller.js";

const router = Router();

// AI picks are optional and rely on GEMINI_API_KEY.
router.get("/picks", getAiPicks);

export default router;
