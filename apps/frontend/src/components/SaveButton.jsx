import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useJournalStore } from "../store/journalStore";

// SaveButton adds a movie to "My Space" as "Want to Watch".
const SaveButton = ({ movie, onSaved, compact = false }) => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const addEntry = useJournalStore((state) => state.addEntry);
    const updateEntry = useJournalStore((state) => state.updateEntry);
    const deleteEntry = useJournalStore((state) => state.deleteEntry);
    const fetchEntryByTmdb = useJournalStore((state) => state.fetchEntryByTmdb);
    const entry = useJournalStore((state) =>
        movie?.id ? state.entriesByTmdb[movie.id] : null
    );
    const [isSaved, setIsSaved] = useState(false);
    const [entryId, setEntryId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if this movie already exists in the user's space.
        const loadSavedState = async () => {
            if (!user || !movie?.id) {
                setIsSaved(false);
                setEntryId(null);
                return;
            }
            if (entry) {
                // "Save for Later" means watchStatus === "want_to_watch".
                setIsSaved(entry.watchStatus === "want_to_watch");
                setEntryId(entry._id || null);
                return;
            }
            const fetched = await fetchEntryByTmdb(movie.id);
            setIsSaved(fetched?.watchStatus === "want_to_watch");
            setEntryId(fetched?._id || null);
        };
        loadSavedState();
    }, [user, movie?.id, entry, fetchEntryByTmdb]);

    const handleSave = async (event) => {
        // Prevent navigation when this button is inside a Link.
        event.preventDefault();
        event.stopPropagation();

        if (!user) {
            navigate("/signin");
            return;
        }
        if (!movie?.id || !movie?.title) {
            setError("Movie info not available.");
            return;
        }
        setError(null);
        setIsSaving(true);
        try {
            if (isSaved && entryId) {
                // If already saved, we allow removal even if it's a favorite.
                const currentEntry = await fetchEntryByTmdb(movie.id);
                if (currentEntry?.isFavorite) {
                    // Keep the favorite entry, but remove it from "Save for Later".
                    await updateEntry(entryId, { watchStatus: "none" });
                    setIsSaved(false);
                    return;
                }

                // Not a favorite, so it can be removed entirely.
                await deleteEntry(entryId);
                setIsSaved(false);
                setEntryId(null);
            } else {
                // Otherwise save it to My Space as "Want to Watch".
                const newEntry = await addEntry({
                    tmdbId: Number(movie.id),
                    title: movie.title,
                    releaseYear: Number(movie.release_date?.slice(0, 4)) || undefined,
                    posterPath: movie.poster_path || movie.backdrop_path || "",
                    imdbRating: movie.vote_average,
                    watchStatus: "want_to_watch",
                    isFavorite: false
                });
                setIsSaved(true);
                setEntryId(newEntry?._id || null);
                if (onSaved) {
                    onSaved(newEntry);
                }
            }
        } catch (err) {
            const serverMessage = err?.response?.data?.message;
            if (serverMessage === "Movie already in your space.") {
                // If backend says it's already saved, sync local state.
                const entry = await fetchEntryByTmdb(movie.id);
                setIsSaved(true);
                setEntryId(entry?._id || null);
                return;
            }
            setError(serverMessage || "Could not save this movie.");
        } finally {
            setIsSaving(false);
        }
    };

    const buttonClass = compact
        ? "flex justify-center items-center bg-white hover:bg-gray-400 text-[#e50914] p-2 rounded-full cursor-pointer text-xs"
        : "flex justify-center items-center bg-white hover:bg-gray-400 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base";

    return (
        <button
            onClick={handleSave}
            disabled={isSaving}
            className={buttonClass}
            title={error || "Save for Later"}
        >
            <Bookmark
                className={compact ? "w-4 h-4" : "mr-2 w-4 h-5 md:w-5 md:h-5"}
                fill={isSaved ? "currentColor" : "none"}
            />
            {!compact && (
                <span>
                    {isSaving
                        ? "Working..."
                        : isSaved
                        ? "Saved (click to remove)"
                        : "Save for Later"}
                </span>
            )}
        </button>
    );
};

export default SaveButton;
