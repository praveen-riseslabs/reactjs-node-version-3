import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { AssetController } from "../controllers/assetController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();
router.use(requireAuth);

//create new Asset
router.post("/create", upload.array("files"), AssetController.createNewAsset);

//get all assets
router.get("/", AssetController.getAllAssets);

export default router;
