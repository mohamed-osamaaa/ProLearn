import Lecture from '../../models/Lecture.js';
import User from '../../models/User.js';
import UserLectureProgress from '../../models/UserLectureProgress.js';

export const getLecturesByLevel = async (req, res) => {
    try {
        const { level } = req.body;
        if (![1, 2, 3].includes(level)) {
            return res.status(400).json({ message: "Invalid level" });
        }

        const lectures = await Lecture.find({ level }, { "sections.videoPath": 0 });
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


export const createLecture = async (req, res) => {
    try {
        const { name, description, price, level, sectionName } = req.body;

        const lecture = new Lecture({
            name,
            description,
            price,
            level,
            sections: [],
        });

        const section = {
            name: sectionName,
        };

        // if (req.files?.image?.[0]) {
        //     section.imagePath = req.files.image[0].path;
        // }

        // if (req.files?.video?.[0]) {
        //     section.videoPath = req.files.video[0].path;
        // }

        if (req.files?.image?.[0]) {
            section.imagePath = req.files.image[0].path.replace(/\\/g, "/");
        }

        if (req.files?.video?.[0]) {
            section.videoPath = req.files.video[0].path.replace(/\\/g, "/");
        }

        if (sectionName && (section.imagePath || section.videoPath)) {
            lecture.sections.push(section);
        }

        await lecture.save();

        if (price == 0 && req.currentUser?.id) {
            await User.findByIdAndUpdate(req.currentUser.id, {
                $addToSet: { purchasedLectures: lecture._id }
            });
        }

        res.status(201).json({
            success: true,
            message: "Lecture with initial section created successfully",
            lecture,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createSection = async (req, res) => {
    try {
        const { lectureId, name } = req.body;

        if (!name || !lectureId) {
            return res.status(400).json({ success: false, message: "Section name and lectureId are required" });
        }

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        const newSection = {
            name,
        };

        if (req.files?.image?.[0]) {
            newSection.imagePath = req.files.image[0].path.replace(/\\/g, "/");
        }

        if (req.files?.video?.[0]) {
            newSection.videoPath = req.files.video[0].path.replace(/\\/g, "/");
        }

        lecture.sections.push(newSection);
        await lecture.save();

        res.status(201).json({
            success: true,
            message: "Section added successfully",
            section: lecture.sections[lecture.sections.length - 1], // return the newly added section
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateLecture = async (req, res) => {
    try {
        const { id, name, description, price, level } = req.body;

        const updated = await Lecture.findByIdAndUpdate(
            id,
            { name, description, price, level },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        res.json({ success: true, updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteLecture = async (req, res) => {
    try {
        const deleted = await Lecture.findOneAndDelete({ name: req.body.name });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        res.json({ success: true, message: "Lecture deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Controller
export const deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.body;

        const lecture = await Lecture.findOne({ "sections._id": sectionId });

        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        const initialCount = lecture.sections.length;
        lecture.sections = lecture.sections.filter(
            section => section._id.toString() !== sectionId
        );

        if (lecture.sections.length === initialCount) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        await lecture.save();
        res.json({ success: true, message: "Section deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getLevelOneLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({ level: 1 }, { "sections.videoPath": 0 });
        res.json({ success: true, lectures });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getLevelTwoLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({ level: 2 }, { "sections.videoPath": 0 });
        res.json({ success: true, lectures });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getLevelThreeLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({ level: 3 }, { "sections.videoPath": 0 });
        res.json({ success: true, lectures });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({}, { "sections.videoPath": 0 });
        res.json({ success: true, lectures });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const markSectionCompleted = async (req, res) => {
    try {
        const { lectureId, sectionId } = req.body;
        const userId = req.currentUser.id;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        const section = lecture.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        // Add sectionId to completedSections for this user+lecture
        const progress = await UserLectureProgress.findOneAndUpdate(
            { user: userId, lecture: lectureId },
            { $addToSet: { completedSections: sectionId } },
            { upsert: true, new: true }
        );

        const allSectionIds = lecture.sections.map(sec => sec._id.toString());
        const completedSet = new Set(progress.completedSections.map(id => id.toString()));
        const isCompleted = allSectionIds.every(id => completedSet.has(id));

        if (isCompleted && !progress.isCompleted) {
            progress.isCompleted = true;
            await progress.save();
        }

        res.json({
            success: true,
            message: `Section marked completed${isCompleted ? ", lecture completed" : ""}`,
            lectureCompleted: isCompleted
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const checkLectureCompleted = async (req, res) => {
    try {
        const { lectureId } = req.body;
        const userId = req.currentUser.id;

        const progress = await UserLectureProgress.findOne({ user: userId, lecture: lectureId });

        res.json({
            success: true,
            lectureCompleted: progress?.isCompleted || false
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getLectureUsersAndProgress = async (req, res) => {
    try {
        const { lectureName } = req.body;

        const lecture = await Lecture.findOne({ name: lectureName });
        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        const [usersPurchased, completedProgress] = await Promise.all([
            User.find({ purchasedLectures: lecture._id }).select("name email"),
            UserLectureProgress.find({ lecture: lecture._id, isCompleted: true }).populate("user", "name email")
        ]);

        res.json({
            success: true,
            lectureName: lecture.name,
            purchasedCount: usersPurchased.length,
            completedCount: completedProgress.length,
            usersPurchased,
            usersCompleted: completedProgress.map(p => p.user)
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const progressByLectureId = async (req, res) => {
    const userId = req.currentUser.id;
    const { lectureId } = req.params;

    const progress = await UserLectureProgress.findOne({ user: userId, lecture: lectureId });
    res.json({ completedSections: progress?.completedSections || [] });
};