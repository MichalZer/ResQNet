import json
import os

# Base date for the simulation
BASE_DATE = "2026-05-27T"

def create_zone_state(priority_score, risk_level, phones_disconnected, wifi_offline, electricity, wearable):
    """ Helper for Elinor's UI format """
    return {
        "id": "floor4_zoneA",
        "floor": 4,
        "name": "Zone A",
        "priorityScore": priority_score,
        "riskLevel": risk_level,
        "estimatedTrapped": 4,
        "signals": {
            "phonesDisconnected": phones_disconnected,
            "wifiOffline": wifi_offline,
            "electricityUsage": electricity,
            "wearableAlert": wearable
        },
        "coordinates": {"x": 120, "y": 80}
    }

def generate_mock_data_files():
    print("Generating static mock data files for Simulation Time...")

    # 1. building.json (Static info)
    building = {
        "buildingId": "B1",
        "floors": 5,
        "zones": ["A", "B", "C"],
        "address": "123 Rescue St."
    }

    # 2. cellular_events.json (Michal's format)
    cellular_events = [
        {"deviceId": "phone_104", "timestamp": f"{BASE_DATE}10:40:00", "areaId": "floor4_zoneA", "signalLost": False},
        {"deviceId": "phone_205", "timestamp": f"{BASE_DATE}10:40:15", "areaId": "floor4_zoneA", "signalLost": False},
        {"deviceId": "phone_104", "timestamp": f"{BASE_DATE}10:42:13", "areaId": "floor4_zoneA", "signalLost": True},
        {"deviceId": "phone_205", "timestamp": f"{BASE_DATE}10:43:05", "areaId": "floor4_zoneA", "signalLost": True}
    ]

    # 3. wifi_events.json
    wifi_events = [
        {"routerId": "wifi_4A", "timestamp": f"{BASE_DATE}10:40:00", "areaId": "floor4_zoneA", "status": "online"},
        {"routerId": "wifi_4A", "timestamp": f"{BASE_DATE}10:42:15", "areaId": "floor4_zoneA", "status": "offline"}
    ]

    # 4. smart_meter_events.json
    smart_meter_events = [
        {"meterId": "meter_4A", "timestamp": f"{BASE_DATE}10:40:00", "areaId": "floor4_zoneA", "usageLevel": "normal", "wentOffline": False},
        {"meterId": "meter_4A", "timestamp": f"{BASE_DATE}10:42:10", "areaId": "floor4_zoneA", "usageLevel": "high", "wentOffline": False},
        {"meterId": "meter_4A", "timestamp": f"{BASE_DATE}10:42:15", "areaId": "floor4_zoneA", "usageLevel": "offline", "wentOffline": True}
    ]

    # 5. wearable_events.json
    wearable_events = [
        {"wearableId": "watch_22", "timestamp": f"{BASE_DATE}10:40:00", "areaId": "floor4_zoneA", "heartRate": 72, "disconnected": False},
        {"wearableId": "watch_22", "timestamp": f"{BASE_DATE}10:42:14", "areaId": "floor4_zoneA", "heartRate": 145, "disconnected": True}
    ]

    # 6. collapse_events.json
    collapse_events = [
        {"eventId": "C-001", "timestamp": f"{BASE_DATE}10:42:00", "areaId": "floor4_zoneA", "severity": "high"}
    ]

    # 7. simulation_timeline.json (Elinor & Michal's combined UI state per simulation time)
    simulation_timeline = {
        "10:40": {
            "desc": "Building Stable",
            "buildingId": "B1",
            "zones": [create_zone_state(12, "low", 0, False, "normal", False)]
        },
        "10:42": {
            "desc": "Minor Collapse Detected",
            "buildingId": "B1",
            "zones": [create_zone_state(45, "medium", 1, False, "high", False)]
        },
        "10:43": {
            "desc": "Signals Lost",
            "buildingId": "B1",
            "zones": [create_zone_state(68, "high", 3, True, "high", False)]
        },
        "10:45": {
            "desc": "Critical Alert Triggered / Rescue Priority Updated",
            "buildingId": "B1",
            "zones": [create_zone_state(95, "critical", 4, True, "offline", True)]
        }
    }

    # Helper function to write files safely
    def save_json(filename, data):
        with open(filename, 'w') as f:
            json.dump(data, f, indent=4)
        print(f"Created: {filename}")

    # Save all files to the current directory (which is 'data')
    save_json('building.json', building)
    save_json('cellular_events.json', cellular_events)
    save_json('wifi_events.json', wifi_events)
    save_json('smart_meter_events.json', smart_meter_events)
    save_json('wearable_events.json', wearable_events)
    save_json('collapse_events.json', collapse_events)
    save_json('simulation_timeline.json', simulation_timeline)

    print("\nAll mock data files generated successfully for the server!")

if __name__ == "__main__":
    generate_mock_data_files()