import { Router } from "express";
import {
    getMovieDetails,
    getMovieRecommendations,
    getMovieVideos,
    getMovieList,
    searchMovies
} from "../controllers/movie.controller.js";

const router = Router();

router.get("/search", searchMovies);
router.get("/category/:category", getMovieList);
router.get("/:id", getMovieDetails);
router.get("/:id/recommendations", getMovieRecommendations);
router.get("/:id/videos", getMovieVideos);

export default router;
