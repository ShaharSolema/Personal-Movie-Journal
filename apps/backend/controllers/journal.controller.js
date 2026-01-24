import { JournalEntry } from "../models/journalEntry.model.js";

const VALID_STATUSES = ["want_to_watch", "watched"];

async function listEntries(req, res) {
    try {
        const filters = { user: req.user._id };
        if (req.query.status && VALID_STATUSES.includes(req.query.status)) {
            filters.watchStatus = req.query.status;
        }
        if (req.query.favorites === "true") {
            filters.isFavorite = true;
        }
        const entries = await JournalEntry.find(filters).sort({ updatedAt: -1 });
        return res.status(200).json(entries);
    } catch (error) {
        return res.status(500).json({ message: "Failed to load journal entries." });
    }
}

async function addEntry(req, res) {
    try {
        const {
            tmdbId,
            title,
            releaseYear,
            posterPath,
            imdbRating,
            watchStatus,
            personalRating,
            personalComment,
            isFavorite
        } = req.body;

        if (!tmdbId || !title) {
            return res.status(400).json({ message: "tmdbId and title are required." });
        }

        if (watchStatus && !VALID_STATUSES.includes(watchStatus)) {
            return res.status(400).json({ message: "Invalid watch status." });
        }

        const entry = await JournalEntry.create({
            user: req.user._id,
            tmdbId,
            title,
            releaseYear,
            posterPath,
            imdbRating,
            watchStatus,
            personalRating,
            personalComment,
            isFavorite
        });

        return res.status(201).json(entry);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Movie already in your space." });
        }
        return res.status(500).json({ message: "Failed to add movie to journal." });
    }
}

async function updateEntry(req, res) {
    try {
        const { id } = req.params;
        const updates = {};
        const allowedFields = [
            "watchStatus",
            "personalRating",
            "personalComment",
            "isFavorite"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (updates.watchStatus && !VALID_STATUSES.includes(updates.watchStatus)) {
            return res.status(400).json({ message: "Invalid watch status." });
        }

        const entry = await JournalEntry.findOneAndUpdate(
            { _id: id, user: req.user._id },
            updates,
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ message: "Entry not found." });
        }

        return res.status(200).json(entry);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update entry." });
    }
}

async function deleteEntry(req, res) {
    try {
        const { id } = req.params;
        const entry = await JournalEntry.findOneAndDelete({ _id: id, user: req.user._id });
        if (!entry) {
            return res.status(404).json({ message: "Entry not found." });
        }
        return res.status(200).json({ message: "Entry deleted." });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete entry." });
    }
}

export { listEntries, addEntry, updateEntry, deleteEntry };
