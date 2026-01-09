import { Router } from "express"
import { registerUser, googleRegisterUser, loginUser, refreshTokens, getMyProfile, googleLoginUser, registerAdmin, resetPassword, updatePassword, verifyOtp, updateProfile, getAllUsers } from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth"
import { adminOnly } from "../middleware/adminOnly"

const router = Router()

router.post("/register", registerUser)
router.post("/google-register", googleRegisterUser)
router.post("/login", loginUser )
router.post("/refresh", refreshTokens)
router.post("/google-login", googleLoginUser)
router.post("/admin-register",authenticate, adminOnly, registerAdmin)
router.get("/me", authenticate, getMyProfile)
router.post("/verify-otp", verifyOtp)
router.post("/reset-password", resetPassword)
router.post("/update-password", updatePassword)
router.post("/update-profile", authenticate, updateProfile)
router.get("/get-all-users", authenticate,adminOnly, getAllUsers)

export default router