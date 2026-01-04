"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEbook = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/epub+zip') {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only PDF and EPUB files are allowed.'), false);
    }
};
exports.uploadEbook = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
