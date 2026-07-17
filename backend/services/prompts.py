def _hobbies_clause(hobbies: list[str] | None) -> str:
    if not hobbies:
        return ""
    return f" The traveler's personal hobbies include: {', '.join(hobbies)} — factor these in where relevant."


def build_budget_tip_prompt(destination: str, breakdown: dict) -> str:
    return (
        f"A traveler is planning a trip to {destination}, India with this budget breakdown "
        f"in INR: hotel {breakdown['hotel_total']}, food {breakdown['food_total']}, "
        f"transport {breakdown['transport_total']}, activities {breakdown['activities_total']}, "
        f"grand total {breakdown['grand_total']}. "
        'Respond with JSON only: {"tip": "<one short, specific cost-saving tip, under 30 words>"}'
    )


def build_itinerary_prompt(
    destination: str,
    days: int,
    budget_level: str,
    interests: list[str],
    hobbies: list[str] | None = None,
) -> str:
    interest_list = ", ".join(interests)
    return (
        f"Create a {days}-day travel itinerary for {destination}, India. "
        f"Budget level: {budget_level}. Interests: {interest_list}.{_hobbies_clause(hobbies)} "
        "Return ONLY a valid JSON array — no text before or after the JSON. "
        "Each element represents one day and must follow this exact shape: "
        '{"day": 1, "activities": ["activity 1", "activity 2", "activity 3"], '
        '"meals": ["Breakfast: ...", "Lunch: ...", "Dinner: ..."], '
        '"notes": "one short practical tip for that day"}. '
        f"The array must have exactly {days} elements, numbered day 1 through {days}. "
        "Keep activities specific to real places in the destination. "
        "Do NOT include trailing commas. Do NOT include any markdown or explanation."
    )


def build_compare_prompt(
    dest_a_name: str,
    dest_b_name: str,
    comparison_table: list[dict],
    hobbies: list[str] | None = None,
) -> str:
    rows = "; ".join(
        f"{row['metric']}: {dest_a_name}={row['value_a']}, {dest_b_name}={row['value_b']}"
        for row in comparison_table
    )
    return (
        f"Compare these two Indian travel destinations for a traveler deciding between them: "
        f"{rows}.{_hobbies_clause(hobbies)} "
        'Respond with JSON only: {"summary": "<2-3 sentences on which destination suits which '
        'kind of traveler, referencing the data above>"}'
    )


def build_hidden_gems_prompt(destination: str, hobbies: list[str] | None = None) -> str:
    return (
        f"Suggest 5 lesser-known local spots near {destination}, India that tourists usually "
        f"miss, with a one-line reason for each.{_hobbies_clause(hobbies)} "
        'Respond with JSON only: {"gems": [{"name": "...", "reason": "..."}]} with exactly 5 items.'
    )


def build_packing_list_prompt(destination: str, season: str, days: int) -> str:
    return (
        f"Generate a packing checklist for a {days}-day trip to {destination}, India during "
        f"{season}. "
        'Respond with JSON only: {"items": ["...", "..."]} with 8-15 concise checklist items.'
    )
