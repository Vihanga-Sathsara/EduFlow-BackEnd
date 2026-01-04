import mongoose, { Document , Schema } from "mongoose"

export interface IEbook extends Document {
    _id : mongoose.Types.ObjectId
    title: string
    author: string
    category: string
    description: string
    fileUrl: string
    uploadedBy: mongoose.Types.ObjectId
    uploadedAt: Date
}

const EbookSchema = new Schema<IEbook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    uploadedAt: { default: Date.now, type: Date }
})

export const Ebook = mongoose.model<IEbook>("Ebook", EbookSchema)