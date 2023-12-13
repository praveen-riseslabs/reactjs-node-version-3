import express from "express";
import { UserController } from "../controllers/userController.js";

const router = express.Router();

//normal login routes
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

//google login routes
router.post("/auth/google", UserController.googleLogin)

//facebook login routes
router.post("/auth/facebook", UserController.facebookLogin)

//getting user details route
router.get("/:userId", UserController.getUserDetails);

//email verification
router.post("/verify", UserController.verifyEmail);
router.put("/resetpassword", UserController.resetPassword);
router.post("/forgotpassword", UserController.forgotPassword);


export default router;
