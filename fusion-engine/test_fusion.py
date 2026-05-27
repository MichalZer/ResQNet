from scoring.rescue_score import calculate_rescue_score


cellular_events = [
    {
        "source": "cellular",
        "eventType": "signal_lost",
        "timestamp": "2026-05-27T10:42:13",
        "areaId": "floor4_zoneA",
        "deviceId": "phone_104"
    },
    {
        "source": "cellular",
        "eventType": "signal_lost",
        "timestamp": "2026-05-27T10:42:30",
        "areaId": "floor4_zoneA",
        "deviceId": "phone_205"
    }
]

wifi_events = [
    {
        "source": "wifi",
        "eventType": "router_offline",
        "timestamp": "2026-05-27T10:42:15",
        "areaId": "floor4_zoneA",
        "connectedDevices": 4
    }
]

smart_meter_events = [
    {
        "source": "smart_meter",
        "eventType": "high_usage",
        "timestamp": "2026-05-27T10:42:10",
        "areaId": "floor4_zoneA",
        "usageLevel": "high"
    }
]

wearable_events = [
    {
        "source": "wearable",
        "eventType": "high_heart_rate",
        "timestamp": "2026-05-27T10:42:14",
        "areaId": "floor4_zoneA",
        "heartRate": 145
    }
]

collapse_events = [
    {
        "source": "collapse",
        "eventType": "structural_damage",
        "timestamp": "2026-05-27T10:42:00",
        "areaId": "floor4_zoneA",
        "severity": "high"
    }
]

context = {
    "isShabbat": False,
    "isReligiousArea": False
}

result = calculate_rescue_score(
    cellular_events,
    wifi_events,
    smart_meter_events,
    wearable_events,
    collapse_events,
    context
)

print(result)