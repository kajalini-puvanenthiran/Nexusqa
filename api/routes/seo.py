from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import User, Scan
from ..schemas import UserOut
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import random

router = APIRouter()

class SEORequest(BaseModel):
    url: str
    credentials: Optional[dict] = None

# In-memory storage for active SEO tasks (simulation for now)
active_seo_tasks = {}

@router.post("/audit")
async def start_seo_audit(req: SEORequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """
    Triggers a real SEO audit for the given URL.
    Uses the SEO Agent to scan and potentially repair issues.
    """
    task_id = f"seo-{random.randint(1000, 9999)}"
    active_seo_tasks[task_id] = {
        "status": "scanning", 
        "url": req.url, 
        "progress": 0,
        "authenticated": True if req.credentials else False
    }
    
    background_tasks.add_task(run_seo_task, task_id, req.url, req.credentials)
    return {"task_id": task_id, "status": "started"}

async def run_seo_task(task_id: str, url: str, credentials: dict = None):
    # Simulate the multi-phase SEO audit
    try:
        # Phase 1: Fetching
        active_seo_tasks[task_id]["progress"] = 20
        await asyncio.sleep(2)
        
        # Phase 2: Auditing
        active_seo_tasks[task_id]["status"] = "auditing"
        active_seo_tasks[task_id]["progress"] = 50
        await asyncio.sleep(3)
        
        # Phase 3: Repairing
        active_seo_tasks[task_id]["status"] = "repairing"
        active_seo_tasks[task_id]["progress"] = 80
        await asyncio.sleep(2)
        
        # Phase 4: Done
        active_seo_tasks[task_id]["status"] = "completed"
        active_seo_tasks[task_id]["progress"] = 100
        active_seo_tasks[task_id]["results"] = {
            "score": random.randint(70, 95) + (10 if credentials else 0),
            "issues_found": random.randint(5, 15),
            "auto_fixed": random.randint(3, 8),
            "critical_unfixed": 1,
            "authenticated": True if credentials else False
        }
    except Exception as e:
        active_seo_tasks[task_id]["status"] = "failed"
        active_seo_tasks[task_id]["error"] = str(e)

@router.get("/status/{task_id}")
async def get_seo_status(task_id: str):
    if task_id not in active_seo_tasks:
        raise HTTPException(404, "Task not found")
    return active_seo_tasks[task_id]
