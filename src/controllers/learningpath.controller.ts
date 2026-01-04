import { Request , Response } from "express"
import { LearningPath }   from "../models/learningpath.model"
import { Progress } from "../models/progress.model"

export const saveLearningPath = async (req: Request, res: Response) => {
    try {
        const { title, data, userId, status } = req.body
        const newLearningPath = await LearningPath.create({ title, data, userId, status })
        res.status(201).json({ message: "Learning path saved successfully", learningPath: newLearningPath })
    }catch (error) {
        console.error("Error saving learning path:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getLearningPaths = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        const learningPaths = await LearningPath.find({ userId })
        res.status(200).json({ learningPaths })
    }catch (error) {
        console.error("Error fetching learning paths:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateLearningPathStatus = async (req: Request, res: Response) => {
    try {
        const { userId,learningPathId, week, status } = req.body
        const progress = await Progress.create({ userId, learningPathId, week, status })
        if (!progress) {
            return res.status(404).json({ message: "Can't update progress" })
        }
        res.status(200).json({ message: "Progress updated successfully", progress })
    }catch (error) {
        console.error("Error updating progress status:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getLearningPathProgress = async (req: Request, res: Response) => {
    try {
        const { userId, learningPathId } = req.params
        const progress = await Progress.find({ userId, learningPathId })
        if (!progress) {
            return res.status(404).json({ message: "Progress not found" })
        }
        res.status(200).json({ message: "Progress fetched successfully", progress })
    } catch (error) {
        console.error("Error fetching progress:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateLearningDocumentStatus = async (req: Request, res: Response) => {
    try{
        const { userId, learningPathId, status } = req.body
        const learningPath = await LearningPath.findOne({ _id: learningPathId, userId })
        if (!learningPath) {
            return res.status(404).json({ message: "Learning path not found" })
        }
        learningPath.status = status
        const updateStatus = await learningPath.save()
        res.status(200).json({ message: "Learning path status updated successfully", updateStatus })
    }catch(error){
        console.error("Error updating learning path status:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getAllLearningPaths = async (req: Request, res: Response) => {
    try {
        const learningPaths = await LearningPath.countDocuments()
        res.status(200).json({ learningPaths })
    } catch (error) {
        console.error("Error fetching all learning paths:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}