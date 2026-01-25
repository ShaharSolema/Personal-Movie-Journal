import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../lib/apiClient";
import SaveButton from "../components/SaveButton";
import LikeButton from "../components/LikeButton";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const runSearch = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/movies/search`, {
                params: { query: searchTerm }
            });
            setResults(response.data.results || []);
        } catch (err) {
            setError("Failed to load search results.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Keep local input in sync when the URL changes (navbar search).
        setQuery(initialQuery);
        if (initialQuery) {
            runSearch(initialQuery);
        }
    }, [initialQuery]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Update the URL so the navbar search box stays synced.
        setSearchParams({ q: query });
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setQuery(value);
        // Update URL live so navbar search matches this input.
        setSearchParams({ q: value });
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white px-6 py-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-semibold mb-4">Search Movies</h1>
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        value={query}
                        onChange={handleChange}
                        className="flex-1 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white"
                        placeholder="Search by title..."
                    />
                    <button
                        type="submit"
                        className="bg-[#e50914] px-6 py-3 rounded-lg hover:bg-[#b20710] cursor-pointer"
                    >
                        Search
                    </button>
                </form>

                {isLoading && <p className="mt-6 text-gray-400">Loading...</p>}
                {error && <p className="mt-6 text-red-400">{error}</p>}

                {!isLoading && !error && results.length > 0 && (
                    <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
                        {results.map((movie) => (
                            <Link
                                to={`/movie/${movie.id}`}
                                key={movie.id}
                                className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer"
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-72 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold">{movie.title}</h2>
                                    <p className="text-sm text-gray-400">
                                        {movie.release_date?.slice(0, 4) || "Unknown"}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        IMDb Rating: {movie.vote_average?.toFixed(1) || "N/A"}
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <SaveButton movie={movie} compact />
                                        <LikeButton movie={movie} compact />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!isLoading && !error && results.length === 0 && initialQuery && (
                    <p className="mt-6 text-gray-400">No results found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;
