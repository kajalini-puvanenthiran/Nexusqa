import os, sys
from dotenv import load_dotenv
from sqlalchemy import create_engine

# project root
sys.path.insert(0, os.path.dirname(__file__))

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
DATABASE_URL = os.getenv("DATABASE_URL")

from api.models import Base

def test():
    print(f"Testing metadata creation on {DATABASE_URL}...")
    try:
        engine = create_engine(DATABASE_URL)
        Base.metadata.create_all(bind=engine)
        print("Metadata created successfully")
    except Exception as e:
        print(f"Metadata creation failed: {e}")

if __name__ == "__main__":
    test()
