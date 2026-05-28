import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
FUSION_DIR = ROOT_DIR / "fusion-engine"

sys.path.insert(0, str(FUSION_DIR))

from fusion_api import calculate_rescue_scores

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

    cellular = list(
        db.cellular_events.find({}, {"_id": 0})
    )

    wifi = list(
        db.wifi_events.find({}, {"_id": 0})
    )

    wearable = list(
        db.wearable_events.find({}, {"_id": 0})
    )

    smart_meter = list(
        db.smart_meter_events.find({}, {"_id": 0})
    )

    collapse = list(
        db.collapse_events.find({}, {"_id": 0})
    )

    signals = {
        "cellular": cellular,
        "wifi": wifi,
        "wearable": wearable,
        "smartMeter": smart_meter,
        "collapse": collapse
    }

    scores = calculate_rescue_scores(
        signals=signals,
        simulation_time="10:45"
    )

    return scores


def get_simulation_timeline():

    timeline = list(
        db.simulation_timeline.find({}, {"_id": 0})
    )

    return timeline