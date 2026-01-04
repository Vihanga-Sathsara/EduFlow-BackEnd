"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEbooks = exports.uploadEbookFiles = void 0;
const ebook_model_1 = require("../models/ebook.model");
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
const uploadEbookFiles = async (req, res) => {
    try {
        const { title, author, category, description, uploadedBy } = req.body;
        console.log("Request body:", req.body);
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        if (!title || !author || !category || !description || !uploadedBy) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const uploadedById = new mongoose_1.default.Types.ObjectId(uploadedBy);
        const fileUrl = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer);
        console.log("File uploaded to Cloudinary:", fileUrl);
        const newEbook = new ebook_model_1.Ebook({
            title,
            author,
            category,
            description,
            fileUrl,
            uploadedBy: uploadedById
        });
        await newEbook.save();
        return res.status(201).json({ message: "Ebook uploaded successfully", ebook: newEbook });
    }
    catch (error) {
        console.error("Error uploading ebook:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.uploadEbookFiles = uploadEbookFiles;
const getAllEbooks = async (req, res) => {
    try {
        const ebooks = await ebook_model_1.Ebook.find();
        res.status(200).json({ message: "Ebooks fetched successfully", ebooks });
    }
    catch (error) {
        console.error("Error fetching ebooks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllEbooks = getAllEbooks;
