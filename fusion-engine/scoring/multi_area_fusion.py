from scoring.rescue_score import calculate_rescue_score
from utils.area_utils import group_events_by_area
from utils.people_estimation import estimate_people_and_trapped


def calculate_multi_area_scores(
    cellular_events,
    wifi_events,
    smart_meter_events,
    wearable_events,
    collapse_events,
    context=None
):
    grouped_cellular = group_events_by_area(cellular_events)
    grouped_wifi = group_events_by_area(wifi_events)
    grouped_smart_meter = group_events_by_area(smart_meter_events)
    grouped_wearable = group_events_by_area(wearable_events)
    grouped_collapse = group_events_by_area(collapse_events)

    all_area_ids = set()
    all_area_ids.update(grouped_cellular.keys())
    all_area_ids.update(grouped_wifi.keys())
    all_area_ids.update(grouped_smart_meter.keys())
    all_area_ids.update(grouped_wearable.keys())
    all_area_ids.update(grouped_collapse.keys())

    results = []

    for area_id in all_area_ids:
        result = calculate_rescue_score(
            cellular_events=grouped_cellular.get(area_id, []),
            wifi_events=grouped_wifi.get(area_id, []),
            smart_meter_events=grouped_smart_meter.get(area_id, []),
            wearable_events=grouped_wearable.get(area_id, []),
            collapse_events=grouped_collapse.get(area_id, []),
            context=context
        )

        people_estimation = estimate_people_and_trapped(
            cellular_events=grouped_cellular.get(area_id, []),
            wearable_events=grouped_wearable.get(area_id, []),
            wifi_events=grouped_wifi.get(area_id, []),
            risk_level=result["riskLevel"]
        )

        result["areaId"] = area_id
        result["estimatedPeople"] = people_estimation["estimatedPeople"]
        result["estimatedTrapped"] = people_estimation["estimatedTrapped"]

        results.append(result)

    results.sort(key=lambda item: item["priorityScore"], reverse=True)

    return results