import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String
    },
});

const lectureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    userProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
});

export default mongoose.model("Lecture", lectureSchema);
