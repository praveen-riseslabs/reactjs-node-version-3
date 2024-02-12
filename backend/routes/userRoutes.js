import express from "express";
import { UserController } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

//normal login routes
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

//send reset password otp
router.post("/password-recovery", UserController.sendOTP);

//verify otp
router.post("/otp-verify", UserController.verifyOTP);

//reset password
router.put("/reset-password", UserController.resetPassword);

//user details route
router.get("/", requireAuth, UserController.getUserDetails);

export default router;
