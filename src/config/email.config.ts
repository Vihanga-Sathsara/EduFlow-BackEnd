import nodeemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

const transporter = nodeemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export default transporter