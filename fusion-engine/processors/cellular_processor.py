def process_cellular_events(events):
    """
    Processes cellular events and returns:
    - score contribution
    - evidence list
    """

    score = 0
    evidence = []

    lost_signals = 0

    for event in events:

        if event["eventType"] == "signal_lost":
            lost_signals += 1

    # Score logic
    score += lost_signals * 15

    # Prevent score from becoming too high
    score = min(score, 100)

    # Evidence
    if lost_signals > 0:
        evidence.append(
            f"{lost_signals} phones disconnected near collapse time"
        )

    return {
        "score": score,
        "evidence": evidence
    }