import {Movie} from '../models/movie.model.js';

const createMovie= async (req, res)=>   {
    try {
        const { title, relaseyear, genre, director, rating } = req.body;
        if (!title || !relaseyear || !genre || !director) {
            return res.status(400).json({ message: 'Title, release year, genre, and director are required' });
        }
        const newMovie = new Movie({
            title: title.trim(),
            relaseyear,
            genre,
            director: director.trim(),
            rating
        });
        await newMovie.save();
        res.status(201).json({ message: 'Movie created successfully', movie: newMovie });
    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getMovies=async (req, res) =>{
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getMovieById=async (req, res) =>{
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export {createMovie,getMovies,getMovieById};
