import express from "express";
import { UserController } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

//normal login routes
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

//user details route
router.get("/", requireAuth, UserController.getUserDetails);

export default router;
