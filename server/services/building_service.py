import json
from pathlib import Path

DATA_PATH = Path("/../data/buildingData.json")

def get_building_data():
    with open(DATA_PATH, "r") as f:
        return json.load(f)