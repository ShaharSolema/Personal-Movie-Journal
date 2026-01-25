import { Router } from "express";
import { getAiPicks } from "../controllers/ai.controller.js";

const router = Router();

router.get("/picks", getAiPicks);

export default router;
