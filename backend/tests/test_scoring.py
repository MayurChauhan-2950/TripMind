import pytest

from models import Destination
from services.scoring import rank_destinations, score_destination


def make_destination(**overrides) -> Destination:
    defaults = dict(
        name="Test Destination",
        state="Test State",
        category="Adventure",
        budget_level="Medium",
        best_season="Summer, Winter",
        family_friendly=True,
        adventure_score=80,
        food_score=60,
        shopping_score=40,
        nature_score=90,
        historical_score=30,
        description="A place for testing.",
        image_url="https://example.com/image.jpg",
    )
    defaults.update(overrides)
    return Destination(**defaults)


@pytest.mark.parametrize(
    "destination_tier, requested_tier, expected_points",
    [
        ("Medium", "Medium", 25),
        ("Low", "Medium", 12),
        ("High", "Medium", 12),
        ("Low", "High", 0),
        ("High", "Low", 0),
    ],
)
def test_budget_component(destination_tier, requested_tier, expected_points):
    destination = make_destination(budget_level=destination_tier)
    _, breakdown = score_destination(destination, ["nature"], requested_tier, "Summer")
    assert breakdown["budget"] == expected_points


@pytest.mark.parametrize(
    "best_season, requested_season, expected_points",
    [
        ("Summer, Winter", "Summer", 15),
        ("Summer, Winter", "Monsoon", 0),
        ("Year-round", "Monsoon", 15),
    ],
)
def test_season_component(best_season, requested_season, expected_points):
    destination = make_destination(best_season=best_season)
    _, breakdown = score_destination(destination, ["nature"], "Medium", requested_season)
    assert breakdown["season"] == expected_points


def test_interest_component_single_category():
    destination = make_destination(nature_score=90)
    _, breakdown = score_destination(destination, ["nature"], "Medium", "Summer")
    assert breakdown["interest"] == pytest.approx(54.0)  # (90 / 100) * 60


def test_interest_component_averages_multiple_categories():
    destination = make_destination(nature_score=80, food_score=60)
    _, breakdown = score_destination(destination, ["nature", "food"], "Medium", "Summer")
    assert breakdown["interest"] == pytest.approx(42.0)  # avg(80, 60)/100 * 60


def test_photography_is_derived_from_nature_and_historical():
    destination = make_destination(nature_score=90, historical_score=30)
    _, breakdown = score_destination(destination, ["photography"], "Medium", "Summer")
    assert breakdown["interest"] == pytest.approx(36.0)  # avg(90, 30)=60 -> 60/100*60


def test_score_destination_sums_and_rounds_all_components():
    destination = make_destination(
        nature_score=100, budget_level="Medium", best_season="Summer"
    )
    total, breakdown = score_destination(destination, ["nature"], "Medium", "Summer")
    assert total == 100  # 60 (interest) + 25 (budget) + 15 (season)


def test_score_destination_clamps_between_0_and_100():
    destination = make_destination(nature_score=0, budget_level="High", best_season="Monsoon")
    total, _ = score_destination(destination, ["nature"], "Low", "Summer")
    assert 0 <= total <= 100


def test_rank_destinations_sorts_highest_score_first():
    strong_match = make_destination(
        name="Strong Match", nature_score=100, budget_level="Medium", best_season="Summer"
    )
    weak_match = make_destination(
        name="Weak Match", nature_score=10, budget_level="High", best_season="Monsoon"
    )

    ranked = rank_destinations([weak_match, strong_match], ["nature"], "Medium", "Summer")

    assert [dest.name for dest, _, _ in ranked] == ["Strong Match", "Weak Match"]
