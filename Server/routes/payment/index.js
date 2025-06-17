import express from 'express';

import {
    createLectureCheckoutSession,
} from '../../controllers/Payment/index.js';
import verifyToken from '../../middlewares/verifyToken.js';

const router = express.Router();

router.post("/", verifyToken, createLectureCheckoutSession);

export default router;
