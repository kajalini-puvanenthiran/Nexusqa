from api.database import SessionLocal
from api.models import User, UserRole

db = SessionLocal()
try:
    users = db.query(User).all()
    print("--- Database Users ---")
    for u in users:
        print(f"Email: {u.email}, Role: {u.role}, Active: {u.is_active}")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
