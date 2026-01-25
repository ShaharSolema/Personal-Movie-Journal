// Gemini AI movie recommendations endpoint.
// This keeps the API key on the server (safer than exposing in the browser).
// Use v1beta for maximum model compatibility.
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

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
        const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
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
            return res.status(response.status).json({
                message: "Gemini request failed.",
                status: response.status,
                text
            });
        }

        const data = await response.json();
        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

        // Try to parse JSON; if it fails, return raw text so the UI can show it.
        try {
            const parsed = JSON.parse(text);
            return res.status(200).json({ items: parsed });
        } catch (error) {
            // Simple fallback: try to extract a JSON array if the model added extra text.
            const start = text.indexOf("[");
            const end = text.lastIndexOf("]");
            if (start !== -1 && end !== -1 && end > start) {
                try {
                    const parsed = JSON.parse(text.slice(start, end + 1));
                    return res.status(200).json({ items: parsed });
                } catch (innerError) {
                    return res.status(200).json({ items: [], raw: text });
                }
            }
            return res.status(200).json({ items: [], raw: text });
        }
    } catch (error) {
        return res.status(500).json({ message: "Failed to get AI picks." });
    }
}

export { getAiPicks };
