"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLearningPaths = exports.updateLearningDocumentStatus = exports.getLearningPathProgress = exports.updateLearningPathStatus = exports.getLearningPaths = exports.saveLearningPath = void 0;
const learningpath_model_1 = require("../models/learningpath.model");
const progress_model_1 = require("../models/progress.model");
const saveLearningPath = async (req, res) => {
    try {
        const { title, data, userId, status } = req.body;
        const newLearningPath = await learningpath_model_1.LearningPath.create({ title, data, userId, status });
        res.status(201).json({ message: "Learning path saved successfully", learningPath: newLearningPath });
    }
    catch (error) {
        console.error("Error saving learning path:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.saveLearningPath = saveLearningPath;
const getLearningPaths = async (req, res) => {
    try {
        const userId = req.params.userId;
        const learningPaths = await learningpath_model_1.LearningPath.find({ userId });
        res.status(200).json({ learningPaths });
    }
    catch (error) {
        console.error("Error fetching learning paths:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getLearningPaths = getLearningPaths;
const updateLearningPathStatus = async (req, res) => {
    try {
        const { userId, learningPathId, week, status } = req.body;
        const progress = await progress_model_1.Progress.create({ userId, learningPathId, week, status });
        if (!progress) {
            return res.status(404).json({ message: "Can't update progress" });
        }
        res.status(200).json({ message: "Progress updated successfully", progress });
    }
    catch (error) {
        console.error("Error updating progress status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateLearningPathStatus = updateLearningPathStatus;
const getLearningPathProgress = async (req, res) => {
    try {
        const { userId, learningPathId } = req.params;
        const progress = await progress_model_1.Progress.find({ userId, learningPathId });
        if (!progress) {
            return res.status(404).json({ message: "Progress not found" });
        }
        res.status(200).json({ message: "Progress fetched successfully", progress });
    }
    catch (error) {
        console.error("Error fetching progress:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getLearningPathProgress = getLearningPathProgress;
const updateLearningDocumentStatus = async (req, res) => {
    try {
        const { userId, learningPathId, status } = req.body;
        const learningPath = await learningpath_model_1.LearningPath.findOne({ _id: learningPathId, userId });
        if (!learningPath) {
            return res.status(404).json({ message: "Learning path not found" });
        }
        learningPath.status = status;
        const updateStatus = await learningPath.save();
        res.status(200).json({ message: "Learning path status updated successfully", updateStatus });
    }
    catch (error) {
        console.error("Error updating learning path status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateLearningDocumentStatus = updateLearningDocumentStatus;
const getAllLearningPaths = async (req, res) => {
    try {
        const learningPaths = await learningpath_model_1.LearningPath.countDocuments();
        res.status(200).json({ learningPaths });
    }
    catch (error) {
        console.error("Error fetching all learning paths:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllLearningPaths = getAllLearningPaths;
