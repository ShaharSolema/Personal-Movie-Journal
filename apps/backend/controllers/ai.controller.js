// Gemini AI movie recommendations endpoint.
// This keeps the API key on the server (safer than exposing in the browser).
// Use v1beta for maximum model compatibility.
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_CACHE_TTL_MS = 5 * 60 * 1000;
const geminiCache = new Map();
const geminiInFlight = new Map();

function buildPrompt(userPrompt) {
    const basePrompt =
        "You are a movie expert. Recommend 8 movies and return only JSON. " +
        "Each item must have: title, year, reason. " +
        "No extra text, only valid JSON array.";
    if (!userPrompt) {
        return basePrompt;
    }
    return `${basePrompt} User preference: ${userPrompt}`;
}

async function getAiPicks(req, res) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "GEMINI_API_KEY not set." });
        }

        const prompt = buildPrompt(req.query.prompt || "");
        const cacheKey = `${req.user?._id || "anon"}::${prompt}`;
        const cached = geminiCache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
            return res.status(200).json(cached.payload);
        }
        if (geminiInFlight.has(cacheKey)) {
            const payload = await geminiInFlight.get(cacheKey);
            return res.status(200).json(payload);
        }

        const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const pendingRequest = (async () => {
            const response = await fetch(
                `${GEMINI_BASE_URL}/models/${model}:generateContent`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-goog-api-key": apiKey
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: prompt }]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.7
                        }
                    })
                }
            );

            if (!response.ok) {
                const text = await response.text();
                return {
                    error: true,
                    status: response.status,
                    payload: {
                        message: "Gemini request failed.",
                        status: response.status,
                        text
                    }
                };
            }

            const data = await response.json();
            const text =
                data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

            // Try to parse JSON; if it fails, return raw text so the UI can show it.
            try {
                const parsed = JSON.parse(text);
                return { payload: { items: parsed } };
            } catch (error) {
                // Simple fallback: try to extract a JSON array if the model added extra text.
                const start = text.indexOf("[");
                const end = text.lastIndexOf("]");
                if (start !== -1 && end !== -1 && end > start) {
                    try {
                        const parsed = JSON.parse(text.slice(start, end + 1));
                        return { payload: { items: parsed } };
                    } catch (innerError) {
                        return { payload: { items: [], raw: text } };
                    }
                }
                return { payload: { items: [], raw: text } };
            }
        })();

        geminiInFlight.set(cacheKey, pendingRequest.then((result) => result.payload));
        const result = await pendingRequest;
        geminiInFlight.delete(cacheKey);
        if (result.error) {
            return res.status(result.status).json(result.payload);
        }
        const payload = result.payload;
        geminiCache.set(cacheKey, {
            expiresAt: Date.now() + GEMINI_CACHE_TTL_MS,
            payload
        });
        return res.status(200).json(payload);
    } catch (error) {
        return res.status(500).json({ message: "Failed to get AI picks." });
    }
}

export { getAiPicks };
