def estimate_people_and_trapped(
    cellular_events,
    wearable_events,
    wifi_events,
    risk_level
):
    """
    Basic estimation logic for:
    - estimatedPeople
    - estimatedTrapped
    """

    device_ids = set()
    wearable_ids = set()

    # Count phones
    for event in cellular_events:

        device_id = event.get("deviceId")

        if device_id:
            device_ids.add(device_id)

    # Count wearables
    for event in wearable_events:

        wearable_id = event.get("wearableId")

        if wearable_id:
            wearable_ids.add(wearable_id)

    # Basic estimation
    estimated_people = (
        len(device_ids)
        + len(wearable_ids)
    )

    # WiFi connected devices
    wifi_devices = 0

    for event in wifi_events:

        wifi_devices = max(
            wifi_devices,
            event.get("connectedDevices", 0)
        )

    estimated_people = max(
        estimated_people,
        wifi_devices
    )

    # Estimated trapped
    if risk_level in ["high", "critical"]:
        estimated_trapped = estimated_people

    elif risk_level == "medium":
        estimated_trapped = round(
            estimated_people * 0.5
        )

    else:
        estimated_trapped = 0

    return {
        "estimatedPeople": estimated_people,
        "estimatedTrapped": estimated_trapped
    } 