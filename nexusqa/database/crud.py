"""
NEXUS QA — Database CRUD Operations
"""

from datetime import datetime
from sqlalchemy.orm import Session
from nexusqa.database.models import (
    Scan, Finding, JiraTicket, SeoFix, Report, AgentRun, Project
)


# ── PROJECT CRUD ─────────────────────────────────────────────
def create_project(db: Session, name: str, base_url: str, description: str = "", jira_key: str = "") -> Project:
    project = Project(name=name, base_url=base_url, description=description, jira_key=jira_key)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_project(db: Session, project_id: int) -> Project:
    return db.query(Project).filter(Project.id == project_id).first()


# ── SCAN CRUD ─────────────────────────────────────────────────
def create_scan(db: Session, job_id: str, target_url: str, scan_mode: str = "full", config: dict = None) -> Scan:
    scan = Scan(job_id=job_id, target_url=target_url, scan_mode=scan_mode, config=config or {})
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return scan


def get_scan(db: Session, job_id: str) -> Scan:
    return db.query(Scan).filter(Scan.job_id == job_id).first()


def update_scan_status(db: Session, job_id: str, status: str, **kwargs) -> Scan:
    scan = get_scan(db, job_id)
    if scan:
        scan.status = status
        if status == "complete":
            scan.completed_at = datetime.utcnow()
        for k, v in kwargs.items():
            setattr(scan, k, v)
        db.commit()
        db.refresh(scan)
    return scan


def list_scans(db: Session, limit: int = 50) -> list:
    return db.query(Scan).order_by(Scan.created_at.desc()).limit(limit).all()


# ── FINDING CRUD ─────────────────────────────────────────────
def create_finding(db: Session, scan_id: int, category: str, title: str,
                   severity: str, evidence: str = "", recommendation: str = "",
                   url: str = "", auto_fixed: bool = False, **kwargs) -> Finding:
    finding = Finding(
        scan_id=scan_id, category=category, title=title,
        severity=severity, evidence=evidence,
        recommendation=recommendation, url=url,
        auto_fixed=auto_fixed, **kwargs
    )
    db.add(finding)
    db.commit()
    db.refresh(finding)
    return finding


def get_findings_by_scan(db: Session, scan_id: int) -> list:
    return db.query(Finding).filter(Finding.scan_id == scan_id).all()


def get_findings_by_severity(db: Session, scan_id: int, severity: str) -> list:
    return db.query(Finding).filter(Finding.scan_id == scan_id, Finding.severity == severity).all()


# ── JIRA TICKET CRUD ─────────────────────────────────────────
def create_jira_record(db: Session, finding_id: int, scan_id: int, ticket_id: str, ticket_url: str = "", issue_type: str = "Bug") -> JiraTicket:
    ticket = JiraTicket(finding_id=finding_id, scan_id=scan_id, ticket_id=ticket_id, ticket_url=ticket_url, issue_type=issue_type)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


# ── SEO FIX CRUD ─────────────────────────────────────────────
def create_seo_fix(db: Session, finding_id: int, scan_id: int, fix_type: str, url: str, old_value: str = "", new_value: str = "", applied: bool = False) -> SeoFix:
    seo_fix = SeoFix(finding_id=finding_id, scan_id=scan_id, fix_type=fix_type, url=url, old_value=old_value, new_value=new_value, applied=applied)
    db.add(seo_fix)
    db.commit()
    db.refresh(seo_fix)
    return seo_fix


# ── REPORT CRUD ──────────────────────────────────────────────
def create_report(db: Session, scan_id: int, format: str, content: str = "", file_path: str = "") -> Report:
    report = Report(scan_id=scan_id, format=format, content=content, file_path=file_path, size_bytes=len(content))
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


# ── AGENT RUN CRUD ───────────────────────────────────────────
def create_agent_run(db: Session, scan_id: int, agent_name: str, model_used: str = "") -> AgentRun:
    run = AgentRun(scan_id=scan_id, agent_name=agent_name, model_used=model_used)
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


def complete_agent_run(db: Session, run_id: int, status: str = "complete", tool_calls: int = 0, findings_found: int = 0, token_input: int = 0, token_output: int = 0, duration_secs: float = 0.0, error: str = "") -> AgentRun:
    run = db.query(AgentRun).filter(AgentRun.id == run_id).first()
    if run:
        run.status = status
        run.tool_calls = tool_calls
        run.findings_found = findings_found
        run.token_input = token_input
        run.token_output = token_output
        run.duration_secs = duration_secs
        run.error = error
        run.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(run)
    return run
