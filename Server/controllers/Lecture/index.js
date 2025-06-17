import Lecture from '../../models/Lecture.js';
import User from '../../models/User.js';

export const getLecturesByLevel = async (req, res) => {
    try {
        const { level } = req.body;
        if (![1, 2, 3].includes(level)) {
            return res.status(400).json({ message: "Invalid level" });
        }

        const lectures = await Lecture.find({ level });
        res.json(lectures);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getLectureById = async (req, res) => {
    try {
        const userId = req.currentUser?.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const lectureId = req.params.id;

        // Check if lecture is in user's purchased list
        const isPurchased = user.purchasedLectures.some(purchasedId =>
            purchasedId.equals(lectureId)
        );

        if (!isPurchased) {
            return res.status(403).json({ message: "You don’t have access to this lecture" });
        }

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: "Lecture not found" });

        res.json(lecture);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getSectionById = async (req, res) => {
    try {
        const userId = req.currentUser?.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const sectionId = req.params.sectionId;

        // Get all lectures the user has purchased
        const lectures = await Lecture.find({ _id: { $in: user.purchasedLectures } });

        // Look for the section inside purchased lectures
        for (const lecture of lectures) {
            const section = lecture.sections.id(sectionId);
            if (section) {
                return res.json(section);
            }
        }

        return res.status(403).json({ message: "You don’t have access to this section" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getPurchasedLectures = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate("purchasedLectures");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.purchasedLectures);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
