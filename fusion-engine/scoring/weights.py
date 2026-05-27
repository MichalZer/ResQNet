BASE_WEIGHTS = {
    "cellular": 0.35,
    "smart_meter": 0.25,
    "wifi": 0.20,
    "wearable": 0.15,
    "collapse": 0.05
}


def get_context_adjusted_weights(context=None):
    """
    Returns the weights for each data source.
    Later we can adjust the weights based on context,
    for example: Shabbat, religious area, night time, etc.
    """

    weights = BASE_WEIGHTS.copy()

    if context is None:
        return weights

    is_shabbat = context.get("isShabbat", False)
    is_religious_area = context.get("isReligiousArea", False)

    if is_shabbat and is_religious_area:
        weights["wifi"] = 0.05
        weights["cellular"] = 0.20
        weights["smart_meter"] = 0.35
        weights["wearable"] = 0.20
        weights["collapse"] = 0.20

    return weights