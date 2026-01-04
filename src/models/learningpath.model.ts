import mongoose, { Document , Schema } from "mongoose"

export interface ILearningPath extends Document {
    _id : mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    title: string
    data: object
    createdAt: Date
    status: boolean
}
const LearningPathSchema = new Schema<ILearningPath>({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    data: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
})

export const LearningPath = mongoose.model<ILearningPath>("LearningPath", LearningPathSchema)