import mongoose, { Schema } from 'mongoose';

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    relaseyear:{
        type: Number,
        required: true,
        min: 1888,
        max: new Date().getFullYear()
    },
    genre: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} exceeds the limit of 5']
    },
    director: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    }
});

function arrayLimit(val) {
    return val.length <= 5;
}
export const Movie = mongoose.model('Movie', MovieSchema);