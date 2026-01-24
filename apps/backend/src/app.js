import express from 'express';
import cookierParser from 'cookie-parser';
import cors from 'cors';
import userRouter from '../routes/user.route.js';


const app = express();
app.use(express.json());
app.use(cookierParser());
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        credentials: true
    })
);
app.use('/api/users', userRouter);



export default app;
