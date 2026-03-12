from api.database import engine, SessionLocal
from api.models import Base, User, UserRole
from api.auth import hash_password

# 1. Force Create Tables
print("Force creating tables...")
Base.metadata.create_all(bind=engine)

# 2. Force Seed
db = SessionLocal()
try:
    emails = ["kajip1998@gamil.com", "kajip1998@gmail.com", "admin@nexusqa.com"]
    for email in emails:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"Seeding {email}...")
            user = User(
                full_name="Admin",
                email=email,
                hashed_pw=hash_password("kajiP@2026" if "kajip" in email else "nexusqa_admin"),
                role=UserRole.admin
            )
            db.add(user)
        else:
            print(f"Updating {email}...")
            user.role = UserRole.admin
            user.hashed_pw = hash_password("kajiP@2026" if "kajip" in email else "nexusqa_admin")
    db.commit()
    print("Database seeding successful.")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
