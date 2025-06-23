import mongoose from 'mongoose';

const userLectureProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true,
    },
    completedSections: [{
        type: String, // section name or ID depending on DB design
    }],
    isCompleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

userLectureProgressSchema.index({ user: 1, lecture: 1 }, { unique: true });

export default mongoose.model("UserLectureProgress", userLectureProgressSchema);