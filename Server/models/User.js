import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["instructor", "student"],
        default: "student",
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    purchasedLectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
