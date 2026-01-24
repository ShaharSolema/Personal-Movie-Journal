import { Router } from "express";
import authRequired from "../middleware/auth.middleware.js";
import {
    addEntry,
    deleteEntry,
    listEntries,
    updateEntry
} from "../controllers/journal.controller.js";

const router = Router();

router.use(authRequired);
router.get("/", listEntries);
router.post("/", addEntry);
router.patch("/:id", updateEntry);
router.delete("/:id", deleteEntry);

export default router;
