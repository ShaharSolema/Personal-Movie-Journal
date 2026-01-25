import React, { useEffect, useMemo, useState } from "react";
import Hero from "../components/Hero.jsx";
import CardList from "../components/CardList.jsx";
import Footer from "../components/Footer.jsx";
import apiClient from "../lib/apiClient";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SaveButton from "../components/SaveButton";
import LikeButton from "../components/LikeButton";

// Home shows the default TMDB sections plus AI picks based on watched movies.
const Home = () => {
    const user = useAuthStore((state) => state.user);
    const [aiCards, setAiCards] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [loadedSections, setLoadedSections] = useState({
        hero: false,
        now_playing: false,
        popular: false,
        top_rated: false,
        upcoming: false,
        ai: false
    });

    // When user logs out, AI section is considered loaded (so it doesn't block).
    useEffect(() => {
        if (!user) {
            setLoadedSections((prev) => ({ ...prev, ai: true }));
        }
    }, [user]);

    useEffect(() => {
        // If the user is not logged in, we skip AI picks.
        if (!user) {
            setAiCards([]);
            return;
        }

        // Load the user's watched movies, then ask Gemini for similar picks.
        const loadAiPicks = async () => {
            setAiLoading(true);
            try {
                const watchedResponse = await apiClient.get("/journal", {
                    params: { status: "watched" }
                });
                const watched = watchedResponse.data || [];
                if (!watched.length) {
                    setAiCards([]);
                    return;
                }

                const watchedTitles = watched
                    .slice(0, 8)
                    .map((movie) => movie.title)
                    .filter(Boolean)
                    .join(", ");

                const prompt =
                    "Recommend 6 movies based on these watched titles: " +
                    watchedTitles +
                    ". Return JSON with title, year, reason.";

                const aiResponse = await apiClient.get("/ai/picks", {
                    params: { prompt }
                });

                const items = aiResponse.data.items || [];
                if (!items.length) {
                    setAiCards([]);
                    return;
                }

                // Convert AI picks into real TMDB cards (poster, id, rating).
                const enriched = await Promise.all(
                    items.map(async (item) => {
                        const searchQuery = item.year
                            ? `${item.title} ${item.year}`
                            : item.title;
                        const search = await apiClient.get("/movies/search", {
                            params: { query: searchQuery }
                        });
                        const match = search.data.results?.[0] || null;
                        return {
                            ...item,
                            tmdbId: match?.id || null,
                            posterPath: match?.poster_path || null,
                            rating: match?.vote_average || null,
                            releaseDate: match?.release_date || null
                        };
                    })
                );

                setAiCards(enriched);
            } catch (error) {
                setAiCards([]);
            } finally {
                setAiLoading(false);
                setLoadedSections((prev) => ({ ...prev, ai: true }));
            }
        };

        loadAiPicks();
    }, [user]);

    const isHomeReady = useMemo(
        () =>
            loadedSections.hero &&
            loadedSections.now_playing &&
            loadedSections.popular &&
            loadedSections.top_rated &&
            loadedSections.upcoming &&
            loadedSections.ai,
        [loadedSections]
    );

    return (
        <div className="p-5">
            {!isHomeReady && (
                <div className="flex items-center justify-center h-screen">
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
                </div>
            )}

            <div className={isHomeReady ? "" : "hidden"}>
                <Hero
                    onLoaded={() =>
                        setLoadedSections((prev) => ({ ...prev, hero: true }))
                    }
                />

            {aiCards.length > 0 && (
                <div className="text-white md:px-4">
                    <h2 className="pt-10 pb-5 text-lg font-medium">
                        Recommended for You (Based on Watched)
                    </h2>
                    <Swiper
                        slidesPerView={"auto"}
                        className="MySwiper"
                        spaceBetween={10}
                        loop={aiCards.length > 6}
                        loopAdditionalSlides={6}
                    >
                        {aiCards.map((item, index) => (
                            <SwiperSlide key={`${item.title}-${index}`} className="max-w-72">
                                <Link
                                    to={item.tmdbId ? `/movie/${item.tmdbId}` : "#"}
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
                                            {item.title}{" "}
                                            {item.year ? `(${item.year})` : ""}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {item.releaseDate
                                                ? item.releaseDate.slice(0, 4)
                                                : "Year unknown"}{" "}
                                            {item.rating ? `• ${item.rating.toFixed(1)}` : ""}
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
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {!aiCards.length && aiLoading && (
                <p className="text-gray-400 mt-8">Loading AI picks...</p>
            )}

                <>
                <CardList
                    title="Now Playing"
                    category="now_playing"
                    onLoaded={(category) =>
                        setLoadedSections((prev) => ({
                            ...prev,
                            [category]: true
                        }))
                    }
                />
                <CardList
                    title="Popular"
                    category="popular"
                    onLoaded={(category) =>
                        setLoadedSections((prev) => ({
                            ...prev,
                            [category]: true
                        }))
                    }
                />
                <CardList
                    title="Top Rated"
                    category="top_rated"
                    onLoaded={(category) =>
                        setLoadedSections((prev) => ({
                            ...prev,
                            [category]: true
                        }))
                    }
                />
                <CardList
                    title="Upcoming"
                    category="upcoming"
                    onLoaded={(category) =>
                        setLoadedSections((prev) => ({
                            ...prev,
                            [category]: true
                        }))
                    }
                />
                </>

                <Footer />
            </div>
        </div>
    );
};
export default Home;
