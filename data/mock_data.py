import json
import random
import time
from faker import Faker

fake = Faker()

def generate_building_data(is_shabbat=False):
    data = {"cellular": [], "wifi": [], "smart_meters": [], "wearables": []}
    floors = range(1, 6)
    zones = ["A", "B", "C"]
    
    for floor in floors:
        for zone in zones:
            apartment_id = f"{floor}{zone}"
            usage_probability = 0.2 if is_shabbat else 1.0
            
            num_phones = int(random.randint(0, 4) * usage_probability)
            for i in range(num_phones):
                data["cellular"].append({
                    "deviceId": f"phone_{floor}_{zone}_{i}",
                    "lastSeen": fake.time(), # Updates dynamically
                    "floor": floor,
                    "zone": zone,
                    "signalLost": False
                })
                
            if random.random() < usage_probability:
                data["wifi"].append({
                    "routerId": f"wifi_{apartment_id}",
                    "floor": floor,
                    "apartment": apartment_id,
                    "connectedDevices": random.randint(1, 5),
                    "wentOfflineAt": None,
                    "status": "online"
                })
                
            data["smart_meters"].append({
                "meterId": f"meter_{apartment_id}",
                "floor": floor,
                "apartment": apartment_id,
                "powerUsage": round(random.uniform(1.0, 5.0), 1),
                "usageLevel": "normal",
                "wentOffline": False
            })
            
            if random.random() > 0.5:
                data["wearables"].append({
                    "wearableId": f"watch_{floor}_{zone}",
                    "lastSync": fake.time(),
                    "heartRate": random.randint(60, 90),
                    "floor": floor,
                    "zone": zone,
                    "disconnected": False
                })
    return data

def trigger_disaster(data, collapse_floor, collapse_zone):
    collapse_time = fake.time()
    
    for phone in data["cellular"]:
        if phone["floor"] == collapse_floor and phone["zone"] == collapse_zone:
            phone["signalLost"] = True
            phone["lastSeen"] = collapse_time
            
    for wifi in data["wifi"]:
        if wifi["floor"] == collapse_floor and wifi["apartment"] == f"{collapse_floor}{collapse_zone}":
            wifi["status"] = "offline"
            wifi["wentOfflineAt"] = collapse_time
            
    for meter in data["smart_meters"]:
        if meter["floor"] == collapse_floor and meter["apartment"] == f"{collapse_floor}{collapse_zone}":
            meter["powerUsage"] = 9.8 
            meter["usageLevel"] = "high"
            meter["wentOffline"] = True
            
    for watch in data["wearables"]:
        if watch["floor"] == collapse_floor and watch["zone"] == collapse_zone:
            watch["heartRate"] = 145 
            watch["lastSync"] = collapse_time
            watch["disconnected"] = True
            
    return data

# --- REAL-TIME SIMULATION DEMO FLOW ---
def run_live_simulation():
    print("🚀 Starting ResQNet Live Data Stream Simulation...")
    
    # 1. Start with Normal State
    current_data = generate_building_data(is_shabbat=False)
    
    # Simulate normal activity for 10 seconds (5 ticks of 2 seconds)
    for i in range(5):
        print(f"⏳ Streaming Normal Data... (Tick {i+1}/5)")
        # Overwrite the same file to simulate a live updating database/stream
        with open('live_stream.json', 'w') as f:
            json.dump(current_data, f, indent=4)
        time.sleep(2) # Wait 2 seconds before the next update
        
    # 2. Trigger the disaster in real-time!
    print("\n🚨 !!! DISASTER TRIGGERED: COLLAPSE AT FLOOR 4, ZONE A !!! 🚨\n")
    current_data = trigger_disaster(current_data, collapse_floor=4, collapse_zone="A")
    
    # Simulate the aftermath stream for another 10 seconds
    for i in range(5):
        print(f"📡 Streaming Post-Collapse Data... (Tick {i+1}/5)")
        with open('live_stream.json', 'w') as f:
            json.dump(current_data, f, indent=4)
        time.sleep(2)
        
    print("🏁 Simulation Finished.")

# Run the simulation
if __name__ == "__main__":
    run_live_simulation()