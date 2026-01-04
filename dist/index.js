"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const ai_1 = __importDefault(require("./routes/ai"));
const learningpath_1 = __importDefault(require("./routes/learningpath"));
const ebook_1 = __importDefault(require("./routes/ebook"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/ai", ai_1.default);
app.use("/api/v1/learning-path", learningpath_1.default);
app.use("/api/v1/ebook", ebook_1.default);
mongoose_1.default.connect(MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
});
app.get("/", (req, res) => {
    res.send("EDUFLOW LearnHub Backend is running");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
