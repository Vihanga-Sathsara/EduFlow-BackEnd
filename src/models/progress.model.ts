import mongoose, { Document , Schema } from "mongoose"

export interface IProgress extends Document {
    _id : mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    learningPathId: mongoose.Types.ObjectId
    week: number
    status: boolean
}

const ProgressSchema = new Schema<IProgress>({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    learningPathId: { type: mongoose.Types.ObjectId, required: true, ref: "LearningPath" },
    week: { type: Number, required: true },
    status: { type: Boolean, default: false }
})

export const Progress = mongoose.model<IProgress>("Progress", ProgressSchema)