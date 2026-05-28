def process_wifi_events(events):
    """
    Processes WiFi events and returns:
    - score contribution
    - evidence list
    """

    score = 0
    evidence = []

    offline_routers = 0
    last_connected_devices = 0

    for event in events:
        if event.get("eventType") == "router_online":
            last_connected_devices += event.get("connectedDevices", 0)

        if event.get("eventType") == "router_offline":
            offline_routers += 1

    if offline_routers > 0:
        score += 60
        evidence.append("WiFi router went offline")

    if last_connected_devices > 0:
        score += min(last_connected_devices * 8, 40)
        evidence.append(f"{last_connected_devices} devices were connected to WiFi before the event")

    score = min(score, 100)

    return {
        "score": score,
        "evidence": evidence
    }