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

//deleting asset permanently
router.delete("/delete/:assetId", AssetController.deletePermanently);

//set asset to trash state
router.put("/trash/:assetId", AssetController.trashAsset);

//restring asset from trash state
router.put("/restore/:assetId", AssetController.restoreAsset);

//update asset
router.put("/update", AssetController.updateAsset);

export default router;
