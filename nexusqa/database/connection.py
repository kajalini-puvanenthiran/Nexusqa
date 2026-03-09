"""
NEXUS QA — Database Engine & Session Management
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# ── Connection URL ────────────────────────────────────────────
# Uses PostgreSQL if DATABASE_URL is set in .env, otherwise SQLite
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./nexusqa.db"   # fallback: local SQLite file
)

# ── Engine setup ─────────────────────────────────────────────
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        echo=False,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency for FastAPI — yields a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables if they don't exist."""
    from nexusqa.database.models import Base
    Base.metadata.create_all(bind=engine)
    print(f"  ✅ Database initialized: {DATABASE_URL}")


def drop_all():
    """Drop all tables — USE WITH CAUTION."""
    from nexusqa.database.models import Base
    Base.metadata.drop_all(bind=engine)
    print("  ⚠️  All tables dropped.")


def health_check() -> bool:
    """Test database connection."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"  ❌ DB health check failed: {e}")
        return False
