import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        default: "img1.png",
    },
    videoPath: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
});

const lectureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    sections: [sectionSchema],
    price: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    userProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
});

export default mongoose.model("Lecture", lectureSchema);
