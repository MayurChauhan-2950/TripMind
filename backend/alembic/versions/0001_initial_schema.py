"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-07-18

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "destinations",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("state", sa.String(length=100), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("budget_level", sa.String(length=20), nullable=False),
        sa.Column("best_season", sa.String(length=100), nullable=False),
        sa.Column("family_friendly", sa.Boolean(), nullable=True, server_default=sa.true()),
        sa.Column("adventure_score", sa.Integer(), nullable=True, server_default="0"),
        sa.Column("food_score", sa.Integer(), nullable=True, server_default="0"),
        sa.Column("shopping_score", sa.Integer(), nullable=True, server_default="0"),
        sa.Column("nature_score", sa.Integer(), nullable=True, server_default="0"),
        sa.Column("historical_score", sa.Integer(), nullable=True, server_default="0"),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("image_url", sa.String(length=300), nullable=False),
    )

    op.create_table(
        "budget_rates",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("tier", sa.String(length=20), nullable=False),
        sa.Column("hotel_per_day", sa.Integer(), nullable=False),
        sa.Column("food_per_day", sa.Integer(), nullable=False),
        sa.Column("transport_per_day", sa.Integer(), nullable=False),
        sa.Column("activities_per_day", sa.Integer(), nullable=False),
        sa.UniqueConstraint("tier"),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=150), nullable=True),
        sa.Column("hobbies", sa.String(length=300), nullable=True),
        sa.Column("home_city", sa.String(length=100), nullable=True),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("username"),
    )

    op.create_table(
        "trips",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("trip_name", sa.String(length=150), nullable=False),
        sa.Column("destination", sa.String(length=100), nullable=False),
        sa.Column("budget_tier", sa.String(length=20), nullable=False),
        sa.Column("days", sa.Integer(), nullable=False),
        sa.Column("traveler_name", sa.String(length=100), nullable=True),
        sa.Column("itinerary_json", sa.Text(), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("trips")
    op.drop_table("users")
    op.drop_table("budget_rates")
    op.drop_table("destinations")
