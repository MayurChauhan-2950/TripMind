from models import BudgetRate


def calculate_budget(rate: BudgetRate, days: int) -> dict:
    hotel_total = rate.hotel_per_day * days
    food_total = rate.food_per_day * days
    transport_total = rate.transport_per_day * days
    activities_total = rate.activities_per_day * days
    grand_total = hotel_total + food_total + transport_total + activities_total

    return {
        "hotel_total": hotel_total,
        "food_total": food_total,
        "transport_total": transport_total,
        "activities_total": activities_total,
        "grand_total": grand_total,
    }
