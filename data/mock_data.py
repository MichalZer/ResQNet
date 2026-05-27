import json
import os

BASE_DATE = "2026-05-27T"

def create_event(source, event_type, time_str, area_id, extra_data=None):
    """
    Helper function to create a uniform event structure.
    Every event MUST have source, eventType, timestamp, and areaId.
    """
    event = {
        "source": source,
        "eventType": event_type,
        "timestamp": f"{BASE_DATE}{time_str}",
        "areaId": area_id
    }
    if extra_data:
        event.update(extra_data)
    return event

def create_zone_state(area_id, floor, name, priority_score, risk_level, people, trapped, phones_disconnected, wifi_offline, electricity, wearable, evidence, x, y):
    """
    Helper for Elinor's UI format, now including separated estimatedPeople/estimatedTrapped and evidence.
    """
    return {
        "id": area_id,
        "floor": floor,
        "name": name,
        "priorityScore": priority_score,
        "riskLevel": risk_level,
        "estimatedPeople": people,
        "estimatedTrapped": trapped,
        "signals": {
            "phonesDisconnected": phones_disconnected,
            "wifiOffline": wifi_offline,
            "electricityUsage": electricity,
            "wearableAlert": wearable
        },
        "evidence": evidence,
        "coordinates": {"x": x, "y": y}
    }

def generate_mock_data_files():
    print("Generating comprehensive Mock Data & Simulation files...")

    # 1. building.json (Updated with real areas and coordinates)
    building = {
        "buildingId": "B1",
        "floors": 5,
        "areas": [
            {"areaId": "floor4_zoneA", "floor": 4, "zone": "A", "coordinates": {"x": 120, "y": 80}},
            {"areaId": "floor2_zoneB", "floor": 2, "zone": "B", "coordinates": {"x": 80, "y": 45}},
            {"areaId": "floor5_zoneC", "floor": 5, "zone": "C", "coordinates": {"x": 200, "y": 150}}
        ]
    }

    # 2. cellular_events.json (Using uniform structure)
    cellular_events = [
        create_event("cellular", "signal_active", "10:40:00", "floor4_zoneA", {"deviceId": "phone_104"}),
        create_event("cellular", "signal_active", "10:40:00", "floor2_zoneB", {"deviceId": "phone_205"}),
        create_event("cellular", "signal_lost", "10:42:13", "floor4_zoneA", {"deviceId": "phone_104"}),
        create_event("cellular", "signal_active", "10:45:00", "floor2_zoneB", {"deviceId": "phone_205"}) # Floor 2 is safe
    ]

    # 3. wifi_events.json
    wifi_events = [
        create_event("wifi", "router_online", "10:40:00", "floor4_zoneA", {"connectedDevices": 4}),
        create_event("wifi", "router_online", "10:40:00", "floor2_zoneB", {"connectedDevices": 2}),
        create_event("wifi", "router_offline", "10:42:15", "floor4_zoneA", {"connectedDevices": 0})
    ]

    # 4. smart_meter_events.json
    smart_meter_events = [
        create_event("smart_meter", "normal_usage", "10:40:00", "floor4_zoneA", {"usageLevel": "normal"}),
        create_event("smart_meter", "high_usage", "10:42:10", "floor4_zoneA", {"usageLevel": "high"}),
        create_event("smart_meter", "meter_offline", "10:42:15", "floor4_zoneA", {"usageLevel": "offline"})
    ]

    # 5. wearable_events.json
    wearable_events = [
        create_event("wearable", "normal_heart_rate", "10:40:00", "floor4_zoneA", {"heartRate": 72}),
        create_event("wearable", "high_heart_rate", "10:42:14", "floor4_zoneA", {"heartRate": 145}),
        create_event("wearable", "device_disconnected", "10:43:00", "floor4_zoneA", {"heartRate": 0})
    ]

    # 6. collapse_events.json
    collapse_events = [
        create_event("collapse", "structural_damage", "10:42:00", "floor4_zoneA", {"severity": "high"}),
        create_event("collapse", "structural_damage", "10:42:00", "floor5_zoneC", {"severity": "low"})
    ]

    # 7. simulation_timeline.json (Enriched Timeline for UI with multiple zones)
    simulation_timeline = {
        "10:40": {
            "desc": "Building Stable",
            "buildingId": "B1",
            "zones": [
                # Before collapse: People=4, Trapped=0, Evidence is empty
                create_zone_state("floor4_zoneA", 4, "Zone A", 12, "low", 4, 0, 0, False, "normal", False, [], 120, 80),
                create_zone_state("floor2_zoneB", 2, "Zone B", 5, "low", 2, 0, 0, False, "normal", False, [], 80, 45)
            ]
        },
        "10:42": {
            "desc": "Minor Collapse Detected",
            "buildingId": "B1",
            "zones": [
                # Collapse starts: Trapped=4, Evidence added
                create_zone_state("floor4_zoneA", 4, "Zone A", 45, "medium", 4, 4, 1, False, "high", False, ["Electricity usage spike"], 120, 80),
                create_zone_state("floor2_zoneB", 2, "Zone B", 5, "low", 2, 0, 0, False, "normal", False, [], 80, 45)
            ]
        },
        "10:43": {
            "desc": "Signals Lost",
            "buildingId": "B1",
            "zones": [
                create_zone_state("floor4_zoneA", 4, "Zone A", 68, "high", 4, 4, 3, True, "offline", False, ["Electricity usage spike", "WiFi offline", "Multiple phones lost"], 120, 80),
                create_zone_state("floor2_zoneB", 2, "Zone B", 5, "low", 2, 0, 0, False, "normal", False, [], 80, 45)
            ]
        },
        "10:45": {
            "desc": "Critical Alert Triggered / Rescue Priority Updated",
            "buildingId": "B1",
            "zones": [
                create_zone_state("floor4_zoneA", 4, "Zone A", 95, "critical", 4, 4, 4, True, "offline", True, ["Electricity usage spike", "WiFi offline", "Multiple phones lost", "Wearable high HR"], 120, 80),
                create_zone_state("floor2_zoneB", 2, "Zone B", 5, "low", 2, 0, 0, False, "normal", False, [], 80, 45)
            ]
        }
    }

    # Helper function to save files
    def save_json(filename, data):
        with open(filename, 'w') as f:
            json.dump(data, f, indent=4)
        print(f"Created: {filename}")

    save_json('building.json', building)
    save_json('cellular_events.json', cellular_events)
    save_json('wifi_events.json', wifi_events)
    save_json('smart_meter_events.json', smart_meter_events)
    save_json('wearable_events.json', wearable_events)
    save_json('collapse_events.json', collapse_events)
    save_json('simulation_timeline.json', simulation_timeline)

    print("\nAll mock data files generated successfully based on Michal's specifications!")

if __name__ == "__main__":
    generate_mock_data_files()