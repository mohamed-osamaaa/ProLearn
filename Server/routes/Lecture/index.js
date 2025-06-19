import express from 'express';
import multer from 'multer';
import path from 'path';

import {
    checkLectureCompleted,
    createLecture,
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
        const fileType = file.mimetype.split("/")[0];
        if (fileType === "image") {
            cb(null, "uploads/images");
        } else if (fileType === "video") {
            cb(null, "uploads/videos");
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
    const allowedTypes = ["image", "video"];
    const fileType = file.mimetype.split("/")[0];
    if (allowedTypes.includes(fileType)) {
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
