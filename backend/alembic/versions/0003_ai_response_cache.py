"""add ai_response_cache table

Revision ID: 0003
Revises: 0002
Create Date: 2026-07-18

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "ai_response_cache",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("feature", sa.String(length=50), nullable=False),
        sa.Column("cache_key", sa.String(length=64), nullable=False),
        sa.Column("fallback_key", sa.String(length=200), nullable=False),
        sa.Column("response_json", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("cache_key"),
    )
    op.create_index(
        "ix_ai_response_cache_fallback_key", "ai_response_cache", ["feature", "fallback_key"]
    )


def downgrade() -> None:
    op.drop_index("ix_ai_response_cache_fallback_key", table_name="ai_response_cache")
    op.drop_table("ai_response_cache")
