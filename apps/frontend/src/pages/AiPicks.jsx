import { useState } from "react";
import apiClient from "../lib/apiClient";

// AiPicks fetches movie recommendations from the backend Gemini endpoint.
const AiPicks = () => {
    const [prompt, setPrompt] = useState("");
    const [items, setItems] = useState([]);
    const [raw, setRaw] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async (event) => {
        // Prevent form refresh and start loading state.
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setItems([]);
        setRaw("");

        try {
            // Send the user's prompt to the backend Gemini endpoint.
            const response = await apiClient.get("/ai/picks", {
                params: { prompt }
            });
            setItems(response.data.items || []);
            setRaw(response.data.raw || "");
        } catch (err) {
            setError("Failed to load AI picks. Check your Gemini API key.");
        } finally {
            setIsLoading(false);
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

                {items.length > 0 && (
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={`${item.title}-${index}`}
                                className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl p-4"
                            >
                                <h2 className="text-lg font-semibold">
                                    {item.title} {item.year ? `(${item.year})` : ""}
                                </h2>
                                <p className="text-gray-400">{item.reason}</p>
                            </div>
                        ))}
                    </div>
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
