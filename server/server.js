import express from "express";
import buildingRoutes from "./routes/buildingRoutes.js";
import signalRoutes from "./routes/signalRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "ResQNet Server Running"
  });
});

app.use("/building", buildingRoutes);
app.use("/signals", signalRoutes);
app.use("/simulation", simulationRoutes);



app.listen(3000, () => {
  console.log("Server running on port 3000");
});