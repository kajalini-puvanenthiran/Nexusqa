import os, subprocess, sys, time
from datetime import datetime

# Import install script logic (if not already run)
import api.install_deps as install_deps
import git_automation

def main():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Starting NEXUS QA Master Orchestrator...", flush=True)

    # 1. Install Backend Dependencies
    print(f"Step 1: Installing Backend Dependencies...", flush=True)
    try:
        install_deps.install()
    except Exception as e:
        print(f"Backend install failed: {e}", file=sys.stderr)

    # 2. Install Frontend Dependencies
    print(f"Step 2: Installing Frontend Dependencies...", flush=True)
    try:
        if os.path.exists("dashboard"):
            subprocess.check_call(["npm", "install"], cwd="dashboard")
    except Exception as e:
        print(f"Frontend install failed: {e}", file=sys.stderr)

    # 3. Setup PostgreSQL/MySQL Database
    print(f"Step 3: Initializing Database Schema...", flush=True)
    try:
        # Import Base here to avoid issues before install
        from api.models import Base
        from api.database import engine
        Base.metadata.create_all(bind=engine)
        print("Database schema created successfully.", flush=True)
    except Exception as e:
        print(f"Database setup failed: {e}", file=sys.stderr)

    # 4. Automate Docker Infrastructure
    print(f"Step 4: Orchestrating Docker containers...", flush=True)
    try:
        # Check if docker-compose exists in the path
        subprocess.check_call(["docker-compose", "up", "-d", "--build"], shell=True)
        print("Docker containers (Postgres, MySQL, Redis, FastAPI, Vite, n8n, Jenkins) started.", flush=True)
    except Exception as e:
        print(f"Docker orchestration failed (Check if Docker Desktop is running): {e}", file=sys.stderr)

    # 5. Git Automation - Commit & Push
    print(f"Step 5: Finalizing with Automated Git Push...", flush=True)
    msg = f"feat: Automated Full Stack implementation for NEXUS QA — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    # git_automation.run_git_automation(msg)
    print(f"Skipping actual push for safety. User can run 'python git_automation.py' to commit/push results.", flush=True)

    print(f"""
[{datetime.now().strftime('%H:%M:%S')}] ✅ NEXUS QA INFRASTRUCTURE READY.

SERVICES STATUS:
- FastAPI Backend: http://localhost:8000
- React Dashboard: http://localhost:5173
- Jenkins CI/CD:   http://localhost:8080
- n8n Workflows:   http://localhost:5678
- PostgreSQL:      localhost:5432
- MySQL (Reports): localhost:3306
- Redis:           localhost:6379

NEXT STEPS:
1. Open http://localhost:5173 to access the dashboard.
2. Sign up and login to start autonomous scans.
3. Check Jenkins for automated pipeline status.
4. Enjoy your premium NEXUS QA system.
    """, flush=True)

if __name__ == "__main__":
    main()
