import express from "express";
import { FileController } from "../controllers/fileController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/upload", upload.single("file"), FileController.uploadFile);
router.get("/", FileController.getFiles);
router.delete("/remove/:id", FileController.deleteFile);

export default router;
