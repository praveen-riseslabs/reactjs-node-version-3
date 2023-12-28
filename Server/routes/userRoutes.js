import express from "express";
import { UserController } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

//normal login routes
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

//google login routes
router.post("/auth/google", UserController.googleLogin);

//facebook login routes
router.post("/auth/facebook", UserController.facebookLogin);

//user details route
router.get("/:userId", UserController.getUserDetails);
router.put("/update", UserController.editUserInfo);

//email verification
router.post("/verify", UserController.verifyEmail);
router.put("/resetpassword", UserController.resetPassword);
router.post("/forgotpassword", UserController.forgotPassword);

//search for users
router.get("/search/people", requireAuth, UserController.searchForUsers);

//toggle tracking
router.put("/tracking/toggle", requireAuth, UserController.toggleTracking);

export default router;
