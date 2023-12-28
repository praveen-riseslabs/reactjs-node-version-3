import express from "express";
import { MapController } from "../controllers/mapController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();
router.use(requireAuth);

//sending coords
router.post("/send", MapController.sendCoords);

//fetching coords
router.get("/", MapController.fetchCoords);

export default router;
