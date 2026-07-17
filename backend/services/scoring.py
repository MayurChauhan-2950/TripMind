from models import Destination

INTEREST_WEIGHT = 60
BUDGET_WEIGHT = 25
SEASON_WEIGHT = 15

BUDGET_TIER_ORDER = ["Low", "Medium", "High"]


def _interest_category_score(destination: Destination, interest: str) -> int:
    if interest == "nature":
        return destination.nature_score
    if interest == "food":
        return destination.food_score
    if interest == "adventure":
        return destination.adventure_score
    if interest == "shopping":
        return destination.shopping_score
    if interest == "history":
        return destination.historical_score
    if interest == "photography":
        return round((destination.nature_score + destination.historical_score) / 2)
    raise ValueError(f"Unknown interest: {interest}")


def _interest_component(destination: Destination, interests: list[str]) -> float:
    scores = [_interest_category_score(destination, interest) for interest in interests]
    avg_score = sum(scores) / len(scores)
    return (avg_score / 100) * INTEREST_WEIGHT


def _budget_component(destination: Destination, budget_level: str) -> float:
    destination_index = BUDGET_TIER_ORDER.index(destination.budget_level)
    requested_index = BUDGET_TIER_ORDER.index(budget_level)
    distance = abs(destination_index - requested_index)
    if distance == 0:
        return BUDGET_WEIGHT
    if distance == 1:
        return 12
    return 0


def _season_component(destination: Destination, season: str) -> float:
    destination_seasons = [s.strip() for s in destination.best_season.split(",")]
    if season in destination_seasons or "Year-round" in destination_seasons:
        return SEASON_WEIGHT
    return 0


def score_destination(
    destination: Destination, interests: list[str], budget_level: str, season: str
) -> tuple[int, dict[str, float]]:
    interest = _interest_component(destination, interests)
    budget = _budget_component(destination, budget_level)
    season_pts = _season_component(destination, season)

    total = round(interest + budget + season_pts)
    total = max(0, min(100, total))

    return total, {"interest": round(interest, 1), "budget": budget, "season": season_pts}


def rank_destinations(
    destinations: list[Destination], interests: list[str], budget_level: str, season: str
) -> list[tuple[Destination, int, dict[str, float]]]:
    scored = [
        (dest, *score_destination(dest, interests, budget_level, season)) for dest in destinations
    ]
    scored.sort(key=lambda item: item[1], reverse=True)
    return scored
