import jwt from "jsonwebtoken"
import { IUSER } from "../models/user.model"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

export const signAccessToken = (user : IUSER) : string => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role
        },
        JWT_SECRET,
        { 
            expiresIn: "1h" 
        }
    )
}

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const signRefreshToken = (user : IUSER) : string => {
    return jwt.sign(
        {
            sub: user._id.toString(),
        },
        JWT_REFRESH_SECRET,
        { 
            expiresIn: "30d" 
        }
    )
}

const JWT_PW_REFRESH_SECRET = process.env.JWT_PW_REFRESH_SECRET as string

export const passwordResetToken = (otp: string)  => {
    return jwt.sign(
        {
            sub: otp
        },
        JWT_PW_REFRESH_SECRET,
        { 
            expiresIn: "15m",
        }
    )
}

