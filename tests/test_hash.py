from passlib.context import CryptContext
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
try:
    h = pwd_ctx.hash("kajiP@2026")
    print(f"Hash: {h}")
except Exception as e:
    print(f"Error: {e}")
