from utils.time_utils import filter_events_until_time

from scoring.multi_area_fusion import (
    calculate_multi_area_scores
)


def calculate_simulation_scores(
    simulation_time,
    cellular_events,
    wifi_events,
    smart_meter_events,
    wearable_events,
    collapse_events,
    context=None
):
    """
    Calculates rescue scores
    based on current simulation time.
    """

    filtered_cellular = filter_events_until_time(
        cellular_events,
        simulation_time
    )

    filtered_wifi = filter_events_until_time(
        wifi_events,
        simulation_time
    )

    filtered_smart_meter = filter_events_until_time(
        smart_meter_events,
        simulation_time
    )

    filtered_wearable = filter_events_until_time(
        wearable_events,
        simulation_time
    )

    filtered_collapse = filter_events_until_time(
        collapse_events,
        simulation_time
    )

    return calculate_multi_area_scores(
        filtered_cellular,
        filtered_wifi,
        filtered_smart_meter,
        filtered_wearable,
        filtered_collapse,
        context
    )