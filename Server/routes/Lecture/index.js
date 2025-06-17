import express from 'express';

import {
    getLectureById,
    getLecturesByLevel,
    getPurchasedLectures,
    getSectionById,
} from '../../controllers/Lecture/index.js';
import verifyToken from '../../middlewares/verifyToken.js';

const router = express.Router();

router.post("/byLevel", getLecturesByLevel);
router.get("/:id", verifyToken, getLectureById);
router.get("/section/:sectionId", verifyToken, getSectionById);
router.get("/purchased/:userId", verifyToken, getPurchasedLectures);

export default router;
