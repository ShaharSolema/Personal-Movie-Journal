import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from '../routes/user.route.js';
import movieRouter from '../routes/movie.route.js';
import journalRouter from '../routes/journal.route.js';
import aiRouter from '../routes/ai.route.js';

const app = express();
// Parse JSON bodies for all incoming requests.
app.use(express.json());
// Parse cookies so JWTs can be read by auth middleware.
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        credentials: true
    })
);
// Route groups keep the API surface organized by domain.
app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/journal', journalRouter);
app.use('/api/ai', aiRouter);


export default app;
