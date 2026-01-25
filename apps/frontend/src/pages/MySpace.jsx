import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJournalStore } from "../store/journalStore";
import { useAuthStore } from "../store/authStore";

const tabs = [
    { label: "Want to Watch", value: "want_to_watch" },
    { label: "Watched", value: "watched" },
    { label: "Favorites", value: "favorites" }
];

const MySpace = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const {
        entries,
        fetchEntries,
        updateEntry,
        deleteEntry,
        setEntryLocal,
        removeEntryLocal,
        isLoading,
        error
    } = useJournalStore();
    const [activeTab, setActiveTab] = useState("want_to_watch");
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        personalRating: "",
        personalComment: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/signin");
            return;
        }
        // Load entries every time the user or the selected tab changes.
        if (activeTab === "favorites") {
            fetchEntries({ favorites: true });
        } else {
            fetchEntries({ status: activeTab });
        }
    }, [activeTab, fetchEntries, navigate, user]);

    // Start editing a specific movie entry.
    const startEdit = (entry) => {
        setEditingId(entry._id);
        setEditForm({
            personalRating: entry.personalRating || "",
            personalComment: entry.personalComment || ""
        });
    };

    const handleSave = async (entryId) => {
        // Save rating/comment edits for a specific entry.
        await updateEntry(entryId, {
            personalRating: editForm.personalRating
                ? Number(editForm.personalRating)
                : undefined,
            personalComment: editForm.personalComment
        });
        setEditingId(null);
    };

    const handleToggleFavorite = async (entry) => {
        // Optimistically update for instant feedback.
        setEntryLocal(entry._id, { isFavorite: !entry.isFavorite });
        // If we are on the Favorites tab and user un-favorites, remove it now.
        if (activeTab === "favorites" && entry.isFavorite) {
            removeEntryLocal(entry._id);
        }
        await updateEntry(entry._id, { isFavorite: !entry.isFavorite });
    };

    const handleStatusChange = async (entry, status) => {
        // Update the UI immediately.
        setEntryLocal(entry._id, { watchStatus: status });

        // If the entry no longer belongs in this tab, remove it right away.
        if (activeTab !== "favorites" && status !== activeTab) {
            removeEntryLocal(entry._id);
        }

        await updateEntry(entry._id, { watchStatus: status });
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#141414] text-white px-6 py-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-semibold mb-6">My Space</h1>

                <div className="flex gap-4 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`px-4 py-2 rounded-full border ${
                                activeTab === tab.value
                                    ? "bg-[#e50914] border-[#e50914]"
                                    : "border-[#2a2a2a] text-gray-300 hover:border-[#e50914] hover:text-[#e50914]"
                            } cursor-pointer`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {isLoading && <p className="text-gray-400">Loading...</p>}
                {error && <p className="text-red-400">{error}</p>}

                {!isLoading && !error && entries.length === 0 && (
                    <p className="text-gray-400">No entries yet.</p>
                )}

                <div className="space-y-6">
                    {entries.map((entry) => (
                        <div
                            key={entry._id}
                            className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl p-4 flex flex-col md:flex-row gap-4"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w300${entry.posterPath}`}
                                alt={entry.title}
                                className="w-32 h-48 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            {entry.title}
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            {entry.releaseYear || "Unknown"} - IMDb{" "}
                                            {entry.imdbRating?.toFixed(1) || "N/A"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleToggleFavorite(entry)}
                                        className={`text-sm px-3 py-1 rounded-full border transition cursor-pointer ${
                                            entry.isFavorite
                                                ? "border-[#e50914] text-[#e50914] hover:bg-[#2a2a2a]"
                                                : "border-[#2a2a2a] text-gray-300 hover:border-[#e50914] hover:text-[#e50914]"
                                        }`}
                                    >
                                        {entry.isFavorite ? "Favorited" : "Favorite"}
                                    </button>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() =>
                                            handleStatusChange(entry, "want_to_watch")
                                        }
                                        className={`px-3 py-1 rounded-full border transition cursor-pointer ${
                                            entry.watchStatus === "want_to_watch"
                                                ? "border-[#e50914] text-[#e50914] hover:bg-[#2a2a2a]"
                                                : "border-[#2a2a2a] text-gray-300 hover:border-[#e50914] hover:text-[#e50914]"
                                        }`}
                                    >
                                        Want to Watch
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleStatusChange(entry, "watched")
                                        }
                                        className={`px-3 py-1 rounded-full border transition cursor-pointer ${
                                            entry.watchStatus === "watched"
                                                ? "border-[#e50914] text-[#e50914] hover:bg-[#2a2a2a]"
                                                : "border-[#2a2a2a] text-gray-300 hover:border-[#e50914] hover:text-[#e50914]"
                                        }`}
                                    >
                                        Watched
                                    </button>
                                </div>

                                <div className="mt-4">
                                    {editingId === entry._id ? (
                                        <div className="space-y-3">
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={editForm.personalRating}
                                                onChange={(event) =>
                                                    setEditForm((prev) => ({
                                                        ...prev,
                                                        personalRating: event.target.value
                                                    }))
                                                }
                                                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2"
                                                placeholder="Your rating (1-10)"
                                            />
                                            <textarea
                                                value={editForm.personalComment}
                                                onChange={(event) =>
                                                    setEditForm((prev) => ({
                                                        ...prev,
                                                        personalComment: event.target.value
                                                    }))
                                                }
                                                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 h-24"
                                                placeholder="Your thoughts..."
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleSave(entry._id)}
                                                    className="px-4 py-2 rounded-lg bg-[#e50914] hover:bg-[#b20710] cursor-pointer"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-4 py-2 rounded-lg border border-[#2a2a2a] hover:border-[#e50914] hover:text-[#e50914] cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 text-gray-300">
                                            <p>
                                                Rating: {entry.personalRating || "Not rated"}
                                            </p>
                                            <p>
                                                Notes:{" "}
                                                {entry.personalComment || "No comments yet."}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => startEdit(entry)}
                                        className="px-3 py-2 rounded-lg border border-[#2a2a2a] hover:border-[#e50914] hover:text-[#e50914] cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteEntry(entry._id)}
                                        className="px-3 py-2 rounded-lg border border-[#2a2a2a] text-red-400 hover:border-red-400 cursor-pointer"
                                    >
                                        Remove from My space
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MySpace;
