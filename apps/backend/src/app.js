import express from 'express';
import cookierParser from 'cookie-parser';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cookierParser());
app.use(cors());



export default app;