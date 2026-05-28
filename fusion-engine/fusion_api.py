from simulation.simulation_fusion import (
    calculate_simulation_scores
)


def get_rescue_scores(
    signals,
    simulation_time,
    context=None
):
    """
    Main Fusion Engine API.

    Receives signals from the server
    and returns calculated rescue scores.
    """

    cellular_events = signals.get("cellular", [])

    wifi_events = signals.get("wifi", [])

    wearable_events = signals.get("wearable", [])

    smart_meter_events = signals.get(
        "smartMeter",
        []
    )

    collapse_events = signals.get(
        "collapse",
        []
    )

    results = calculate_simulation_scores(
        simulation_time=simulation_time,

        cellular_events=cellular_events,

        wifi_events=wifi_events,

        smart_meter_events=smart_meter_events,

        wearable_events=wearable_events,

        collapse_events=collapse_events,

        context=context
    )

    return results