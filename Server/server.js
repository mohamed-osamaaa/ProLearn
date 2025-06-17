import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import path from 'path';

import connectDB from './config/db.js';
import authRoute from './routes/Auth/index.js';
import lectureRoute from './routes/Lecture/index.js';
import paymentRoute from './routes/payment/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();

app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true, // Allow cookies to be sent with requests
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(express.json());

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use("/auth", authRoute);
app.use("/lecture", lectureRoute);
app.use("/check-out", paymentRoute);



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});