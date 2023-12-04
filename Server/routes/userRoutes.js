import express from "express";
import { UserController } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/:email", UserController.getUserDetails)

export default router;
