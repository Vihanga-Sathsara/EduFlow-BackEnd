import { Router } from "express"
import { genarateAiContent, genaratePerfectAnswers, generateNotes } from "../controllers/ai.controller"
import { authenticate } from "../middleware/auth"   

const router = Router()

router.post("/generate", authenticate, genarateAiContent)
router.post("/generate-note", authenticate, generateNotes)
router.post("/genarate-answers", authenticate, genaratePerfectAnswers)
export default router