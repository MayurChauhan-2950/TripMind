from models import BudgetRate
from services.budget_calc import calculate_budget


def test_calculate_budget_multiplies_rates_by_days():
    rate = BudgetRate(
        tier="Medium",
        hotel_per_day=2800,
        food_per_day=1000,
        transport_per_day=800,
        activities_per_day=700,
    )

    breakdown = calculate_budget(rate, days=3)

    assert breakdown["hotel_total"] == 8400
    assert breakdown["food_total"] == 3000
    assert breakdown["transport_total"] == 2400
    assert breakdown["activities_total"] == 2100
    assert breakdown["grand_total"] == 15900


def test_calculate_budget_single_day_equals_daily_rates():
    rate = BudgetRate(
        tier="Low",
        hotel_per_day=1000,
        food_per_day=500,
        transport_per_day=400,
        activities_per_day=300,
    )

    breakdown = calculate_budget(rate, days=1)

    assert breakdown["grand_total"] == 2200
