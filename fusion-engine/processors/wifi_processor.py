def process_wifi_events(events, context=None):
    """
    Processes WiFi events and returns:
    - score contribution
    - evidence list
    """

    score = 0
    evidence = []

    offline_routers = 0
    last_connected_devices = 0

    wifi_multiplier = 1.0

    if context:
        if context.get("isReligiousArea") and context.get("isShabbat"):
            wifi_multiplier = 0.4

    for event in events:

        if event.get("eventType") == "router_online":
            last_connected_devices += event.get("connectedDevices", 0)

        if event.get("eventType") == "router_offline":
            offline_routers += 1

    if offline_routers > 0:
        score += int(60 * wifi_multiplier)
        evidence.append("WiFi router went offline")

    if last_connected_devices > 0:
        device_score = min(last_connected_devices * 8, 40)
        score += int(device_score * wifi_multiplier)

        evidence.append(
            f"{last_connected_devices} devices were connected to WiFi before the event"
        )

    score = min(score, 100)

    return {
        "score": score,
        "evidence": evidence
    }