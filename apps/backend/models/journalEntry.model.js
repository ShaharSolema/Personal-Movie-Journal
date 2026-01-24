import mongoose, { Schema } from "mongoose";

const JournalEntrySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        tmdbId: {
            type: Number,
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        releaseYear: {
            type: Number,
            min: 1888,
            max: new Date().getFullYear()
        },
        posterPath: {
            type: String,
            trim: true
        },
        imdbRating: {
            type: Number,
            min: 0,
            max: 10
        },
        watchStatus: {
            type: String,
            enum: ["want_to_watch", "watched"],
            default: "want_to_watch",
            required: true
        },
        personalRating: {
            type: Number,
            min: 1,
            max: 10
        },
        personalComment: {
            type: String,
            trim: true,
            maxlength: 2000
        },
        isFavorite: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

JournalEntrySchema.index({ user: 1, tmdbId: 1 }, { unique: true });

export const JournalEntry = mongoose.model("JournalEntry", JournalEntrySchema);
