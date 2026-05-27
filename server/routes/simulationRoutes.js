import express from "express";
import { getSimulationStatus ,getStartSimulation ,getRescueScores } from "../services/simulationService.js";

const router = express.Router();

router.post("/start", (req, res) => {
    res.json(getStartSimulation());
});

router.get("/status", (req, res) => {
    const status = getSimulationStatus();
    res.json(status);
});

router.get("/rescue-scores", (req, res) => {
    const scores = getRescueScores();
    res.json(scores);
});

export default router;
