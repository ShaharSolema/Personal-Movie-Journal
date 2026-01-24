import { Router } from "express";
import {
    getMovieDetails,
    getMovieRecommendations,
    getMovieVideos,
    searchMovies
} from "../controllers/movie.controller.js";

const router = Router();

router.get("/search", searchMovies);
router.get("/:id", getMovieDetails);
router.get("/:id/recommendations", getMovieRecommendations);
router.get("/:id/videos", getMovieVideos);

export default router;
