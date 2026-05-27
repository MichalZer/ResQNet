import json
from pathlib import Path

STATUS = {"status": "running"}

def get_simulation_status():
    return STATUS


def get_start_simulation():
    STATUS["status"] = "running"
    return {"message": "Simulation started"}


def get_rescue_scores():
    return {
        "areaId": "floor4_zoneA",
        "priorityScore": 92,
        "riskLevel": "critical",
        "estimatedPeople": 4
    }