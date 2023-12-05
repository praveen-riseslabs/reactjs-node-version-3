import express from "express";
import { UserController } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/:userId", UserController.getUserDetails);

router.post("/verify", UserController.verifyEmail);

export default router;
