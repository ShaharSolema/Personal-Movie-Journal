const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_LIST_CATEGORIES = new Set(["now_playing", "popular", "top_rated", "upcoming"]);

function getTmdbHeaders() {
    const token = process.env.TMDB_TOKEN;
    if (!token) {
        throw new Error("TMDB_TOKEN is not configured.");
    }
    return {
        accept: "application/json",
        Authorization: `Bearer ${token}`
    };
}

async function tmdbRequest(path, queryParams = {}) {
    const url = new URL(`${TMDB_BASE_URL}${path}`);
    Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, String(value));
        }
    });

    const response = await fetch(url, {
        method: "GET",
        headers: getTmdbHeaders()
    });

    if (!response.ok) {
        const body = await response.text();
        const error = new Error(`TMDB request failed: ${response.status}`);
        error.status = response.status;
        error.body = body;
        throw error;
    }

    return response.json();
}

async function getMovieList(req, res) {
    try {
        const { category } = req.params;
        if (!TMDB_LIST_CATEGORIES.has(category)) {
            return res.status(400).json({ message: "Unsupported category." });
        }
        const data = await tmdbRequest(`/movie/${category}`, {
            language: "en-US",
            page: req.query.page || 1
        });
        return res.status(200).json(data);
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ message: "Failed to load movies." });
    }
}

async function searchMovies(req, res) {
    try {
        const query = req.query.query || "";
        if (!query.trim()) {
            return res.status(400).json({ message: "Query is required." });
        }
        const data = await tmdbRequest("/search/movie", {
            query,
            language: "en-US",
            page: req.query.page || 1,
            include_adult: false
        });
        return res.status(200).json(data);
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ message: "Failed to search movies." });
    }
}

async function getMovieDetails(req, res) {
    try {
        const { id } = req.params;
        const data = await tmdbRequest(`/movie/${id}`, { language: "en-US" });
        return res.status(200).json(data);
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ message: "Failed to load movie details." });
    }
}

async function getMovieRecommendations(req, res) {
    try {
        const { id } = req.params;
        const data = await tmdbRequest(`/movie/${id}/recommendations`, {
            language: "en-US",
            page: 1
        });
        return res.status(200).json(data);
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ message: "Failed to load recommendations." });
    }
}

async function getMovieVideos(req, res) {
    try {
        const { id } = req.params;
        const data = await tmdbRequest(`/movie/${id}/videos`, { language: "en-US" });
        return res.status(200).json(data);
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ message: "Failed to load videos." });
    }
}

export {
    getMovieList,
    searchMovies,
    getMovieDetails,
    getMovieRecommendations,
    getMovieVideos
};
