import mongoose,{ Schema } from 'mongoose';

const JournalEntrySchema = new Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    watchStatus: {
        type: String,
        enum: ['want_to_watch', 'watched'],
        default: 'want_to_watch',
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
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength:3,
        maxlength:30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 60
    }
});


export const User=mongoose.model('User', UserSchema);
