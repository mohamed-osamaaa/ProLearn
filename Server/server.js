import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

import connectDB from './config/db.js';
import authRoute from './routes/Auth/index.js';
import lectureRoute from './routes/Lecture/index.js';
import paymentRoute from './routes/payment/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();

// Apply global rate limiter (e.g., 100 requests per 5 minutes)
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
});

app.use(limiter); // Apply the rate limiter to all routes

app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true, // Allow cookies to be sent with requests
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);
app.use(express.json());

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use("/auth", authRoute);
app.use("/lectures", lectureRoute);
app.use("/payment", paymentRoute);



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});