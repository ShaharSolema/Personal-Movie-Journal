import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import apiClient from "../lib/apiClient";
import { useAuthStore } from "../store/authStore";
import { useJournalStore } from "../store/journalStore";

// LikeButton adds a movie straight to favorites and fills the heart icon.
const LikeButton = ({ movie, compact = false }) => {
    const user = useAuthStore((state) => state.user);
    const fetchEntryByTmdb = useJournalStore((state) => state.fetchEntryByTmdb);
    const updateEntry = useJournalStore((state) => state.updateEntry);
    const deleteEntry = useJournalStore((state) => state.deleteEntry);
    const [isFavorite, setIsFavorite] = useState(false);
    const [entryId, setEntryId] = useState(null);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Load favorite state if the movie already exists in the journal.
        const loadFavoriteState = async () => {
            if (!user || !movie?.id) {
                setIsFavorite(false);
                setEntryId(null);
                return;
            }
            const entry = await fetchEntryByTmdb(movie.id);
            setIsFavorite(Boolean(entry?.isFavorite));
            setEntryId(entry?._id || null);
        };
        loadFavoriteState();
    }, [user, movie, fetchEntryByTmdb]);

    const handleLike = async (event) => {
        // Prevent the parent Link from navigating when clicking this button.
        event.preventDefault();
        event.stopPropagation();

        if (!movie) {
            setError("Movie info not available.");
            return;
        }
        if (!user) {
            setError("Sign in to add favorites.");
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            if (isFavorite && entryId) {
                // If already favorite, remove favorite flag.
                await updateEntry(entryId, { isFavorite: false });
                setIsFavorite(false);

                // If this entry is not saved for later or watched, remove it fully.
                const currentEntry = await fetchEntryByTmdb(movie.id);
                if (currentEntry?.watchStatus === "none") {
                    await deleteEntry(entryId);
                }
            } else {
                // Otherwise add to favorites (creates if needed).
                const response = await apiClient.put(`/journal/tmdb/${movie.id}/favorite`, {
                    title: movie.title,
                    releaseYear: Number(movie.release_date?.slice(0, 4)) || undefined,
                    posterPath: movie.poster_path || movie.backdrop_path || "",
                    imdbRating: movie.vote_average,
                    watchStatus: "want_to_watch"
                });
                setIsFavorite(true);
                setEntryId(response.data?._id || entryId);
            }
        } catch (err) {
            setError("Could not save favorite.");
        } finally {
            setIsSaving(false);
        }
    };

    const buttonClass = compact
        ? "flex justify-center items-center bg-white hover:bg-gray-400 text-[#e50914] p-2 rounded-full cursor-pointer text-xs"
        : "flex justify-center items-center bg-white hover:bg-gray-400 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base";

    return (
        <button
            onClick={handleLike}
            disabled={isSaving}
            className={buttonClass}
            title={error || "Add to favorites"}
        >
            <Heart
                className={compact ? "w-4 h-4" : "mr-2 w-4 h-5 md:w-5 md:h-5"}
                fill={isFavorite ? "currentColor" : "none"}
            />
            {!compact && <span>{isSaving ? "Working..." : isFavorite ? "Liked" : "Like"}</span>}
        </button>
    );
};

export default LikeButton;
