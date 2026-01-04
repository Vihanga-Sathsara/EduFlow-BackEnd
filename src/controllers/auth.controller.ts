import { Request, Response } from 'express'
import {IUSER,Role, User} from '../models/user.model'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { passwordResetToken, signAccessToken, signRefreshToken } from '../utils/token'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AuthRequest } from '../middleware/auth'
import transporter from '../config/email.config'
dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const registerUser = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        const existingUser = await User.findOne({ email})

        if(existingUser) {
            return res.status(400).send("User already exists")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            email,
            password: hashedPassword,
            role: [Role.USER],
            registeredDate: new Date()
        })

        res.status(201).json({
            message: "User registered successfully",
            data: { email: user.email, role: user.role }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

function generateRandomPassword(length: number): string {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lower = "abcdefghijklmnopqrstuvwxyz"
    const digits = "0123456789"
    const special = "!@#$%^&*()_+-={}[]|:;<>,.?/"
    const chars = upper + lower + digits + special
    
    let password = ''
    password += upper.charAt(crypto.randomInt(0, upper.length))
    password += lower.charAt(crypto.randomInt(0, lower.length))
    password += digits.charAt(crypto.randomInt(0, digits.length))
    password += special.charAt(crypto.randomInt(0, special.length))

    for (let i = password.length; i < length; i++) {
        password += chars.charAt(crypto.randomInt(0, chars.length))
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('')
}

export const googleRegisterUser = async (req: Request, res: Response) => {
    try{
        const {email} = req.body

        const existingUser = await User.findOne({ email })

        if(existingUser) {
            return res.status(400).send("User already exists")
        }
        const randomPassword = generateRandomPassword(8)
        const hashedPassword = await bcrypt.hash(randomPassword, 10)

        const user = await User.create({
            email,
            password: hashedPassword,
            role: [Role.USER],
            registeredDate: new Date()
        })
        res.status(201).json({
            message: "User registered successfully",
            data: { email: user.email, role: user.role }
        })
    } catch (error) {
        console.error(error)
        console.error(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
    
}

export const loginUser = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body
        const existingUser = await User.findOne({ email }) as IUSER | null
        if(!existingUser){
            return res.status(400).send("Invalid email address")
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordValid){
            return res.status(400).send("Invalid password")
        }

        const accessToken = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)

        res.status(200).json({
            Message: "Login successfully",
            data: {
                email: existingUser.email,
                role: existingUser.role,
                accessToken,
                refreshToken
            }
        })

    }catch(error){
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
}

export const googleLoginUser = async (req : Request, res: Response) => {
    try{
        const { email } = req.body
        const existingUser = await User.findOne({ email }) as IUSER | null
        if(!existingUser){
            return res.status(400).send("Invalid email address")
        }
        const accessToken = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)
        res.status(200).json({
            Message: "Login successfully",
            data: {
                email: existingUser.email,
                role: existingUser.role,
                accessToken,
                refreshToken
            }
        })

    }catch(error){
        throw error
    }
}

export const refreshTokens = async (req: Request, res: Response) => {
    try{
        const { token } = req.body
        if(!token){
            return res.status(400).json({message: "No token provided"})
        }
        const payload:any = jwt.verify(token,JWT_REFRESH_SECRET)
        const user = await User.findById(payload.sub)
        if(!user){
            return res.status(403).json({message: "Invalid refresh token"})
        }
        const accessToken = signAccessToken(user)
        return res.status(200).json({ accessToken })
    }catch(error){
        res.status(403).json({message: "Invalid or expired refresh token"})
    }
}

export const getMyProfile = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const user = await User.findById(req.user.sub).select('-password')

    if(!user){
        return res.status(404).json({ message: "User not found" })
    }

    const {_id, email, role, registeredDate } = user as IUSER

    res.status(200).json({ data: {id: _id, email, role, registeredDate }})
}

export const registerAdmin = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        const existingUser = await User.findOne({ email})

        if(existingUser) {
            return res.status(400).send("User already exists")
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            email,
            password: hashedPassword,
            role: [Role.ADMIN],
            registeredDate: new Date()
        })
        res.status(201).json({
            message: "Admin registered successfully",
            data: { email: user.email, role: user.role }
        })

    }catch(error){
        console.error(error)
    }
}


function genarateToken(){
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const token = jwt.sign(
            {otp},
            process.env.JWT_PW_REFRESH_SECRET as string,
            { expiresIn: "15m"}
            )
    
    return {otp, token}
}

export const resetPassword = async (req: Request, res: Response) => {
    try{
        const { email } = req.body
        const user = await User.findOne({ email }) as IUSER | null
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }

        const otp = genarateToken()
        await transporter.sendMail({
            from: `"EduFlow LearnHub" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Request",
            html: `
                <h3>Your OTP Code</h3>
                <p>Use this code to verify your account:</p>
                <h2>${otp.otp}</h2>
                <p>Expires in 15 minutes</p>
            `
        })
        res.status(200).json({ message: "Password reset email sent", passwordResetToken: otp.token })

    }catch(error){
        console.error(error)
        res.status(500).json({ message: "Internal server error"})
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try{

        const {otp , token} = req.body
        console.log("Received OTP verification request:", { otp, token })
        
       const payload = jwt.verify(token, process.env.JWT_PW_REFRESH_SECRET as string) as any
       
       if(payload.otp === otp.trim()){
            res.status(200).json({ message: "OTP verified successfully" })
       } else {
            res.status(400).json({ message: "Invalid OTP"})
       }

    }catch(error: any){
        console.error(error)
        if(error.name === "TokenExpiredError"){
            return res.status(400).json({ message: "OTP has expired"})
        }
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    try{
        const { email, newPassword } = req.body
        const user = await User.findOne({ email }) as IUSER | null
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        res.status(200).json({ message: "Password updated successfully" })

    }catch(error){
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { email , currentPassword, newPassword } = req.body

        const user = await User.findOne({ email }) as IUSER | null
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

        if(!isPasswordValid){
            return res.status(400).send("Invalid current password")
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        res.status(200).json({ message: "Profile updated successfully" })
    }catch(error){
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json({ data: users })
    } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}
