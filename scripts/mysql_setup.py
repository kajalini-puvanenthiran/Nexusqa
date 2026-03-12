import os, sys, pymysql
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Path to .env
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "nexusqa")

def ensure_mysql():
    print(f"Checking MySQL on {DB_HOST}:{DB_PORT}")
    try:
        # Connect without DB to create it
        conn = pymysql.connect(host=DB_HOST, port=DB_PORT, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()
        cur.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        cur.close()
        conn.close()
        print(f"Database '{DB_NAME}' ensured")
    except Exception as e:
        print(f"Could not connect to MySQL: {e}")
        print(f"   Please ensure MySQL is running in XAMPP on port {DB_PORT}")
        return False
    return True

def init_tables():
    # Insert project root for imports
    sys.path.insert(0, os.path.dirname(__file__))
    from api.models import Base
    from api.database import engine
    
    print("Initializing MySQL tables")
    try:
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully")
    except Exception as e:
        print(f"Table creation failed: {e}")
        return False
    return True

def seed_root_admin():
    from api.database import SessionLocal
    from api.models import User, UserRole
    from api.auth import hash_password
    
    db = SessionLocal()
    try:
        # Check if user exists
        exists = db.query(User).filter(User.email == "kajip1998@gmail.com").first()
        if not exists:
            user = User(
                full_name="Kaji Puvanenthiran",
                email="kajip1998@gmail.com",
                hashed_pw=hash_password("kajiP@2026"),
                role=UserRole.admin,
                is_active=True
            )
            db.add(user)
            db.commit()
            print("Created root admin: kajip1998@gmail.com")
        else:
            print("Root admin already exists.")
    finally:
        db.close()

if __name__ == "__main__":
    if ensure_mysql():
        if init_tables():
            seed_root_admin()
            print("\n MySQL Migration Complete!")
            print("---------------------------")
            print(f"Host: {DB_HOST}")
            print(f"Port: {DB_PORT}")
            print(f"User: {DB_USER}")
            print(f"Pass: (empty)")
            print(f"DB  : {DB_NAME}")
    else:
        sys.exit(1)
