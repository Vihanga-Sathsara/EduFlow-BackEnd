import {Router} from "express"
import { authenticate } from "../middleware/auth"
import { adminOnly } from "../middleware/adminOnly"
import { uploadEbook } from "../middleware/ebook"
import { getAllEbooks, uploadEbookFiles  } from "../controllers/ebook.controller"

const ebookRouter = Router()

ebookRouter.post("/upload-ebook",authenticate,adminOnly,uploadEbook.single("file"), uploadEbookFiles)
ebookRouter.get("/get-all-ebooks", authenticate, getAllEbooks)
export default ebookRouter