#!/usr/bin/env python3
"""
NEXUS QA — Database Setup, Migration & Backup Script
======================================================
Automatically installs missing packages, creates all tables,
seeds sample data, and creates a backup.

Usage:
    python db_setup.py              # Create DB + seed + backup
    python db_setup.py --reset      # Drop all + recreate + seed
    python db_setup.py --backup     # Backup only
    python db_setup.py --check      # Health check only
"""

import sys
import os
import subprocess
import argparse
from datetime import datetime

# ── AUTO-INSTALL any missing packages ─────────────────────────
REQUIRED_PACKAGES = {
    "sqlalchemy":  "SQLAlchemy>=2.0.0",
    "alembic":     "alembic",
    "dotenv":      "python-dotenv",
    "aiosqlite":   "aiosqlite",
}

def ensure_packages():
    for import_name, pkg_name in REQUIRED_PACKAGES.items():
        try:
            __import__(import_name)
        except ImportError:
            print(f"  📦 Installing missing package: {pkg_name}...")
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", pkg_name, "--quiet"],
                stdout=subprocess.DEVNULL,
            )
            print(f"  ✅ Installed: {pkg_name}")

ensure_packages()

# ── Now safe to import ────────────────────────────────────────
import json
import shutil
import sqlite3
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# Prepend project root so nexusqa package is found
sys.path.insert(0, os.path.dirname(__file__))

from nexusqa.database.connection import engine, SessionLocal, init_db, drop_all, health_check
from nexusqa.database.crud import (
    create_project, create_scan, create_finding,
    create_jira_record, create_seo_fix, create_report,
    create_agent_run, complete_agent_run, update_scan_status,
)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nexusqa.db")
BACKUP_DIR   = os.path.join(os.path.dirname(__file__), "backups")

os.makedirs(BACKUP_DIR, exist_ok=True)
os.makedirs(os.path.join(os.path.dirname(__file__), "logs"), exist_ok=True)
os.makedirs(os.path.join(os.path.dirname(__file__), "reports"), exist_ok=True)


