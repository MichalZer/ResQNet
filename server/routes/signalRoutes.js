import express from "express";
import { getSignalsData } from "../services/signalsService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getSignalsData());       
});

export default router;
