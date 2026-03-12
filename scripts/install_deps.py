import subprocess, sys

PACKAGES = [
    "fastapi", "uvicorn[standard]", "sqlalchemy", "alembic",
    "asyncpg", "psycopg2-binary", "python-jose[cryptography]",
    "passlib[bcrypt]", "python-multipart", "python-dotenv",
    "reportlab", "aiosmtplib", "celery", "redis",
    "anthropic", "httpx", "pydantic[email]",
]

def install():
    print("Installing backend dependencies...", flush=True)
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet"] + PACKAGES)
    print("All packages installed.", flush=True)

if __name__ == "__main__":
    install()
