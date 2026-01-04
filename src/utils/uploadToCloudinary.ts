import cloudinary from "../config/cloudinary.config"
import streamifier from "streamifier"

export const uploadToCloudinary = (fileBuffer: Buffer) : Promise<String> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder: "eduflow_ebooks",
                resource_type: "raw"
             }
            ,
            (error, result) => {
               if (error) {
                console.error("Cloudinary upload error:", error)
                return reject(error)
            }
            if (!result || !result.secure_url) {
                return reject(new Error("Cloudinary did not return a URL"))
            }
                resolve(result.secure_url)
            }
        )
        streamifier.createReadStream(fileBuffer).pipe(uploadStream)
    })
}