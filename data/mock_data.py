import json
import os

BASE_DATE = "2026-05-27T"

# השורה הזו מבטיחה שהתיקייה תיווצר בדיוק איפה שהקובץ הזה נמצא
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

def create_event(source, event_type, time_str, area_id, extra_data=None):
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

def save_scenario_files(folder_name, context, building, cellular, wifi, smart_meter, wearable, collapse, timeline):
    # יצירת הנתיב לתיקיית scenarios בתוך data
    folder_path = os.path.join(CURRENT_DIR, "scenarios", folder_name)
    os.makedirs(folder_path, exist_ok=True)

    files_to_save = {
        "context.json": context,
        "building.json": building,
        "cellular_events.json": cellular,
        "wifi_events.json": wifi,
        "smart_meter_events.json": smart_meter,
        "wearable_events.json": wearable,
        "collapse_events.json": collapse,
        "simulation_timeline.json": timeline
    }

    for filename, data in files_to_save.items():
        file_path = os.path.join(folder_path, filename)
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)
    
    print(f"✅ Successfully generated scenario: {folder_name}")

def generate_tel_aviv_scenario():
    context = {
        "scenarioId": "tel_aviv_morning",
        "city": "Tel Aviv",
        "timeOfDay": "morning",
        "isShabbat": False,
        "isReligiousArea": False,
        "eventType": "building_collapse"
    }

    building = {
        "buildingId": "B1",
        "floors": 5,
        "areas": [
            {"areaId": "floor4_zoneA", "floor": 4, "zone": "A", "coordinates": {"x": 120, "y": 80}},
            {"areaId": "floor2_zoneB", "floor": 2, "zone": "B", "coordinates": {"x": 80, "y": 45}},
            {"areaId": "floor5_zoneC", "floor": 5, "zone": "C", "coordinates": {"x": 200, "y": 150}}
        ]
    }

    cellular = [
        create_event("cellular", "signal_active", "10:40:00", "floor4_zoneA", {"deviceId": "phone_104"}),
        create_event("cellular", "signal_lost", "10:42:13", "floor4_zoneA", {"deviceId": "phone_104"}),
        create_event("cellular", "signal_active", "10:40:00", "floor5_zoneC", {"deviceId": "phone_301"}),
        create_event("cellular", "signal_lost", "10:43:00", "floor5_zoneC", {"deviceId": "phone_301"})
    ]

    wifi = [
        create_event("wifi", "router_online", "10:40:00", "floor4_zoneA", {"connectedDevices": 4}),
        create_event("wifi", "router_offline", "10:42:15", "floor4_zoneA", {"connectedDevices": 0}),
        create_event("wifi", "router_online", "10:40:00", "floor5_zoneC", {"connectedDevices": 2})
    ]

    smart_meter = [
        create_event("smart_meter", "normal_usage", "10:40:00", "floor4_zoneA", {"usageLevel": "normal"}),
        create_event("smart_meter", "meter_offline", "10:42:15", "floor4_zoneA", {"usageLevel": "offline"}),
        create_event("smart_meter", "normal_usage", "10:40:00", "floor5_zoneC", {"usageLevel": "normal"}),
        create_event("smart_meter", "high_usage", "10:42:15", "floor5_zoneC", {"usageLevel": "high"})
    ]

    wearable = [
        create_event("wearable", "high_heart_rate", "10:42:14", "floor4_zoneA", {"heartRate": 145}),
        create_event("wearable", "elevated_heart_rate", "10:42:30", "floor5_zoneC", {"heartRate": 110})
    ]

    collapse = [
        create_event("collapse", "structural_damage", "10:42:00", "floor4_zoneA", {"severity": "high"}),
        create_event("collapse", "structural_damage", "10:42:00", "floor5_zoneC", {"severity": "medium"})
    ]

    timeline = {
        "10:40": {
            "desc": "Building Stable",
            "buildingId": "B1",
            "zones": [
                create_zone_state("floor4_zoneA", 4, "Zone A", 12, "low", 4, 0, 0, False, "normal", False, [], 120, 80),
                create_zone_state("floor2_zoneB", 2, "Zone B", 5, "low", 2, 0, 0, False, "normal", False, [], 80, 45),
                create_zone_state("floor5_zoneC", 5, "Zone C", 10, "low", 3, 0, 0, False, "normal", False, [], 200, 150)
            ]
        },
        "10:42": {
            "desc": "Minor Collapse Detected",
            "buildingId": "B1",
            "zones": [
                create_zone_state("floor4_zoneA", 4, "Zone A", 45, "medium", 4, 4, 1, False, "high", False, ["Electricity spike"], 120, 80),
                create_zone_state("floor2_zoneB", 2, "Zone B", 5, "low", 2, 0, 0, False, "normal", False, [], 80, 45),
                create_zone_state("floor5_zoneC", 5, "Zone C", 30, "low", 3, 0, 0, False, "high", False, ["Electricity spike"], 200, 150)
            ]
        },
        "10:43": {
            "desc": "Signals Lost",
            "buildingId": "B1",
            "zones": [
                create_zone_state("floor4_zoneA", 4, "Zone A", 68, "high", 4, 4, 3, True, "offline", False, ["WiFi offline", "Phones lost"], 120, 80),
                create_zone_state("floor2_zoneB", 2, "Zone B", 5, "low", 2, 0, 0, False, "normal", False, [], 80, 45),
                create_zone_state("floor5_zoneC", 5, "Zone C", 45, "medium", 3, 1, 1, False, "high", False, ["Phone lost", "Elevated HR"], 200, 150)
            ]
        },
        "10:45": {
            "desc": "Critical Alert Triggered",
            "buildingId": "B1",
            "zones": [
                create_zone_state("floor4_zoneA", 4, "Zone A", 95, "critical", 4, 4, 4, True, "offline", True, ["WiFi offline", "Multiple phones lost", "High HR"], 120, 80),
                create_zone_state("floor2_zoneB", 2, "Zone B", 5, "low", 2, 0, 0, False, "normal", False, [], 80, 45),
                create_zone_state("floor5_zoneC", 5, "Zone C", 55, "medium", 3, 2, 1, False, "high", True, ["Elevated HR", "Partial collapse"], 200, 150)
            ]
        }
    }

    save_scenario_files("tel_aviv_morning", context, building, cellular, wifi, smart_meter, wearable, collapse, timeline)

