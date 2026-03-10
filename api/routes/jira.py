from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import User
import random
from pydantic import BaseModel
from typing import List

router = APIRouter()

class JiraTicket(BaseModel):
    id: str
    title: str
    status: str
    priority: str
    assignee: str
    type: str

# In-memory mock JIRA database for simulation
mock_jira_db = [
    {"id": "NEXUS-101", "title": "[DEV] SQL Injection Vulnerability in Auth", "status": "In Progress", "priority": "Highest", "assignee": "Security Agent", "type": "DEVELOPMENT"},
    {"id": "NEXUS-102", "title": "[SEO] Missing Meta Tags on /about", "status": "To Do", "priority": "Medium", "assignee": "SEO Agent", "type": "SEO INTELLIGENCE"},
    {"id": "NEXUS-103", "title": "[DESIGN] Navigation contrast too low for A11y", "status": "Open", "priority": "High", "assignee": "UX Agent", "type": "UI/UX DESIGN"},
]

@router.get("/tickets", response_model=List[JiraTicket])
async def get_tickets(user: User = Depends(get_current_user)):
    return mock_jira_db

@router.post("/sync")
async def sync_jira(user: User = Depends(get_current_user)):
    """Simulates syncing findings to JIRA with 3 core agentic types"""
    types = ["DEVELOPMENT", "SEO INTELLIGENCE", "UI/UX DESIGN"]
    prefixes = ["[DEV]", "[SEO]", "[DESIGN]"]
    idx = random.randint(0, 2)
    
    new_tickets = [
        {
            "id": f"NEXUS-{random.randint(200, 999)}", 
            "title": f"{prefixes[idx]} Autonomous finding from latest scan", 
            "status": "To Do", 
            "priority": random.choice(["Medium", "High", "Highest"]), 
            "assignee": "Unassigned agent", 
            "type": types[idx]
        }
    ]
    mock_jira_db.extend(new_tickets)
    return {"status": "success", "synced_count": len(new_tickets)}

@router.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: str, user: User = Depends(get_current_user)):
    global mock_jira_db
    mock_jira_db = [t for t in mock_jira_db if t["id"] != ticket_id]
    return {"status": "deleted"}
