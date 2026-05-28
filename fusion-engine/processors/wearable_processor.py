def process_wearable_events(events):
    """
    Processes wearable events and returns:
    - score contribution
    - evidence list
    """

    score = 0
    evidence = []

    high_heart_rate_detected = False
    disconnected_devices = 0

    for event in events:

        event_type = event["eventType"]

        if event_type == "high_heart_rate":
            high_heart_rate_detected = True

        if event_type == "device_disconnected":
            disconnected_devices += 1

    # High heart rate before disconnect
    if high_heart_rate_detected:
        score += 70
        evidence.append(
            "Wearable detected elevated heart rate"
        )

    # Device disconnected
    if disconnected_devices > 0:
        score += disconnected_devices * 35

        evidence.append(
            f"{disconnected_devices} wearable devices disconnected"
        )

    # Prevent score overflow
    score = min(score, 100)

    return {
        "score": score,
        "evidence": evidence
    }