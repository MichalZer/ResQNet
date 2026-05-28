import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from simulation.simulation_fusion import calculate_simulation_scores

cellular_events = [
    {
        "source": "cellular",
        "eventType": "signal_active",
        "timestamp": "2026-05-27T10:40:00",
        "areaId": "floor4_zoneA",
        "deviceId": "phone_104"
    },
    {
        "source": "cellular",
        "eventType": "signal_lost",
        "timestamp": "2026-05-27T10:42:13",
        "areaId": "floor4_zoneA",
        "deviceId": "phone_104"
    }
]

wifi_events = [
    {
        "source": "wifi",
        "eventType": "router_online",
        "timestamp": "2026-05-27T10:40:00",
        "areaId": "floor4_zoneA",
        "connectedDevices": 4
    },
    {
        "source": "wifi",
        "eventType": "router_offline",
        "timestamp": "2026-05-27T10:42:15",
        "areaId": "floor4_zoneA",
        "connectedDevices": 0
    }
]

smart_meter_events = [
    {
        "source": "smart_meter",
        "eventType": "normal_usage",
        "timestamp": "2026-05-27T10:40:00",
        "areaId": "floor4_zoneA",
        "usageLevel": "normal"
    },
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
        "eventType": "normal_heart_rate",
        "timestamp": "2026-05-27T10:40:00",
        "areaId": "floor4_zoneA",
        "heartRate": 72
    },
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


for simulation_time in ["10:40", "10:42", "10:43", "10:45"]:
    print(f"\n=== SCORES AT {simulation_time} ===")

    results = calculate_simulation_scores(
        simulation_time,
        cellular_events,
        wifi_events,
        smart_meter_events,
        wearable_events,
        collapse_events,
        context
    )

    for result in results:
        print(result)