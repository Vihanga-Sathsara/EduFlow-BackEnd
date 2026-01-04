import {Router} from "express"
import { getAllLearningPaths, getLearningPathProgress, getLearningPaths, saveLearningPath, updateLearningDocumentStatus, updateLearningPathStatus } from "../controllers/learningpath.controller"
import { authenticate } from "../middleware/auth"
import { adminOnly } from "../middleware/adminOnly"

const learningPathRouter = Router()

learningPathRouter.post("/save-learning-path", authenticate, saveLearningPath)
learningPathRouter.get("/get-learning-paths/:userId", authenticate, getLearningPaths)
learningPathRouter.post("/update-learning-path-status", authenticate, updateLearningPathStatus)
learningPathRouter.get("/get-learning-path-progress/:userId/:learningPathId", authenticate, getLearningPathProgress)
learningPathRouter.post("/update-learning-document-status", authenticate, updateLearningDocumentStatus)
learningPathRouter.get("/get-all-learning-paths", authenticate, adminOnly, getAllLearningPaths)

export default learningPathRouter