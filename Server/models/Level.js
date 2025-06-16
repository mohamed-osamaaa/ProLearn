import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
    name: {
        type: Number,
        enum: [1, 2, 3]
    },
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    }],
});

export default mongoose.model("Level", levelSchema);
