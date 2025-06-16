import dotenv from 'dotenv';
import express from 'express';

import connectDB from './config/db.js';

dotenv.config();
const PORT = process.env.PORT;
const app = express();
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("ProLearn LMS API running");
});


app.listen(PORT, () => {
    console.log(`Server running`);
});
