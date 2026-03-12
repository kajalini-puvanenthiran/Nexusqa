import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
from .models import Base
from .routes import auth, scans, reports, users, seo, debug, jira, search, settings, automation

# Create all DB tables (if not using Alembic currently)
try:
    print("[INIT] Creating database schema...", flush=True)
    from .models import SystemConfig
    Base.metadata.create_all(bind=engine)
    print("[INIT] Schema verified/created successfully.", flush=True)
except Exception as e:
    print(f"[INIT ERROR] {e}", flush=True)

# Seed default admin user and user-provided admin
from .database import SessionLocal
from .models import User, UserRole, SystemConfig
from .auth import hash_password

def seed_db():
    print("[SEED] Starting database seeding...", flush=True)
    db = SessionLocal()
    try:
        # Default Admin
        admin = db.query(User).filter(User.email == "admin@nexusqa.com").first()
        if not admin:
            print("[SEED] Creating default admin user: admin@nexusqa.com", flush=True)
            new_admin = User(
                full_name="NEXUS Admin",
                email="admin@nexusqa.com",
                hashed_pw=hash_password("nexusqa_admin"),
                role=UserRole.admin
            )
            db.add(new_admin)

        # User-requested Admin (from credentials provided)
        admin_emails = ["kajip1998@gmail.com"]
        for email in admin_emails:
            user = db.query(User).filter(User.email == email).first()
            if not user:
                print(f"[SEED] Initializing root admin: {email}", flush=True)
                user = User(
                    full_name="Kaji Puvanenthiran",
                    email=email,
                    hashed_pw=hash_password("kajiP@2026"),
                    role=UserRole.admin
                )
                db.add(user)
            else:
                # Ensure existing user is admin and has correct password
                print(f"[SEED] Root admin validated: {email}", flush=True)
                user.role = UserRole.admin
                user.hashed_pw = hash_password("kajiP@2026")
        
        # Seed System Config
        conf = db.query(SystemConfig).first()
        if not conf:
            print("[SEED] Initializing default system configuration: Clustersco", flush=True)
            conf = SystemConfig(
                id=1,
                company_name="Clustersco",
                hq_location="Colombo 01, Sri Lanka",
                timezone="IST / GMT+5:30 (Sri Lanka)",
                operational_site="Ai Agent",
                contact_email="kajalini.p@clustersco.com",
                support_phone="+94 70 440 2829",
                industry="Enterprise Solutions",
                theme_settings={
                    "primary_color": "#00e5ff",
                    "secondary_color": "#0044ff",
                    "text_color": "#ffffff",
                    "icon_color": "#00e5ff",
                    "font_family": "'Inter', sans-serif",
                    "button_color": "#00e5ff",
                    "sidebar_bg": "#070f1a"
                }
            )
            db.add(conf)
        else:
            # Update existing record to match request
            conf.company_name = "Clustersco"
            conf.hq_location = "Colombo, Sri Lanka"
            conf.timezone = "IST / GMT+5:30 (Sri Lanka)"
            conf.operational_site = "ERP"
            conf.contact_email = "contact@clustersco.com"
            conf.support_phone = "+94 11 123 4567"
            conf.industry = "Enterprise Solutions"
            if not conf.theme_settings:
                conf.theme_settings = {
                    "primary_color": "#00e5ff",
                    "secondary_color": "#0044ff",
                    "text_color": "#ffffff",
                    "icon_color": "#00e5ff",
                    "font_family": "'Inter', sans-serif",
                    "button_color": "#00e5ff",
                    "sidebar_bg": "#070f1a"
                }

        db.commit()
    except Exception as e:
        print(f"[SEED ERROR] {e}", flush=True)
        db.rollback()
    finally:
        db.close()

seed_db()

app = FastAPI(
    title="NEXUS QA API",
    description="Autonomous Intelligence Testing Backend + Dashboard integration",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8001",
        "http://[::1]:3000",
        "http://[::1]:5173",
        "http://[::1]:8001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,    prefix="/auth",    tags=["Auth"])
app.include_router(scans.router,   prefix="/scans",   tags=["Scans"])
app.include_router(automation.router, prefix="/automation", tags=["Automation"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(users.router,   prefix="/users",   tags=["Users Management"])
app.include_router(seo.router,     prefix="/seo",     tags=["SEO Engine"])
app.include_router(debug.router,   prefix="/debug",   tags=["Auto Debug & Fix"])
app.include_router(jira.router,    prefix="/jira",    tags=["JIRA Automation"])
app.include_router(search.router,  prefix="/search",  tags=["Intelligence Search"])
app.include_router(settings.router,prefix="/settings",tags=["System Configuration"])

@app.get("/")
def health_check():
    return {"status": "ok", "service": "nexus_qa_api"}
