import { Router } from "express";
import authRequired from "../middleware/auth.middleware.js";
import {
    addEntry,
    deleteEntry,
    listEntries,
    updateEntry,
    getEntryByTmdb,
    setFavoriteByTmdb
} from "../controllers/journal.controller.js";

const router = Router();

router.use(authRequired);
router.get("/", listEntries);
router.post("/", addEntry);
router.get("/tmdb/:tmdbId", getEntryByTmdb);
router.put("/tmdb/:tmdbId/favorite", setFavoriteByTmdb);
router.patch("/:id", updateEntry);
router.delete("/:id", deleteEntry);

export default router;
