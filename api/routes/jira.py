from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import User
import random
from datetime import datetime
from pydantic import BaseModel
from typing import List

router = APIRouter()

class NeuralJiraClassifier:
    """Simulates an AI classifier for JIRA ticket types"""
    @staticmethod
    def classify(finding_content: str, severity: str) -> str:
        content = finding_content.lower()
        if "vulnerability" in content or "crash" in content or "broken" in content or "error" in content:
            return "BUG"
        if "missing" in content and "feature" in content:
            return "STORY"
        if "large" in content or "platform" in content or "full" in content:
            return "EPIC"
        if "optimize" in content or "enhance" in content or "slow" in content:
            return "IMPROVEMENT"
        return "TASK"

# In-memory mock JIRA database with professional standards
mock_jira_db = [
    {
        "id": "NEXUS-701", 
        "title": "Admin Unable to Create New Case from Admin Dashboard – BGV System", 
        "status": "In Progress", 
        "priority": "HIGH", 
        "severity": "HIGH",
        "assignee": "Backend Team", 
        "type": "BUG",
        "environment": "Staging | BGV Checker | Chrome",
        "preconditions": "Admin user logged in",
        "steps": "1. Login\n2. Navigate to Case Management\n3. Click Create\n4. Submit",
        "expected": "Case created successfully",
        "actual": "System displays Error 500",
        "module": "Case Management",
        "description": "Critical failure in the case submission pipeline preventing record creation.",
        "reporter": "Nexus Intelligence Agent",
        "logs": 'Error: "Failed to create case – Server error 500"',
        "created_at": "2026-03-10T09:30:00Z"
    }
]

@router.get("/tickets")
async def get_tickets(user: User = Depends(get_current_user)):
    return mock_jira_db

@router.post("/sync")
async def sync_jira(user: User = Depends(get_current_user)):
    """Autonomous JIRA identification and creation engine"""
    classifier = NeuralJiraClassifier()
    
    # Simulated autonomous findings from the "Neural Scan Stream"
    raw_findings = [
        {"desc": "Critical SQL vulnerability in Auth module", "sev": "CRITICAL", "mod": "Security"},
        {"desc": "Optimize the dashboard loading speed for mobile users", "sev": "MEDIUM", "mod": "Frontend"},
        {"desc": "Missing user profile export feature for GDPR compliance", "sev": "HIGH", "mod": "Compliance"},
        {"desc": "Configure the SMTP relay for the production environment", "sev": "LOW", "mod": "DevOps"},
    ]
    
    selected = random.choice(raw_findings)
    issue_type = classifier.classify(selected["desc"], selected["sev"])
    
    ticket_id = f"NEXUS-{random.randint(800, 999)}"
    new_ticket = {
        "id": ticket_id,
        "title": f"[{selected['mod'].upper()}] {selected['desc']}",
        "type": issue_type,
        "status": "Open",
        "priority": selected["sev"],
        "severity": selected["sev"],
        "module": selected["mod"],
        "environment": "Production Environment | Nexus Core | Multi-Agent",
        "preconditions": "Nexus agent performing global telemetry scan",
        "steps": "1. Initiate autonomous scan\n2. Intercept response stream\n3. Identify protocol violation\n4. Trigger JIRA automation",
        "expected": "No violations detected",
        "actual": f"Identified {selected['desc']}",
        "description": f"Automatically identified as {issue_type} by Nexus Neural Classifier based on telemetry data.",
        "assignee": f"{selected['mod']} Agent",
        "reporter": "Nexus Intelligence Engine",
        "logs": f"AGENT_LOG: Identification confirmed. Routing to {issue_type} protocol.",
        "created_at": datetime.utcnow().isoformat()
    }
    
    mock_jira_db.insert(0, new_ticket)
    return {"status": "success", "synced_count": 1, "created_id": ticket_id, "identified_type": issue_type}

@router.put("/tickets/{ticket_id}")
async def update_ticket(ticket_id: str, ticket: dict, user: User = Depends(get_current_user)):
    global mock_jira_db
    for i, t in enumerate(mock_jira_db):
        if t["id"] == ticket_id:
            mock_jira_db[i] = ticket
            return {"status": "updated"}
    raise HTTPException(status_code=404, detail="Ticket not found")

@router.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: str, user: User = Depends(get_current_user)):
    global mock_jira_db
    mock_jira_db = [t for t in mock_jira_db if t["id"] != ticket_id]
    return {"status": "deleted"}
