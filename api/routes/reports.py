from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Report, Scan, User
from ..auth import get_current_user
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

from pydantic import BaseModel, Field

@router.get("/")
def list_reports(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    q = db.query(Report, Scan).join(Scan, Report.scan_id == Scan.id)
    if user.role != "admin":
        q = q.filter(Scan.user_id == user.id)
    rows = q.order_by(Report.created_at.desc()).limit(50).all()
    return [{"id": r.id, "scan_id": r.scan_id, "url": s.url, "mode": s.mode,
             "target_type": s.target_type, "status": r.status,
             "created_at": r.created_at, "score": s.score} for r, s in rows]

class StatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(active|deleted|purchased)$")

@router.patch("/{report_id}/status")
def update_status(report_id: str, data: StatusUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rep = db.query(Report).filter(Report.id == report_id).first()
    if not rep: raise HTTPException(404, "Report not found")
    
    # Simple check: only admin can change status? Or user owns it?
    scan = db.query(Scan).filter(Scan.id == rep.scan_id).first()
    if user.role != "admin" and scan.user_id != user.id:
        raise HTTPException(403, "Not authorized to modify this report")
        
    rep.status = data.status
    db.commit()
    db.refresh(rep)
    return {"message": "Status updated successfully", "id": rep.id, "status": rep.status}

@router.delete("/{report_id}")
def delete_report(report_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rep = db.query(Report).filter(Report.id == report_id).first()
    if not rep: raise HTTPException(404, "Report not found")
    db.delete(rep)
    db.commit()
    return {"message": "Report physically deleted from database"}

@router.get("/{report_id}/pdf")
def download_pdf(report_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rep = db.query(Report).filter(Report.id == report_id).first()
    if not rep or not rep.pdf_path: raise HTTPException(404, "PDF not found")
    return FileResponse(rep.pdf_path, media_type="application/pdf",
                        filename=f"nexusqa-report-{report_id}.pdf")

@router.get("/{report_id}/csv")
def download_csv(report_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rep = db.query(Report).filter(Report.id == report_id).first()
    if not rep or not rep.csv_path: raise HTTPException(404, "CSV not found")
    return FileResponse(rep.csv_path, media_type="text/csv",
                        filename=f"nexusqa-report-{report_id}.csv")
