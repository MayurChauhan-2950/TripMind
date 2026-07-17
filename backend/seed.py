from sqlalchemy.orm import Session

from data.budget_rates_seed import BUDGET_RATES_SEED
from data.destinations_seed import DESTINATIONS_SEED
from models import BudgetRate, Destination


def run_seed(db: Session) -> None:
    if db.query(Destination).count() == 0:
        db.bulk_insert_mappings(Destination, DESTINATIONS_SEED)

    if db.query(BudgetRate).count() == 0:
        db.bulk_insert_mappings(BudgetRate, BUDGET_RATES_SEED)

    db.commit()
