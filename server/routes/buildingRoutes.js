import express from "express";
import {getBuildingData} from "../services/buildingService.js";

const router = express.Router();

router.get("/", (req, res) => {
    const buildingData = getBuildingData();
    res.json(buildingData);
});

export default router;