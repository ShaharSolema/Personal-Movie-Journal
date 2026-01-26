import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Play } from "lucide-react";
import apiClient from "../lib/apiClient";
import SaveButton from "../components/SaveButton";
import LikeButton from "../components/LikeButton";

// Movie detail screen with trailer, metadata, and add-to-space actions.
const Moviepage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [youtubelink, setLink] = useState(null);
    const [error, setError] = useState(null);
    const tmdbToken = import.meta.env.VITE_TMDB_TOKEN;

    // Fallback fetch directly from TMDB if backend is unavailable.
    const tmdbFetch = async (path) => {
        if (!tmdbToken) {
            throw new Error("Missing TMDB token");
        }
        const response = await fetch(`https://api.themoviedb.org/3${path}`, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${tmdbToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`TMDB request failed: ${response.status}`);
        }
        return response.json();
    };

    useEffect(() => {
        let isActive = true;
        setError(null);

        const loadMovie = async () => {
            // Try backend first to keep API keys off the browser.
            try {
                const [movieRes, recRes, videoRes] = await Promise.all([
                    apiClient.get(`/movies/${id}`),
                    apiClient.get(`/movies/${id}/recommendations`),
                    apiClient.get(`/movies/${id}/videos`)
                ]);
                if (!isActive) {
                    return;
                }
                setMovie(movieRes.data);
                setRecommendations(recRes.data.results || []);
                const trailer = videoRes.data.results?.find(
                    (vid) => vid.site === "YouTube" && vid.type === "Trailer"
                );
                setLink(trailer?.key || null);
            } catch (apiError) {
                try {
                    // If backend fails, use TMDB directly (requires VITE_TMDB_TOKEN).
                    const [movieData, recData, videoData] = await Promise.all([
                        tmdbFetch(`/movie/${id}?language=en-US`),
                        tmdbFetch(`/movie/${id}/recommendations?language=en-US&page=1`),
                        tmdbFetch(`/movie/${id}/videos?language=en-US`)
                    ]);
                    if (!isActive) {
                        return;
                    }
                    setMovie(movieData);
                    setRecommendations(recData.results || []);
                    const trailer = videoData.results?.find(
                        (vid) => vid.site === "YouTube" && vid.type === "Trailer"
                    );
                    setLink(trailer?.key || null);
                } catch (fallbackError) {
                    if (!isActive) {
                        return;
                    }
                    setError(
                        tmdbToken
                            ? "Movie service is unavailable. Check your backend server."
                            : "Movie service is unavailable. Set VITE_TMDB_TOKEN or start backend."
                    );
                }
            }
        };

        loadMovie();

        return () => {
            isActive = false;
        };
    }, [id]);

    // "Add to Space" action is handled by SaveButton.

    if (!movie) {
        return (
            <div className="flex items-center justify-center h-screen">
                {error ? (
                    <div className="text-center text-red-400">
                        <p className="text-lg font-semibold">Movie not loaded</p>
                        <p className="mt-2 text-sm">{error}</p>
                    </div>
                ) : (
                    <>
                        <svg
                            aria-hidden="true"
                            className="inline w-8 h-8 text-neutral-tertiary animate-spin fill-danger"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#181818] text-white">
            <div
                className="relative h-[60vh]"
                style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    alt={`${movie.title} poster`}
                    className="absolute bottom-6 left-8 rounded-lg shadow-lg w-48 hidden md:block z-10"
                />
                <div className="absolute bottom-6 left-64 z-10">
                    <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                    <div className="flex items-center gap-4 mb-2">
                        <span>Rating: {movie.vote_average?.toFixed(1)}</span>
                        <span>{movie.release_date?.slice(0, 4)}</span>
                        <span>
                            {movie.runtime
                                ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                                : "Runtime N/A"}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(movie.genres || []).map((genre) => (
                            <span
                                key={genre.id}
                                className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                    <p className="max-w-2xl text-gray-200">{movie.overview}</p>
                    <div className="flex flex-wrap gap-2 mb-4 mt-4 items-center">
                        <SaveButton movie={movie} />
                        <LikeButton movie={movie} />
                        {youtubelink && (
                            <Link
                                to={`https://www.youtube.com/watch?v=${youtubelink}`}
                                target="_blank"
                            >
                                <button className="flex justify-center items-center bg-red-600 hover:bg-red-900 text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base ml-3">
                                    <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" />
                                    Watch Trailer
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Details</h2>
                <div className="bg-[#232323] rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <ul className="text-gray-300 space-y-3">
                            <li>
                                <span className="font-semibold text-white">Status: </span>
                                <span className="ml-2 text-gray-400">{movie.status}</span>
                            </li>
                            <li>
                                <span className="font-semibold text-white">Release Date:</span>
                                <span className="ml-2 text-gray-400">
                                    {movie.release_date}
                                </span>
                            </li>
                            <li>
                                <span className="font-semibold text-white">
                                    Original Language:{" "}
                                </span>
                                <span className="ml-2 text-gray-400">
                                    {movie.original_language?.toUpperCase()}
                                </span>
                            </li>
                            <li>
                                <span className="font-semibold text-white">Budget: </span>
                                <span className="ml-2 text-gray-400">
                                    {movie.budget
                                        ? `$${movie.budget.toLocaleString()}`
                                        : "N/A"}
                                </span>
                            </li>
                            <li>
                                <span className="font-semibold text-white">Revenue: </span>
                                <span className="ml-2 text-gray-400">
                                    {movie.budget
                                        ? `$${movie.revenue.toLocaleString()}`
                                        : "N/A"}
                                </span>
                            </li>
                            <li>
                                <span className="font-semibold text-white">
                                    Production Companies:{" "}
                                </span>
                                <span className="ml-2 text-gray-400">
                                    {movie.production_companies &&
                                    movie.production_companies.length > 0
                                        ? movie.production_companies
                                              .map((c) => c.name)
                                              .join(", ")
                                        : "N/A"}
                                </span>
                            </li>
                            <li>
                                <span className="font-semibold text-white">
                                    Spoken Languages:{" "}
                                </span>
                                <span className="ml-2 text-gray-400">
                                    {movie.spoken_languages &&
                                    movie.spoken_languages.length > 0
                                        ? movie.spoken_languages
                                              .map((l) => l.english_name)
                                              .join(", ")
                                        : "N/A"}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">Tagline</h3>
                        <p className="italic text-gray-400 mb-6">
                            {movie.tagline || "No tagline available"}
                        </p>
                        <h3 className="font-semibold text-white mb-2">Overview</h3>
                        <p className="text-gray-400 max-w-150">{movie.overview}</p>
                    </div>
                </div>
            </div>

            {recommendations.length > 0 && (
                <div className="p-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        You might also like...
                    </h2>
                    <div>
                        <Swiper
                            modules={[Autoplay]}
                            slidesPerView={4}
                            spaceBetween={20}
                            loop
                            autoplay={{ delay: 6000, disableOnInteraction: false }}
                            className="rounded-2xl"
                        >
                            {recommendations.slice(0, 10).map((rec) => (
                                <SwiperSlide
                                    key={rec.id}
                                    className="bg-[#232323] rounded-lg overflow-hidden hover:scale-103 transition"
                                >
                                <Link to={`/movie/${rec.id}`}>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                                        className="w-full h-70 object-cover"
                                        alt={rec.title}
                                    />
                                    <div className="p-2">
                                        <h3 className="text-sm font-semibold">
                                            {rec.title}
                                        </h3>
                                        <span className="text-xs text-gray-400">
                                            {rec.release_date?.slice(0, 4)}
                                        </span>
                                        <div className="flex gap-2 mt-2">
                                            <SaveButton movie={rec} compact />
                                            <LikeButton movie={rec} compact />
                                        </div>
                                    </div>
                                </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Moviepage;
