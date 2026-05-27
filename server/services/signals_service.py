import json
from pathlib import Path

DATA_PATH = Path("../data/signalsData.json")  # או events לפי המבנה החדש

def get_signals_data():
    with open(DATA_PATH, "r") as f:
        return json.load(f)