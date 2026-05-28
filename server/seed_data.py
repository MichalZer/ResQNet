from core.database import db

# Building data
building_data = {
    "buildingId": "B1",
    "floors": 5,
    "zones": ["A", "B", "C"],
    "address": "123 Rescue St."
}

# Insert into buildings collection
db.buildings.insert_one(building_data)

print("Building inserted successfully!")