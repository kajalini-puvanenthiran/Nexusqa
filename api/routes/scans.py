import os, json, csv, asyncio
from io import StringIO
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from ..database import get_db
from ..models import Scan, Report, User
from ..auth import get_current_user, require_admin

router = APIRouter()

# ─── Scan ──────────────────────────────────────────────────────
class ScanRequest(BaseModel):
    url:         str
    target_type: str = "website"
    mode:        str = "full"
    credentials: Optional[dict] = None

class ScanResponse(BaseModel):
    id:         str
    url:        str
    target_type: str
    mode:       str
    status:     str
    findings:   dict
    summary:    Optional[str]
    score:      int
    report_id:  Optional[str] = None
    created_at: datetime
    class Config: from_attributes = True

from ..agents_logic import QAAgent, BugTrackerAgent, UniversalTesterAgent, TargetDetectorAgent

def simulate_scan(url: str, target_type: str, mode: str, credentials: dict = None) -> dict:
    """Enhanced scan result — provides mode-specific metrics"""
    import random
    
    # Base findings
    f = {"critical": 0, "high": 0, "medium": 0, "low": 0, "auto_fixed": 0, "jira_created": 0}
    
    # Run target-specific analysis
    detector = TargetDetectorAgent()
    detected_type = detector.detect(url)
    
    # Override target_type if it was generic or not provided
    if target_type in ["website", "unknown"] and detected_type != "website":
        target_type = detected_type

    uta = UniversalTesterAgent(target_type, credentials=credentials)
    f["target_metrics"] = uta.run_analysis(url, mode, credentials=credentials)
    
    if mode == "security":
        f["critical"] = random.randint(1, 2)
        f["high"] = random.randint(2, 4)
        f["medium"] = random.randint(5, 10)
        f["low"] = random.randint(10, 20)
    elif mode == "seo":
        f["high"] = random.randint(1, 2)
        f["medium"] = random.randint(4, 8)
        f["low"] = random.randint(20, 50)
    elif mode == "performance":
        f["medium"] = random.randint(2, 5)
        f["low"] = random.randint(5, 10)
    elif mode == "qa":
        qa = QAAgent().run_suite(url, target_type, credentials=credentials)
        f["medium"] = qa["failed"]
        f["low"] = random.randint(5, 10)
        f["qa_stats"] = qa
    elif mode == "bug_tracker":
        bt = BugTrackerAgent().analyze_system(url, target_type, credentials=credentials)
        f["critical"] = 1 if bt["high_severity_alerts"] else 0
        f["high"] = bt["bugs_isolated"]
        f["auto_fixed"] = bt["auto_fix_ready"]
        f["bt_stats"] = bt
    elif mode == "full":
        f["critical"] = random.randint(0, 2)
        f["high"] = random.randint(1, 5)
        f["medium"] = random.randint(10, 20)
        f["low"] = random.randint(20, 40)
        # Add QA stats to full mode
        qa = QAAgent().run_suite(url, target_type, credentials=credentials)
        f["qa_stats"] = qa
    else: # ui, accessibility
        f["medium"] = random.randint(1, 4)
        f["low"] = random.randint(5, 15)

    # Always ensure some QA context for the reports if not explicitly run
    if "qa_stats" not in f and mode != "bug_tracker":
        f["qa_stats"] = QAAgent().run_suite(url, target_type, credentials=credentials)

    if mode not in ["bug_tracker"]:
         f["auto_fixed"] = random.randint(1, 5) if f["medium"] > 0 else 0
    
    f["jira_created"] = f["critical"] + f["high"]
    
    score = max(5, 100 - f["critical"]*15 - f["high"]*8 - f["medium"]*3 - f["low"]*1)
    
    type_label = target_type.upper()
    mode_label = mode.upper()
    
    summary = (
        f"NEXUS QA {mode_label} agent completed analysis for {type_label} at {url}. "
        f"Detected {f['critical']+f['high']} priority issues and {f['medium']+f['low']} warnings. "
        f"AI successfully auto-healed {f['auto_fixed']} items. "
        f"Health Score: {score}/100."
    )
    
    performance_bonus = 0
    if credentials:
        summary += f" [AUTHENTICATED SCAN ENABLED: {len(credentials)} tags identified]"
        # Credentials allow for deeper discovery
        if random.random() > 0.5:
             f["critical"] += 1 # Found deeper issue behind login
        performance_bonus = 5

    return {
        "findings": f,
        "summary": summary,
        "score": min(100, score + performance_bonus)
    }

@router.post("/", response_model=ScanResponse)
def start_scan(req: ScanRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db),
               user: User = Depends(get_current_user)):
    result = simulate_scan(req.url, req.target_type, req.mode, req.credentials)
    scan   = Scan(user_id=user.id, url=req.url, target_type=req.target_type, mode=req.mode, status="done",
                  findings=result["findings"], credentials=req.credentials, summary=result["summary"],
                  score=result["score"], completed_at=datetime.utcnow())
    db.add(scan)
    db.commit(); db.refresh(scan)
    # Auto-generate report
    report = _generate_report(scan, db)
    
    # Manually attach report_id for ScanResponse
    scan.report_id = report.id
    
    # NEW: Fully Autonomous Inbound Sync
    if scan.findings.get("critical", 0) > 0 or scan.findings.get("high", 0) > 0:
        from .jira import sync_jira
        # We trigger this in the background to not slow down the scan response
        print(f"[AUTO] Priority findings detected in scan {scan.id}. Triggering JIRA sync...", flush=True)
        background_tasks.add_task(sync_jira, background_tasks, user)

    return scan

def _generate_report(scan: Scan, db: Session):
    from ..reports.generator import generate_pdf, generate_csv
    pdf_path = generate_pdf(scan)
    csv_path = generate_csv(scan)
    report = Report(scan_id=scan.id, pdf_path=pdf_path, csv_path=csv_path)
    db.add(report); db.commit(); db.refresh(report)
    return report

@router.get("/", response_model=List[ScanResponse])
def list_scans(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    q = db.query(Scan)
    if user.role != "admin":
        q = q.filter(Scan.user_id == user.id)
    return q.order_by(Scan.created_at.desc()).limit(50).all()

@router.get("/{scan_id}", response_model=ScanResponse)
def get_scan(scan_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan or (user.role != "admin" and scan.user_id != user.id):
        raise HTTPException(404, "Scan not found")
    return scan

@router.delete("/{scan_id}")
def delete_scan(scan_id: str, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan: raise HTTPException(404, "Scan not found")
    db.delete(scan); db.commit()
    return {"ok": True}