def generate_bnei_brak_scenario():
    context = {
        "scenarioId": "bnei_brak_shabbat",
        "city": "Bnei Brak",
        "timeOfDay": "afternoon",
        "isShabbat": True,
        "isReligiousArea": True,
        "eventType": "building_collapse"
    }

    building = {
        "buildingId": "B2",
        "floors": 3,
        "areas": [
            {"areaId": "floor1_zoneA", "floor": 1, "zone": "A", "coordinates": {"x": 100, "y": 50}},
            {"areaId": "floor3_zoneB", "floor": 3, "zone": "B", "coordinates": {"x": 100, "y": 150}}
        ]
    }

    cellular = [create_event("cellular", "signal_active", "14:00:00", "floor1_zoneA", {"deviceId": "phone_999"})]
    wifi = [] 

    smart_meter = [
        create_event("smart_meter", "normal_usage", "14:00:00", "floor3_zoneB", {"usageLevel": "high"}),
        create_event("smart_meter", "meter_offline", "14:05:00", "floor3_zoneB", {"usageLevel": "offline"})
    ]

    wearable = [create_event("wearable", "high_heart_rate", "14:05:10", "floor3_zoneB", {"heartRate": 160})]
    collapse = [create_event("collapse", "structural_damage", "14:05:00", "floor3_zoneB", {"severity": "critical"})]

    timeline = {
        "14:00": {
            "desc": "Quiet Shabbat Afternoon",
            "buildingId": "B2",
            "zones": [create_zone_state("floor3_zoneB", 3, "Zone B", 5, "low", 6, 0, 0, False, "normal", False, [], 100, 150)]
        },
        "14:05": {
            "desc": "Collapse Detected via Smart Meters",
            "buildingId": "B2",
            "zones": [create_zone_state("floor3_zoneB", 3, "Zone B", 88, "critical", 6, 6, 0, False, "offline", True, ["Smart meter offline", "High HR detected", "Structural damage"], 100, 150)]
        }
    }

    save_scenario_files("bnei_brak_shabbat", context, building, cellular, wifi, smart_meter, wearable, collapse, timeline)

if __name__ == "__main__":
    print("Starting Data Generation...")
    generate_tel_aviv_scenario()
    generate_bnei_brak_scenario()
    print("All done! The scenarios are ready for the server and UI.")