from models import Destination

SCORE_FIELDS = [
    ("Adventure", "adventure_score"),
    ("Food", "food_score"),
    ("Shopping", "shopping_score"),
    ("Nature", "nature_score"),
    ("History", "historical_score"),
]


def build_comparison_table(dest_a: Destination, dest_b: Destination) -> list[dict]:
    rows = [
        {"metric": "Budget level", "value_a": dest_a.budget_level, "value_b": dest_b.budget_level},
        {"metric": "Best season", "value_a": dest_a.best_season, "value_b": dest_b.best_season},
        {
            "metric": "Family friendly",
            "value_a": "Yes" if dest_a.family_friendly else "No",
            "value_b": "Yes" if dest_b.family_friendly else "No",
        },
    ]
    for label, field in SCORE_FIELDS:
        rows.append(
            {
                "metric": label,
                "value_a": str(getattr(dest_a, field)),
                "value_b": str(getattr(dest_b, field)),
            }
        )
    return rows
