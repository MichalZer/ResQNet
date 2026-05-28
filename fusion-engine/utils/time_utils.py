from datetime import datetime


def parse_event_time(timestamp):
    """
    Converts timestamp string into datetime object.
    Example: 2026-05-27T10:42:13
    """
    return datetime.fromisoformat(timestamp)


def parse_simulation_time(simulation_time, base_date="2026-05-27"):
    """
    Converts simulation time like 10:42 into datetime object.
    """
    return datetime.fromisoformat(f"{base_date}T{simulation_time}:00")


def filter_events_until_time(events, simulation_time, base_date="2026-05-27"):
    """
    Returns only events that happened until the current simulation time.
    """

    current_time = parse_simulation_time(simulation_time, base_date)

    filtered_events = []

    for event in events:
        event_time = parse_event_time(event["timestamp"])

        if event_time <= current_time:
            filtered_events.append(event)

    return filtered_events