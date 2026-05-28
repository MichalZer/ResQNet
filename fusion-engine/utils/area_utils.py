def group_events_by_area(events):
    """
    Groups events by areaId.
    """

    grouped = {}

    for event in events:
        area_id = event.get("areaId")

        if not area_id:
            continue

        if area_id not in grouped:
            grouped[area_id] = []

        grouped[area_id].append(event)

    return grouped