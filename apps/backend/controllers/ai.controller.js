// Gemini AI movie recommendations endpoint.
// This keeps the API key on the server (safer than exposing in the browser).
const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

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
        const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(500).json({ message: "Gemini request failed.", text });
        }

        const data = await response.json();
        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

        // Try to parse JSON; if it fails, return raw text so the UI can show it.
        try {
            const parsed = JSON.parse(text);
            return res.status(200).json({ items: parsed });
        } catch (error) {
            return res.status(200).json({ items: [], raw: text });
        }
    } catch (error) {
        return res.status(500).json({ message: "Failed to get AI picks." });
    }
}

export { getAiPicks };
