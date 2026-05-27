def get_risk_level(score):
    """
    Converts a numeric rescue score into a risk level.
    """

    if score >= 80:
        return "critical"

    elif score >= 60:
        return "high"

    elif score >= 30:
        return "medium"

    return "low"