# ─────────────────────────────────────────────────────────────
# SEED DATA
# ─────────────────────────────────────────────────────────────
def seed_sample_data(db):
    print("\n  🌱 Seeding sample data...")

    # ── Project ──────────────────────────────────────────────
    project = create_project(
        db,
        name="Sample Web App",
        base_url="https://example.com",
        description="Demo project for NEXUS QA",
        jira_key="NEXUSQA",
    )
    print(f"     ✅ Project created: {project.name} (ID: {project.id})")

    # ── Scan ─────────────────────────────────────────────────
    from nexusqa.database.crud import get_scan
    existing = get_scan(db, "demo-scan-001")
    if existing:
        print("     ⏭️  Demo scan already exists — skipping seed.")
        return existing
    scan = create_scan(
        db,
        job_id="demo-scan-001",
        target_url="https://example.com",
        scan_mode="full",
        config={"enable_computer_use": True, "enable_extended_thinking": False}
    )
    scan.project_id = project.id
    db.commit()
    print(f"     ✅ Scan created: {scan.job_id} (ID: {scan.id})")

    # ── Agent Runs ───────────────────────────────────────────
    for agent_name, model in [
        ("ui_agent",          "claude-opus-4-5"),
        ("security_agent",    "claude-opus-4-5"),
        ("performance_agent", "claude-sonnet-4-5"),
        ("seo_agent",         "claude-haiku-4-5"),
        ("accessibility_agent","claude-sonnet-4-5"),
    ]:
        run = create_agent_run(db, scan.id, agent_name, model)
        complete_agent_run(db, run.id, status="complete", tool_calls=3, findings_found=1, token_input=800, token_output=400, duration_secs=4.5)
    print(f"     ✅ 5 agent runs seeded")

    # ── Findings ─────────────────────────────────────────────
    sample_findings = [
        {
            "category": "security",
            "title": "Missing X-Frame-Options Security Header",
            "severity": "Medium",
            "evidence": "HTTP response does not include X-Frame-Options header, enabling clickjacking attacks.",
            "recommendation": "Add response header: X-Frame-Options: SAMEORIGIN",
            "url": "https://example.com",
        },
        {
            "category": "seo",
            "title": "Missing Meta Description on Homepage",
            "severity": "High",
            "evidence": "The homepage has no <meta name='description'> tag. This reduces CTR in search results.",
            "recommendation": "Add a compelling 150-160 character meta description targeting primary keywords.",
            "url": "https://example.com",
            "auto_fixed": True,
            "fix_content": "<meta name='description' content='Example — The best platform for demos and testing. Try for free today.'>",
        },
        {
            "category": "performance",
            "title": "Largest Contentful Paint (LCP) > 2.5s",
            "severity": "High",
            "evidence": "LCP measured at 3.2s (threshold: 2.5s). Main hero image is unoptimized (2.4MB PNG).",
            "recommendation": "Convert hero image to WebP, add loading='lazy' to off-screen images, preload critical assets.",
            "url": "https://example.com",
        },
        {
            "category": "accessibility",
            "title": "Color Contrast Ratio Below WCAG AA (3.2:1 vs 4.5:1 required)",
            "severity": "High",
            "evidence": "Nav link text (#aaa on #fff) has contrast ratio of 3.2:1. WCAG 2.1 AA requires 4.5:1.",
            "recommendation": "Change nav link color to #767676 or darker for WCAG AA compliance.",
            "url": "https://example.com",
            "wcag_level": "AA",
        },
        {
            "category": "ui",
            "title": "Contact Form Submit Button Does Nothing on Mobile",
            "severity": "Critical",
            "evidence": "Tapping 'Submit' on iPhone 14 (iOS 17, Safari) does not submit form. Console error: Cannot read properties of null (reading 'addEventListener').",
            "recommendation": "Wrap event listener code in DOMContentLoaded. Ensure IDs match between HTML and JS.",
            "url": "https://example.com/contact",
        },
        {
            "category": "seo",
            "title": "4 Images Missing Alt Text",
            "severity": "Medium",
            "evidence": "4 <img> tags have empty or missing alt attributes on the /about page.",
            "recommendation": "Add descriptive, keyword-aware alt text to all images.",
            "url": "https://example.com/about",
            "auto_fixed": True,
        },
    ]

    created_findings = []
    for f in sample_findings:
        finding = create_finding(db, scan_id=scan.id, **f)
        created_findings.append(finding)
    print(f"     ✅ {len(created_findings)} findings seeded")

    # ── JIRA Tickets for High/Critical ───────────────────────
    jira_targets = [(f, i) for i, f in enumerate(created_findings) if f.severity in ("Critical", "High")]
    for finding, idx in jira_targets:
        create_jira_record(
            db,
            finding_id=finding.id,
            scan_id=scan.id,
            ticket_id=f"NEXUSQA-{100 + idx}",
            ticket_url=f"https://clustersco.atlassian.net/browse/NEXUSQA-{100 + idx}",
            issue_type="Bug",
        )
    print(f"     ✅ {len(jira_targets)} JIRA tickets seeded")

    # ── SEO Fixes ────────────────────────────────────────────
    seo_findings = [f for f in created_findings if f.auto_fixed]
    for finding in seo_findings:
        create_seo_fix(
            db,
            finding_id=finding.id,
            scan_id=scan.id,
            fix_type="meta_desc" if "Meta" in finding.title else "alt_text",
            url=finding.url or "https://example.com",
            old_value="(missing)",
            new_value=finding.fix_content or "auto-generated",
            applied=True,
        )
    print(f"     ✅ {len(seo_findings)} SEO fixes seeded")

    # ── Sample Report ─────────────────────────────────────────
    report_content = json.dumps({
        "scan_id": scan.job_id,
        "target": scan.target_url,
        "total_findings": len(created_findings),
        "critical": 1, "high": 3, "medium": 2, "low": 0,
        "auto_fixed": 2,
        "jira_tickets": [f"NEXUSQA-{100+i}" for i in range(len(jira_targets))],
        "generated_at": datetime.utcnow().isoformat(),
    }, indent=2)
    create_report(db, scan_id=scan.id, format="json", content=report_content)
    print(f"     ✅ Sample JSON report seeded")

    # Update scan summary
    update_scan_status(
        db, scan.job_id, "complete",
        total_findings=len(created_findings),
        critical_count=1, high_count=3, medium_count=2,
        auto_fixed_count=2, duration_seconds=47.3,
    )

    print("\n  ✅ Sample data seeding complete!\n")
    return scan


