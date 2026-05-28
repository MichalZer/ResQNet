def process_collapse_events(events):
    """
    Processes collapse events and returns:
    - score contribution
    - evidence list
    """

    score = 0
    evidence = []

    for event in events:

        severity = event.get("severity", "low")

        if severity == "low":
            score += 30
            evidence.append(
                "Minor structural damage detected"
            )

        elif severity == "medium":
            score += 70
            evidence.append(
                "Moderate structural damage detected"
            )

        elif severity == "high":
            score += 100
            evidence.append(
                "Severe structural damage detected"
            )

    # Prevent overflow
    score = min(score, 100)

    return {
        "score": score,
        "evidence": evidence
    }