import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from scoring.multi_area_fusion import calculate_multi_area_scores


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
        "eventType": "signal_active",
        "timestamp": "2026-05-27T10:40:00",
        "areaId": "floor2_zoneB",
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
    },

    {
        "source": "collapse",
        "eventType": "structural_damage",
        "timestamp": "2026-05-27T10:42:00",
        "areaId": "floor5_zoneC",
        "severity": "low"
    }
]

context = {
    "isShabbat": False,
    "isReligiousArea": False
}


results = calculate_multi_area_scores(
    cellular_events,
    wifi_events,
    smart_meter_events,
    wearable_events,
    collapse_events,
    context
)

print("\n=== MULTI AREA RESULTS ===\n")

for result in results:
    print(result)