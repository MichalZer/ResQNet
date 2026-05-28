from core.database import db


def get_signals_data():
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

    return {
        "cellular": cellular,
        "wifi": wifi,
        "wearable": wearable,
        "smartMeter": smart_meter,
        "collapse": collapse
    }