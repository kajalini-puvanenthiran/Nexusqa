import subprocess, os, sys
from datetime import datetime

GITHUB_REPO = "kajalini-puvanenthiran/Nexusqa"

def run_git_automation(message: str = None):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Started NEXUS QA Git Automation...", flush=True)

    if not message:
        message = f"chore: NEXUS QA automated update — {datetime.now().strftime('%Y-%m-%d %H:%M')}"

    try:
        # Check if git is initialized
        if not os.path.exists(".git"):
            print("Initializing git repository...", flush=True)
            subprocess.check_call(["git", "init"])
            # subprocess.check_call(["git", "remote", "add", "origin", f"https://github.com/{GITHUB_REPO}.git"])

        print(f"Adding all changes to staging...", flush=True)
        subprocess.check_call(["git", "add", "."])

        print(f"Committing with message: '{message}'", flush=True)
        # Using -c to set user config if not set
        subprocess.check_call(["git", "config", "user.name", "kajalini-puvanenthiran"])
        subprocess.check_call(["git", "config", "user.email", "nexusqa-ci@company.com"])
        
        try:
            subprocess.check_call(["git", "commit", "-m", message])
        except subprocess.CalledProcessError:
            print("No changes to commit.", flush=True)
            return

        print(f"Pushing to main branch of {GITHUB_REPO}...", flush=True)
        # Assuming credentials are provided via git helper/env or SSH
        subprocess.check_call(["git", "push", "origin", "main"])

        print(f"[{datetime.now().strftime('%H:%M:%S')}] SUCCESS: Git automation complete.", flush=True)
    except Exception as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: Git automation failed: {e}", flush=True, file=sys.stderr)

if __name__ == "__main__":
    msg = sys.argv[1] if len(sys.argv) > 1 else None
    run_git_automation(msg)
