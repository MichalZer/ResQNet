import {simulationStatus , simulationStart ,rescueScores}from "../mockData/simulationStatus.js";

export function getSimulationStatus() {
      return simulationStatus;
  };

  export function getStartSimulation() {
    //simulationStatus.status = "running";
    return simulationStart;
  }

  export function getRescueScores() {
    return rescueScores;
  }