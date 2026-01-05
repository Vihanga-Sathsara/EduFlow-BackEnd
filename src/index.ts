import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth"
import aiRouter from "./routes/ai"
import learningPathRouter from "./routes/learningpath"
import ebookRouter from "./routes/ebook"

dotenv.config()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())
app.use(cors({
    origin: ["https://edu-flow-back-end.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/ai", aiRouter)
app.use("/api/v1/learning-path", learningPathRouter)
app.use("/api/v1/ebook", ebookRouter)

mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to MongoDB")
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
})

app.get ("/", (req, res) => {
    res.send ("EDUFLOW LearnHub Backend is running")
})

app.listen(PORT, () => {
    console.log (`Server is running on port ${PORT}`)
})