# ─────────────────────────────────────────────────────────────
# BACKUP
# ─────────────────────────────────────────────────────────────
def create_backup():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    if DATABASE_URL.startswith("sqlite"):
        # SQLite — copy the .db file
        db_path = DATABASE_URL.replace("sqlite:///", "").replace("./", "")
        db_path = os.path.join(os.path.dirname(__file__), db_path.lstrip("./"))

        if not os.path.exists(db_path):
            print("  ⚠️  No SQLite database file found to backup.")
            return None

        backup_path = os.path.join(BACKUP_DIR, f"nexusqa_backup_{timestamp}.db")
        shutil.copy2(db_path, backup_path)
        print(f"\n  💾 SQLite Backup created: {backup_path}")

        # Also export as SQL dump
        sql_backup = os.path.join(BACKUP_DIR, f"nexusqa_backup_{timestamp}.sql")
        conn = sqlite3.connect(db_path)
        with open(sql_backup, "w") as f:
            for line in conn.iterdump():
                f.write(f"{line}\n")
        conn.close()
        print(f"  💾 SQL Dump created:      {sql_backup}")
        return backup_path

    else:
        # PostgreSQL pg_dump
        try:
            backup_path = os.path.join(BACKUP_DIR, f"nexusqa_backup_{timestamp}.sql")
            result = subprocess.run(
                ["pg_dump", DATABASE_URL, "-f", backup_path],
                capture_output=True, text=True
            )
            if result.returncode == 0:
                print(f"\n  💾 PostgreSQL Backup created: {backup_path}")
                return backup_path
            else:
                print(f"  ❌ pg_dump failed: {result.stderr}")
                return None
        except FileNotFoundError:
            print("  ⚠️  pg_dump not found. Install PostgreSQL client tools for server backups.")
            return None


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="NEXUS QA Database Setup & Backup")
    parser.add_argument("--reset",  action="store_true", help="Drop all tables and recreate from scratch")
    parser.add_argument("--backup", action="store_true", help="Backup only (no create/seed)")
    parser.add_argument("--check",  action="store_true", help="Database health check only")
    args = parser.parse_args()

    print("\n" + "="*60)
    print("  🗄️  NEXUS QA — Database Setup")
    print("="*60)
    print(f"  DB URL : {DATABASE_URL}")
    print(f"  Backup : {BACKUP_DIR}")

    # ── Health Check ─────────────────────────────────────────
    if args.check:
        print("\n  🔍 Running health check...")
        ok = health_check()
        print(f"  {'✅ Database OK' if ok else '❌ Database FAILED'}")
        return

    # ── Backup only ──────────────────────────────────────────
    if args.backup:
        create_backup()
        return

    # ── Reset ────────────────────────────────────────────────
    if args.reset:
        print("\n  ⚠️  Resetting database (dropping all tables)...")
        drop_all()

    # ── Create tables ─────────────────────────────────────────
    print("\n  🔨 Creating database tables...")
    init_db()

    # ── Seed data ─────────────────────────────────────────────
    db = SessionLocal()
    try:
        seed_sample_data(db)
    finally:
        db.close()

    # ── Health check ─────────────────────────────────────────
    print("  🔍 Running health check...")
    health_check()

    # ── Auto backup after creation ────────────────────────────
    print("  💾 Creating initial backup...")
    create_backup()

    # ── Summary ──────────────────────────────────────────────
    print("\n" + "="*60)
    print("  ✅ Database Setup Complete!")
    print("="*60)
    print(f"  Tables   : 7 tables created")
    print(f"  Seed data: 1 project, 1 scan, 5 agents, 6 findings")
    print(f"  Backup   : {BACKUP_DIR}")
    print(f"\n  Commands:")
    print(f"    python db_setup.py --check   → health check")
    print(f"    python db_setup.py --backup  → backup now")
    print(f"    python db_setup.py --reset   → wipe + recreate")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
