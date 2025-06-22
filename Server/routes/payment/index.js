import express from 'express';

import {
    createLectureCheckoutSession,
} from '../../controllers/Payment/index.js';
import verifyToken from '../../middlewares/verifyToken.js';

const router = express.Router();

// router.post("/", verifyToken, createLectureCheckoutSession);

router.post('/create-checkout-session', verifyToken, createLectureCheckoutSession);


router.get('/create-checkout-session', verifyToken, createLectureCheckoutSession);

export default router;
