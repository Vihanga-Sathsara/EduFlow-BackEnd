import { Request , Response } from "express"
import { Ebook } from "../models/ebook.model"
import { uploadToCloudinary } from "../utils/uploadToCloudinary"
import mongoose from "mongoose"


export const uploadEbookFiles = async (req: Request, res: Response) => {
    
    try {
       
        const { title, author, category, description, uploadedBy } = req.body
         console.log("Request body:", req.body)

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        if (!title || !author || !category || !description || !uploadedBy ) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const uploadedById = new mongoose.Types.ObjectId(uploadedBy)

        const fileUrl = await uploadToCloudinary(req.file.buffer)
            console.log("File uploaded to Cloudinary:", fileUrl)

        const newEbook = new Ebook({
            title,
            author,
            category,
            description,
            fileUrl,
            uploadedBy: uploadedById
        })
        await newEbook.save()

        return res.status(201).json({message: "Ebook uploaded successfully",ebook: newEbook})


    }catch (error) {
        console.error("Error uploading ebook:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getAllEbooks = async (req: Request, res: Response) => {
    try {
        const ebooks = await Ebook.find()
        res.status(200).json({message: "Ebooks fetched successfully", ebooks })
    }catch (error) {
        console.error("Error fetching ebooks:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}