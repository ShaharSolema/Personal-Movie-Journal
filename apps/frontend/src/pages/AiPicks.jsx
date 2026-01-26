import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import apiClient from "../lib/apiClient";
import SaveButton from "../components/SaveButton";
import LikeButton from "../components/LikeButton";

// AiPicks fetches movie recommendations from the backend Gemini endpoint.
const AiPicks = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");
    const [items, setItems] = useState([]);
    const [cards, setCards] = useState([]);
    const [raw, setRaw] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openingId, setOpeningId] = useState(null);
    const [swiperKey, setSwiperKey] = useState(0);

    const handleGenerate = async (event) => {
        // Prevent form refresh and start loading state.
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setItems([]);
        setRaw("");
        setCards([]);

        try {
            // Send the user's prompt to the backend Gemini endpoint.
            const response = await apiClient.get("/ai/picks", {
                params: { prompt }
            });
            setItems(response.data.items || []);
            setRaw(response.data.raw || "");
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "Failed to load AI picks. Check your Gemini API key.";
            const details = err?.response?.data?.text;
            setError(details ? `${message} ${details}` : message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Convert AI text recommendations into real movie cards using TMDB search.
        const enrichItems = async () => {
            if (!items.length) {
                setCards([]);
                return;
            }
            // Show basic cards immediately (no poster) while we enrich with TMDB data.
            setCards(items);
            try {
                const results = await Promise.all(
                    items.map(async (item) => {
                        const searchQuery = item.year
                            ? `${item.title} ${item.year}`
                            : item.title;
                        const response = await apiClient.get("/movies/search", {
                            params: { query: searchQuery }
                        });
                        const match = response.data.results?.[0] || null;
                        return {
                            ...item,
                            tmdbId: match?.id || null,
                            posterPath: match?.poster_path || null,
                            releaseDate: match?.release_date || null,
                            rating: match?.vote_average || null
                        };
                    })
                );
                setCards(results);
                // Force Swiper to re-mount so it refreshes cleanly.
                setSwiperKey((prev) => prev + 1);
            } catch (err) {
                // Keep the basic cards if TMDB enrichment fails.
                setCards((prev) => (prev.length ? prev : items));
            }
        };

        enrichItems();
    }, [items]);

    // Find the TMDB movie id by title (and year if provided), then navigate to /movie/:id.
    const handleOpenMovie = async (movie) => {
        if (!movie?.title) {
            return;
        }
        setOpeningId(movie.title);
        try {
            const searchQuery = movie.year
                ? `${movie.title} ${movie.year}`
                : movie.title;
            const response = await apiClient.get("/movies/search", {
                params: { query: searchQuery }
            });
            const firstMatch = response.data.results?.[0];
            if (!firstMatch?.id) {
                setError("Could not find that movie in TMDB.");
                return;
            }
            navigate(`/movie/${firstMatch.id}`);
        } catch (err) {
            setError("Failed to open the movie page.");
        } finally {
            setOpeningId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white px-6 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold mb-4">Get AI Movie Picks</h1>
                <p className="text-gray-400 mb-6">
                    Describe your mood or genre and Gemini will suggest movies.
                </p>

                <form onSubmit={handleGenerate} className="flex gap-3 mb-8">
                    <input
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        className="flex-1 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white"
                        placeholder="Example: cozy sci-fi with strong characters"
                    />
                    <button
                        type="submit"
                        className="bg-[#e50914] px-6 py-3 rounded-lg hover:bg-[#b20710]"
                        disabled={isLoading}
                    >
                        {isLoading ? "Thinking..." : "Generate"}
                    </button>
                </form>

                {error && <p className="text-red-400">{error}</p>}

                {!isLoading && !error && cards.length === 0 && items.length === 0 && (
                    <p className="text-gray-400">No AI picks yet. Try a new prompt.</p>
                )}

                {cards.length > 0 && (
                    <Swiper
                        key={swiperKey}
                        slidesPerView={"auto"}
                        className="MySwiper"
                        spaceBetween={10}
                        loop={cards.length > 6}
                        loopAdditionalSlides={6}
                    >
                        {cards.map((item, index) => (
                            <SwiperSlide key={`${item.title}-${index}`} className="max-w-72">
                                <Link
                                    to={item.tmdbId ? `/movie/${item.tmdbId}` : "#"}
                                    onClick={(event) => {
                                        if (!item.tmdbId) {
                                            event.preventDefault();
                                            handleOpenMovie(item);
                                        }
                                    }}
                                    className="block bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#e50914] transition cursor-pointer"
                                >
                                    <div className="w-full h-56 bg-[#141414]">
                                        {item.posterPath ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                                No Poster
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold">
                                            {item.title} {item.year ? `(${item.year})` : ""}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {item.releaseDate
                                                ? item.releaseDate.slice(0, 4)
                                                : "Year unknown"}{" "}
                                            {item.rating ? `- ${item.rating.toFixed(1)}` : ""}
                                        </p>
                                        <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                                            {item.reason}
                                        </p>
                                        {item.tmdbId && (
                                            <div className="flex gap-2 mt-3">
                                                <SaveButton
                                                    compact
                                                    movie={{
                                                        id: item.tmdbId,
                                                        title: item.title,
                                                        release_date: item.releaseDate,
                                                        poster_path: item.posterPath,
                                                        vote_average: item.rating
                                                    }}
                                                />
                                                <LikeButton
                                                    compact
                                                    movie={{
                                                        id: item.tmdbId,
                                                        title: item.title,
                                                        release_date: item.releaseDate,
                                                        poster_path: item.posterPath,
                                                        vote_average: item.rating
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {openingId === item.title && (
                                            <p className="text-sm text-red-300 mt-3">
                                                Opening...
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                {raw && (
                    <div className="mt-6">
                        <p className="text-gray-400 mb-2">Raw response:</p>
                        <pre className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg p-4 text-sm whitespace-pre-wrap">
                            {raw}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiPicks;
