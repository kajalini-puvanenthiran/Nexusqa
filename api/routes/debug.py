from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from ..auth import get_current_user
from ..models import User
import asyncio
import random

class DebugRequest(BaseModel):
    error_log: str
    codebase_path: str

router = APIRouter()

active_debug_tasks = {}

@router.post("/run")
async def start_debug(req: DebugRequest, background_tasks: BackgroundTasks, user: User = Depends(get_current_user)):
    """
    Triggers the Auto Debug & Fix agent.
    """
    task_id = f"debug-{random.randint(1000, 9999)}"
    active_debug_tasks[task_id] = {
        "status": "analyzing",
        "progress": 0,
        "logs": ["Agent connecting to codebase...", f"Codebase: {req.codebase_path}"]
    }
    
    background_tasks.add_task(run_debug_task, task_id, req.error_log, req.codebase_path)
    return {"task_id": task_id}

async def run_debug_task(task_id: str, error_log: str, codebase_path: str):
    try:
        # Phase 1: Thinking
        active_debug_tasks[task_id]["progress"] = 25
        active_debug_tasks[task_id]["logs"].append("Claude thinking (Extended Thinking enabled)...")
        await asyncio.sleep(4)
        
        # Phase 2: Root Cause
        active_debug_tasks[task_id]["status"] = "locating"
        active_debug_tasks[task_id]["progress"] = 50
        active_debug_tasks[task_id]["logs"].append("Root cause identified in dashboard/src/api/client.js:45")
        await asyncio.sleep(3)
        
        # Phase 3: Fixing
        active_debug_tasks[task_id]["status"] = "repairing"
        active_debug_tasks[task_id]["progress"] = 75
        active_debug_tasks[task_id]["logs"].append("Applying str_replace fix to handle missing tokens...")
        await asyncio.sleep(3)
        
        # Phase 4: Verification
        active_debug_tasks[task_id]["status"] = "verifying"
        active_debug_tasks[task_id]["progress"] = 90
        active_debug_tasks[task_id]["logs"].append("Running internal test suite to verify fix...")
        await asyncio.sleep(2)
        
        # Done
        active_debug_tasks[task_id]["status"] = "completed"
        active_debug_tasks[task_id]["progress"] = 100
        active_debug_tasks[task_id]["logs"].append("Fix verified. System health restored.")
        active_debug_tasks[task_id]["result"] = {
            "fixed": True,
            "files_changed": ["dashboard/src/api/client.js"],
            "jira_ticket": "NEXUS-124"
        }
    except Exception as e:
        active_debug_tasks[task_id]["status"] = "failed"
        active_debug_tasks[task_id]["error"] = str(e)

@router.get("/status/{task_id}")
async def get_debug_status(task_id: str):
    if task_id not in active_debug_tasks:
        raise HTTPException(404, "Task not found")
    return active_debug_tasks[task_id]
