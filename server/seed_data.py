
from core.database import db


building_data = {
    "buildingId": "B1",
    "floors": 5,
    "areas": [
        {
            "areaId": "floor4_zoneA",
            "floor": 4,
            "zone": "A",
            "coordinates": {
                "x": 120,
                "y": 80
            }
        },
        {
            "areaId": "floor2_zoneB",
            "floor": 2,
            "zone": "B",
            "coordinates": {
                "x": 80,
                "y": 45
            }
        },
        {
            "areaId": "floor5_zoneC",
            "floor": 5,
            "zone": "C",
            "coordinates": {
                "x": 200,
                "y": 150
            }
        }
    ]
}
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
    },
    {
        "source": "cellular",
        "eventType": "signal_active",
        "timestamp": "2026-05-27T10:40:00",
        "areaId": "floor5_zoneC",
        "deviceId": "phone_301"
    },
    {
        "source": "cellular",
        "eventType": "signal_lost",
        "timestamp": "2026-05-27T10:43:00",
        "areaId": "floor5_zoneC",
        "deviceId": "phone_301"
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
        "severity": "medium"
    }
]
context = {
    "scenarioId": "tel_aviv_morning",
    "city": "Tel Aviv",
    "timeOfDay": "morning",
    "isShabbat": False,
    "isReligiousArea": False,
    "eventType": "building_collapse"
}
simulation_timeline = {
    "10:40": {
        "desc": "Building Stable",
        "buildingId": "B1",
        "zones": [
            {
                "id": "floor4_zoneA",
                "floor": 4,
                "name": "Zone A",
                "priorityScore": 12,
                "riskLevel": "low",
                "estimatedPeople": 4,
                "estimatedTrapped": 0,
                "signals": {
                    "phonesDisconnected": 0,
                    "wifiOffline": False,
                    "electricityUsage": "normal",
                    "wearableAlert": False
                },
                "evidence": [],
                "coordinates": {
                    "x": 120,
                    "y": 80
                }
            },
            {
                "id": "floor2_zoneB",
                "floor": 2,
                "name": "Zone B",
                "priorityScore": 5,
                "riskLevel": "low",
                "estimatedPeople": 2,
                "estimatedTrapped": 0,
                "signals": {
                    "phonesDisconnected": 0,
                    "wifiOffline": False,
                    "electricityUsage": "normal",
                    "wearableAlert": False
                },
                "evidence": [],
                "coordinates": {
                    "x": 80,
                    "y": 45
                }
            },
            {
                "id": "floor5_zoneC",
                "floor": 5,
                "name": "Zone C",
                "priorityScore": 10,
                "riskLevel": "low",
                "estimatedPeople": 3,
                "estimatedTrapped": 0,
                "signals": {
                    "phonesDisconnected": 0,
                    "wifiOffline": False,
                    "electricityUsage": "normal",
                    "wearableAlert": False
                },
                "evidence": [],
                "coordinates": {
                    "x": 200,
                    "y": 150
                }
            }
        ]
    },
    "10:42": {
        "desc": "Minor Collapse Detected",
        "buildingId": "B1",
        "zones": [
            {
                "id": "floor4_zoneA",
                "floor": 4,
                "name": "Zone A",
                "priorityScore": 45,
                "riskLevel": "medium",
                "estimatedPeople": 4,
                "estimatedTrapped": 4,
                "signals": {
                    "phonesDisconnected": 1,
                    "wifiOffline": False,
                    "electricityUsage": "high",
                    "wearableAlert": False
                },
                "evidence": [
                    "Electricity spike"
                ],
                "coordinates": {
                    "x": 120,
                    "y": 80
                }
            },
            {
                "id": "floor2_zoneB",
                "floor": 2,
                "name": "Zone B",
                "priorityScore": 5,
                "riskLevel": "low",
                "estimatedPeople": 2,
                "estimatedTrapped": 0,
                "signals": {
                    "phonesDisconnected": 0,
                    "wifiOffline": False,
                    "electricityUsage": "normal",
                    "wearableAlert": False
                },
                "evidence": [],
                "coordinates": {
                    "x": 80,
                    "y": 45
                }
            },
            {
                "id": "floor5_zoneC",
                "floor": 5,
                "name": "Zone C",
                "priorityScore": 30,
                "riskLevel": "low",
                "estimatedPeople": 3,
                "estimatedTrapped": 0,
                "signals": {
                    "phonesDisconnected": 0,
                    "wifiOffline": False,
                    "electricityUsage": "high",
                    "wearableAlert": False
                },
                "evidence": [
                    "Electricity spike"
                ],
                "coordinates": {
                    "x": 200,
                    "y": 150
                }
            }
        ]
    },
    "10:43": {
        "desc": "Signals Lost",
        "buildingId": "B1",
        "zones": [
            {
                "id": "floor4_zoneA",
                "floor": 4,
                "name": "Zone A",
                "priorityScore": 68,
                "riskLevel": "high",
                "estimatedPeople": 4,
                "estimatedTrapped": 4,
                "signals": {
                    "phonesDisconnected": 3,
                    "wifiOffline": True,
                    "electricityUsage": "offline",
                    "wearableAlert": False
                },
                "evidence": [
                    "WiFi offline",
                    "Phones lost"
                ],
                "coordinates": {
                    "x": 120,
                    "y": 80
                }
            },
            {
                "id": "floor2_zoneB",
                "floor": 2,
                "name": "Zone B",
                "priorityScore": 5,
                "riskLevel": "low",
                "estimatedPeople": 2,
                "estimatedTrapped": 0,
                "signals": {
                    "phonesDisconnected": 0,
                    "wifiOffline": False,
                    "electricityUsage": "normal",
                    "wearableAlert": False
                },
                "evidence": [],
                "coordinates": {
                    "x": 80,
                    "y": 45
                }
            },
            {
                "id": "floor5_zoneC",
                "floor": 5,
                "name": "Zone C",
                "priorityScore": 45,
                "riskLevel": "medium",
                "estimatedPeople": 3,
                "estimatedTrapped": 1,
                "signals": {
                    "phonesDisconnected": 1,
                    "wifiOffline": False,
                    "electricityUsage": "high",
                    "wearableAlert": False
                },
                "evidence": [
                    "Phone lost",
                    "Elevated HR"
                ],
                "coordinates": {
                    "x": 200,
                    "y": 150
                }
            }
        ]
    },
    "10:45": {
        "desc": "Critical Alert Triggered",
        "buildingId": "B1",
        "zones": [
            {
                "id": "floor4_zoneA",
                "floor": 4,
                "name": "Zone A",
                "priorityScore": 95,
                "riskLevel": "critical",
                "estimatedPeople": 4,
                "estimatedTrapped": 4,
                "signals": {
                    "phonesDisconnected": 4,
                    "wifiOffline": True,
                    "electricityUsage": "offline",
                    "wearableAlert": True
                },
                "evidence": [
                    "WiFi offline",
                    "Multiple phones lost",
                    "High HR"
                ],
                "coordinates": {
                    "x": 120,
                    "y": 80
                }
            },
            {
                "id": "floor2_zoneB",
                "floor": 2,
                "name": "Zone B",
                "priorityScore": 5,
                "riskLevel": "low",
                "estimatedPeople": 2,
                "estimatedTrapped": 0,
                "signals": {
                    "phonesDisconnected": 0,
                    "wifiOffline": False,
                    "electricityUsage": "normal",
                    "wearableAlert": False
                },
                "evidence": [],
                "coordinates": {
                    "x": 80,
                    "y": 45
                }
            },
            {
                "id": "floor5_zoneC",
                "floor": 5,
                "name": "Zone C",
                "priorityScore": 55,
                "riskLevel": "medium",
                "estimatedPeople": 3,
                "estimatedTrapped": 2,
                "signals": {
                    "phonesDisconnected": 1,
                    "wifiOffline": False,
                    "electricityUsage": "high",
                    "wearableAlert": True
                },
                "evidence": [
                    "Elevated HR",
                    "Partial collapse"
                ],
                "coordinates": {
                    "x": 200,
                    "y": 150
                }
            }
        ]
    }
}
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
        "eventType": "meter_offline",
        "timestamp": "2026-05-27T10:42:15",
        "areaId": "floor4_zoneA",
        "usageLevel": "offline"
    },
    {
        "source": "smart_meter",
        "eventType": "normal_usage",
        "timestamp": "2026-05-27T10:40:00",
        "areaId": "floor5_zoneC",
        "usageLevel": "normal"
    },
    {
        "source": "smart_meter",
        "eventType": "high_usage",
        "timestamp": "2026-05-27T10:42:15",
        "areaId": "floor5_zoneC",
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
    },
    {
        "source": "wearable",
        "eventType": "elevated_heart_rate",
        "timestamp": "2026-05-27T10:42:30",
        "areaId": "floor5_zoneC",
        "heartRate": 110
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
    },
    {
        "source": "wifi",
        "eventType": "router_online",
        "timestamp": "2026-05-27T10:40:00",
        "areaId": "floor5_zoneC",
        "connectedDevices": 2
    }
]
#rescue-scores = 

db.buildings.insert_one(building_data)
db.cellular_events.insert_many(cellular_events)
db.collapse_events.insert_many(collapse_events)
db.context.insert_one(context)
db.simulation_timeline.insert_one(simulation_timeline)
db.smart_meter_events.insert_many(smart_meter_events)
db.wearable_events.insert_many(wearable_events)
db.wifi_events.insert_many(wifi_events)