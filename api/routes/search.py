from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db
from ..models import User, Scan, Report
from typing import List, Dict

router = APIRouter()

@router.get("/")
def global_search(q: str = Query(...), db: Session = Depends(get_db)):
    """A cross-entity intelligence search through Users, Scans, and Reports."""
    query_str = f"%{q}%"
    
    # 1. Search Users
    users = db.query(User).filter(
        or_(User.full_name.ilike(query_str), User.email.ilike(query_str))
    ).limit(5).all()
    
    # 2. Search Scans
    scans = db.query(Scan).filter(
        or_(Scan.url.ilike(query_str), Scan.target_type.ilike(query_str))
    ).order_by(Scan.created_at.desc()).limit(10).all()
    
    # 3. Reports are tied to scans, so typically we search the scan-part for report-related items
    
    results = []
    
    for u in users:
        results.append({
            "type": "USER",
            "title": u.full_name,
            "subtitle": u.email,
            "id": u.id,
            "link": "users", # maps to setActive('users') in frontend
            "icon": "👤"
        })
        
    for s in scans:
        results.append({
            "type": s.target_type.upper(),
            "title": s.url,
            "subtitle": f"Scan Mode: {s.mode.upper()} · {s.created_at.strftime('%Y-%m-%d')}",
            "id": s.id,
            "link": "reports", # usually take them to see reports of this scan or reports hub
            "icon": "📡" if s.target_type == "website" else "🖥️"
        })
        
    return results
    
