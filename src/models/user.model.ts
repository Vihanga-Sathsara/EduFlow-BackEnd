import mongoose, { Document, Schema } from "mongoose"

export enum Role{
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface IUSER extends Document {
    _id : mongoose.Types.ObjectId
    email : string
    password : string
    role : Role[]
    registeredDate : Date
}

const userSchema = new Schema<IUSER>({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type:[String], enum: Object.values(Role), default: [Role.USER]},
    registeredDate: {type: Date, default: Date.now}
})

export const User = mongoose.model<IUSER>("User", userSchema)
