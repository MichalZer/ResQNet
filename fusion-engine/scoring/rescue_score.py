from scoring.weights import get_context_adjusted_weights
from scoring.risk_levels import get_risk_level

from processors.cellular_processor import process_cellular_events
from processors.wifi_processor import process_wifi_events
from processors.smart_meter_processor import process_smart_meter_events
from processors.wearable_processor import process_wearable_events
from processors.collapse_processor import process_collapse_events


def calculate_rescue_score(
    cellular_events,
    wifi_events,
    smart_meter_events,
    wearable_events,
    collapse_events,
    context=None
):
    """
    Main Fusion Engine.
    Combines all processors into one rescue priority score.
    """

    # Get dynamic weights
    weights = get_context_adjusted_weights(context)

    # Run processors
    cellular_result = process_cellular_events(cellular_events)

    wifi_result = process_wifi_events(wifi_events, context=context)

    smart_meter_result = process_smart_meter_events(
        smart_meter_events
    )

    wearable_result = process_wearable_events(
        wearable_events
    )

    collapse_result = process_collapse_events(
        collapse_events
    )

    # Weighted score calculation
    final_score = (
        cellular_result["score"] * weights["cellular"]
        + wifi_result["score"] * weights["wifi"]
        + smart_meter_result["score"] * weights["smart_meter"]
        + wearable_result["score"] * weights["wearable"]
        + collapse_result["score"] * weights["collapse"]
    )

    # Prevent overflow
    final_score = min(round(final_score), 100)

    # Risk level
    risk_level = get_risk_level(final_score)

    # Combine evidence
    evidence = (
        cellular_result["evidence"]
        + wifi_result["evidence"]
        + smart_meter_result["evidence"]
        + wearable_result["evidence"]
        + collapse_result["evidence"]
    )

    # Final output
    return {
        "priorityScore": final_score,
        "riskLevel": risk_level,
        "evidence": evidence
    }