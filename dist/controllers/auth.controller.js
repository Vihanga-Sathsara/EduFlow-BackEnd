"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.updateProfile = exports.updatePassword = exports.verifyOtp = exports.resetPassword = exports.registerAdmin = exports.getMyProfile = exports.refreshTokens = exports.googleLoginUser = exports.loginUser = exports.googleRegisterUser = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const token_1 = require("../utils/token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const email_config_1 = __importDefault(require("../config/email.config"));
dotenv_1.default.config();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await user_model_1.User.create({
            email,
            password: hashedPassword,
            role: [user_model_1.Role.USER],
            registeredDate: new Date()
        });
        res.status(201).json({
            message: "User registered successfully",
            data: { email: user.email, role: user.role }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.registerUser = registerUser;
function generateRandomPassword(length) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "!@#$%^&*()_+-={}[]|:;<>,.?/";
    const chars = upper + lower + digits + special;
    let password = '';
    password += upper.charAt(crypto_1.default.randomInt(0, upper.length));
    password += lower.charAt(crypto_1.default.randomInt(0, lower.length));
    password += digits.charAt(crypto_1.default.randomInt(0, digits.length));
    password += special.charAt(crypto_1.default.randomInt(0, special.length));
    for (let i = password.length; i < length; i++) {
        password += chars.charAt(crypto_1.default.randomInt(0, chars.length));
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}
const googleRegisterUser = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        const randomPassword = generateRandomPassword(8);
        const hashedPassword = await bcryptjs_1.default.hash(randomPassword, 10);
        const user = await user_model_1.User.create({
            email,
            password: hashedPassword,
            role: [user_model_1.Role.USER],
            registeredDate: new Date()
        });
        res.status(201).json({
            message: "User registered successfully",
            data: { email: user.email, role: user.role }
        });
    }
    catch (error) {
        console.error(error);
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.googleRegisterUser = googleRegisterUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(400).send("Invalid email address");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid password");
        }
        const accessToken = (0, token_1.signAccessToken)(existingUser);
        const refreshToken = (0, token_1.signRefreshToken)(existingUser);
        res.status(200).json({
            Message: "Login successfully",
            data: {
                email: existingUser.email,
                role: existingUser.role,
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.loginUser = loginUser;
const googleLoginUser = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(400).send("Invalid email address");
        }
        const accessToken = (0, token_1.signAccessToken)(existingUser);
        const refreshToken = (0, token_1.signRefreshToken)(existingUser);
        res.status(200).json({
            Message: "Login successfully",
            data: {
                email: existingUser.email,
                role: existingUser.role,
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        throw error;
    }
};
exports.googleLoginUser = googleLoginUser;
const refreshTokens = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }
        const payload = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
        const user = await user_model_1.User.findById(payload.sub);
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const accessToken = (0, token_1.signAccessToken)(user);
        return res.status(200).json({ accessToken });
    }
    catch (error) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};
exports.refreshTokens = refreshTokens;
const getMyProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await user_model_1.User.findById(req.user.sub).select('-password');
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const { _id, email, role, registeredDate } = user;
    res.status(200).json({ data: { id: _id, email, role, registeredDate } });
};
exports.getMyProfile = getMyProfile;
const registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await user_model_1.User.create({
            email,
            password: hashedPassword,
            role: [user_model_1.Role.ADMIN],
            registeredDate: new Date()
        });
        res.status(201).json({
            message: "Admin registered successfully",
            data: { email: user.email, role: user.role }
        });
    }
    catch (error) {
        console.error(error);
    }
};
exports.registerAdmin = registerAdmin;
function genarateToken() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jsonwebtoken_1.default.sign({ otp }, process.env.JWT_PW_REFRESH_SECRET, { expiresIn: "15m" });
    return { otp, token };
}
const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = genarateToken();
        await email_config_1.default.sendMail({
            from: `"EduFlow LearnHub" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Request",
            html: `
                <h3>Your OTP Code</h3>
                <p>Use this code to verify your account:</p>
                <h2>${otp.otp}</h2>
                <p>Expires in 15 minutes</p>
            `
        });
        res.status(200).json({ message: "Password reset email sent", passwordResetToken: otp.token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.resetPassword = resetPassword;
const verifyOtp = async (req, res) => {
    try {
        const { otp, token } = req.body;
        console.log("Received OTP verification request:", { otp, token });
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_PW_REFRESH_SECRET);
        if (payload.otp === otp.trim()) {
            res.status(200).json({ message: "OTP verified successfully" });
        }
        else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    }
    catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ message: "OTP has expired" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.verifyOtp = verifyOtp;
const updatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updatePassword = updatePassword;
const updateProfile = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid current password");
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateProfile = updateProfile;
const getAllUsers = async (req, res) => {
    try {
        const users = await user_model_1.User.find().select('-password');
        res.status(200).json({ data: users });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
