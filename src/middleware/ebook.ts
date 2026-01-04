import multer from "multer"

const storage = multer.memoryStorage()
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/epub+zip') {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type. Only PDF and EPUB files are allowed.'), false)
    }
}
export const uploadEbook = multer({ storage: storage, fileFilter: fileFilter })