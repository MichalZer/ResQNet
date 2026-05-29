import json
from pathlib import Path
from core.database import db

# בחירת scenario
#SCENARIO = "tel_aviv_morning"
SCENARIO = "bnei_brak_shabbat"

# path לתיקיית הדאטה
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "scenarios" / SCENARIO


def load_json(filename):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


# טעינת הנתונים
building_data = load_json("building.json")
cellular_events = load_json("cellular_events.json")
collapse_events = load_json("collapse_events.json")
context = load_json("context.json")
simulation_timeline = load_json("simulation_timeline.json")
smart_meter_events = load_json("smart_meter_events.json")
wearable_events = load_json("wearable_events.json")
wifi_events = load_json("wifi_events.json")

# ניקוי collections
db.buildings.delete_many({})
db.cellular_events.delete_many({})
db.collapse_events.delete_many({})
db.context.delete_many({})
db.simulation_timeline.delete_many({})
db.smart_meter_events.delete_many({})
db.wearable_events.delete_many({})
db.wifi_events.delete_many({})

# הכנסת נתונים
db.buildings.insert_one(building_data)
db.cellular_events.insert_many(cellular_events)
db.collapse_events.insert_many(collapse_events)
db.context.insert_one(context)
db.simulation_timeline.insert_one(simulation_timeline)
db.smart_meter_events.insert_many(smart_meter_events)
db.wearable_events.insert_many(wearable_events)
db.wifi_events.insert_many(wifi_events)

print(f"{SCENARIO} seeded successfully!")