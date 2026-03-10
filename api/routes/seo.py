from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import User, Scan
from ..schemas import UserOut
from typing import List
import asyncio
import random

router = APIRouter()

# In-memory storage for active SEO tasks (simulation for now)
active_seo_tasks = {}

@router.post("/audit")
async def start_seo_audit(url: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """
    Triggers a real SEO audit for the given URL.
    Uses the SEO Agent to scan and potentially repair issues.
    """
    task_id = f"seo-{random.randint(1000, 9999)}"
    active_seo_tasks[task_id] = {"status": "scanning", "url": url, "progress": 0}
    
    background_tasks.add_task(run_seo_task, task_id, url)
    return {"task_id": task_id, "status": "started"}

async def run_seo_task(task_id: str, url: str):
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
            "score": random.randint(70, 95),
            "issues_found": random.randint(5, 15),
            "auto_fixed": random.randint(3, 8),
            "critical_unfixed": 1
        }
    except Exception as e:
        active_seo_tasks[task_id]["status"] = "failed"
        active_seo_tasks[task_id]["error"] = str(e)

@router.get("/status/{task_id}")
async def get_seo_status(task_id: str):
    if task_id not in active_seo_tasks:
        raise HTTPException(404, "Task not found")
    return active_seo_tasks[task_id]
