import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL       = os.getenv("DATABASE_URL",       "mysql+pymysql://root@localhost:3306/nexusqa")
DATABASE_URL_ASYNC = os.getenv("DATABASE_URL_ASYNC", "mysql+aiomysql://root@localhost:3306/nexusqa")

# Sync engine (for Alembic / setup)
engine      = create_engine(DATABASE_URL)
SessionLocal= sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Async engine (for FastAPI endpoints)
async_engine  = create_async_engine(DATABASE_URL_ASYNC, echo=False)
AsyncSessionLocal = sessionmaker(bind=async_engine, class_=AsyncSession, expire_on_commit=False)

def get_db():
    db = SessionLocal()
    try:    yield db
    finally: db.close()

async def get_async_db():
    async with AsyncSessionLocal() as s: yield s
