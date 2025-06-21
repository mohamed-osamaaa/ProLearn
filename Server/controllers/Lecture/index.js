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
        const deleted = await Lecture.findByIdAndDelete(req.body.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }
        res.json({ success: true, message: "Lecture deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteSection = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.body.lectureId);
        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        lecture.sections = lecture.sections.filter(
            section => section._id.toString() !== req.params.sectionId
        );

        await lecture.save();
        res.json({ success: true, message: "Section deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getLevelOneLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({ level: 1 });
        res.json({ success: true, lectures });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getLevelTwoLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({ level: 2 });
        res.json({ success: true, lectures });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getLevelThreeLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({ level: 3 });
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

        section.isCompleted = true;

        const allCompleted = lecture.sections.every(sec => sec.isCompleted);

        if (allCompleted) {
            lecture.isCompleted = true;

            const alreadyAdded = lecture.userProgress.some(id => id.toString() === userId);
            if (!alreadyAdded) {
                lecture.userProgress.push(userId);
            }
        }

        await lecture.save();

        res.json({
            success: true,
            message: `Section marked as completed${allCompleted ? " and Lecture is now completed" : ""}`,
            lectureStatus: lecture.isCompleted
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const checkLectureCompleted = async (req, res) => {
    try {
        const { lectureId } = req.body;

        const lecture = await Lecture.findById(lectureId).select("isCompleted");
        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        res.json({
            success: true,
            lectureCompleted: lecture.isCompleted
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getLectureUsersAndProgress = async (req, res) => {
    try {
        const { lectureId } = req.body;

        const lecture = await Lecture.findById(lectureId).populate("userProgress", "name email");

        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        const usersPurchased = await User.find({ purchasedLectures: lectureId }).select("name email");

        const usersCompleted = lecture.userProgress;

        res.json({
            success: true,
            lectureName: lecture.name,
            purchasedCount: usersPurchased.length,
            completedCount: usersCompleted.length,
            usersPurchased,
            usersCompleted
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};