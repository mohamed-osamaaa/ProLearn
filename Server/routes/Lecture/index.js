import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import {
    checkLectureCompleted,
    createLecture,
    createSection,
    deleteLecture,
    deleteSection,
    getLectureById,
    getLecturesByLevel,
    getLectureUsersAndProgress,
    getLevelOneLectures,
    getLevelThreeLectures,
    getLevelTwoLectures,
    getPurchasedLectures,
    getSectionById,
    markSectionCompleted,
    updateLecture,
} from '../../controllers/Lecture/index.js';
import allow from '../../middlewares/allowTo.js';
import verifyToken from '../../middlewares/verifyToken.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const videoExts = ['.mp4', '.mov', '.avi'];
        const imageExts = ['.jpg', '.jpeg', '.png'];
        if (imageExts.includes(ext)) {
            const dir = "uploads/images";
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        } else if (videoExts.includes(ext)) {
            const dir = "uploads/videos";
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        } else {
            cb(new Error("Unsupported file type"), false);
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const videoExts = ['.mp4', '.mov', '.avi'];
    const imageExts = ['.jpg', '.jpeg', '.png'];
    if (imageExts.includes(ext) || videoExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only images and videos are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });



const router = express.Router();

router.post("/byLevel", getLecturesByLevel);
router.get("/:id", verifyToken, getLectureById);
router.get("/section/:sectionId", verifyToken, getSectionById);
router.get("/purchased/:userId", verifyToken, getPurchasedLectures);
router.post("/create", verifyToken, allow("instructor"),
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "video", maxCount: 1 },
    ]),
    createLecture);
router.post("/create/section", verifyToken, allow("instructor"),
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "video", maxCount: 1 },
    ]),
    createSection);
router.patch("/update", verifyToken, allow("instructor"), updateLecture);
router.delete("/delete", verifyToken, allow("instructor"), deleteLecture);
router.delete("/section/delete", verifyToken, allow("instructor"), deleteSection);
router.get("/level/1", getLevelOneLectures);
router.get("/level/2", getLevelTwoLectures);
router.get("/level/3", getLevelThreeLectures);
router.patch("/section/complete", verifyToken, allow("instructor"), markSectionCompleted);
router.post("/check/completed", verifyToken, allow("instructor"), checkLectureCompleted);
router.post("/users/progress", verifyToken, allow("instructor"), getLectureUsersAndProgress);


export default router;
