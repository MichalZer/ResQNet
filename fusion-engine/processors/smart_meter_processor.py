def process_smart_meter_events(events):
    """
    Processes smart meter events and returns:
    - score contribution
    - evidence list
    """

    score = 0
    evidence = []

    high_usage_detected = False
    meter_offline_detected = False

    for event in events:
        event_type = event.get("eventType")

        if event_type == "high_usage":
            high_usage_detected = True

        if event_type == "meter_offline":
            meter_offline_detected = True

    if high_usage_detected:
        score += 60
        evidence.append("High electricity usage detected before the event")

    if meter_offline_detected:
        score += 50
        evidence.append("Smart meter went offline after the event")

    score = min(score, 100)

    return {
        "score": score,
        "evidence": evidence
    }