
from core.database import db

def get_building_data():
    buildings = list(db.buildings.find({}, {"_id": 0}))
    return buildings