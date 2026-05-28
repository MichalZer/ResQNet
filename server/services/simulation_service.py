from core.database import db

STATUS = {"status": "running"}


def get_simulation_status():
    return STATUS


def get_start_simulation():
    STATUS["status"] = "running"

    return {
        "message": "Simulation started"
    }


def get_rescue_scores():
    scores = list(
        db.rescue_scores.find({}, {"_id": 0})
    )

    return scores


def get_simulation_timeline():
    timeline = list(
        db.simulation_timeline.find({}, {"_id": 0})
    )

    return timeline