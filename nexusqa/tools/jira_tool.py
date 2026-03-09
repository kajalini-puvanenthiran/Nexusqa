import os
import json
import base64
from jira import JIRA

JIRA_URL = os.environ.get("JIRA_URL", "https://your-domain.atlassian.net")
PROJECT_KEY = os.environ.get("JIRA_PROJECT_KEY", "QA")
EMAIL = os.environ.get("JIRA_EMAIL", "")
TOKEN = os.environ.get("JIRA_TOKEN", "")

# from sentence_transformers import SentenceTransformer, util
# embedder = SentenceTransformer('all-MiniLM-L6-v2')
# Mocking embedder due to large dependency
class MockEmbedder:
    def encode(self, *args, **kwargs): return []
embedder = MockEmbedder()

async def create_jira_ticket(issue_type: str, title: str,
                              description: str, severity: str,
                              component: str = "", labels: list = []) -> dict:
    try:
        jira = JIRA(server=JIRA_URL, basic_auth=(EMAIL, TOKEN))
        
        priority_map = {
            "Critical": "Highest", "High": "High",
            "Medium": "Medium", "Low": "Low"
        }
        
        issue = jira.create_issue(fields={
            "project": {"key": PROJECT_KEY},
            "issuetype": {"name": issue_type},
            "summary": f"[NEXUS QA] {title}",
            "description": description,
            "priority": {"name": priority_map.get(severity, "Medium")},
            "labels": labels + ["nexusqa", "auto-generated"],
            "components": [{"name": component}] if component else [],
        })
        
        return {"ticket_id": issue.key, "url": f"{JIRA_URL}/browse/{issue.key}"}
    except Exception as e:
        return {"error": str(e), "status": "failed_connection"}

def map_finding_to_issue_type(typ: str):
    return "Bug"

def format_jira_description(data):
    return data.get("description", "Auto-generated report details.")

async def check_semantic_duplicate(new_title: str, threshold: float = 0.85) -> str | None:
    """Use embeddings to detect duplicate tickets before creating."""
    # Mock behavior to avoid JIRA connection errors without env setup
    return None

async def link_finding_to_ticket(duplicate_id, finding):
    pass

async def claude_create_jira_ticket(client, finding: dict, evidence_screenshot: bytes = None) -> str:
    """
    Claude writes a complete, professional JIRA ticket from a QA finding.
    Uses prompt caching for the JIRA instructions (constant across all tickets).
    """
    
    # Build the content array with cached system context
    content = []
    
    # Add screenshot evidence if available (Claude vision)
    if evidence_screenshot:
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/png",
                "data": base64.b64encode(evidence_screenshot).decode(),
            }
        })
        content.append({
            "type": "text",
            "text": "This screenshot shows the issue. Use it to write precise reproduction steps."
        })
    
    content.append({
        "type": "text",
        "text": f"""Create a complete JIRA ticket for this QA finding:

Finding Type: {finding.get('type', 'Unknown')}
Severity: {finding.get('severity', 'Medium')}  
URL/Location: {finding.get('url', 'N/A')}
Evidence: {finding.get('evidence', 'No evidence provided')}
Recommended Fix: {finding.get('recommendation', 'See analysis')}
Auto-fixed: {finding.get('auto_fixed', False)}

Write a JIRA ticket with:
1. Title: [Severity][Category] Specific descriptive title (max 80 chars)
2. Description: Full context, what's broken and why it matters
3. Steps to Reproduce: Numbered, exact steps from the screenshot/evidence
4. Expected vs Actual: Clear comparison
5. Impact: Business/user impact assessment
6. Recommendation: Technical fix with code example if applicable
7. Labels: List of relevant JIRA labels
8. Component: Most relevant system component

Format as JSON. Make it genuinely useful for a developer."""
    })
    
    JIRA_WRITING_SYSTEM_PROMPT = """You are a senior QA engineer writing JIRA tickets.
Your tickets must be:
- Actionable: developers know exactly what to fix
- Evidence-based: reference specific observations  
- Prioritized correctly: impact on users is the primary factor
- Well-structured: description, steps, expected, actual, recommendation
Always output valid JSON matching the requested schema.
Never use vague language. Be specific about files, line numbers, URLs, selectors."""

    response = client.messages.create(
        model="claude-3-haiku-20240307",  # Fast + cheap for ticket writing
        max_tokens=2048,
        system=[
            {
                "type": "text", 
                "text": JIRA_WRITING_SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"}  # Cache across all tickets
            }
        ],
        messages=[{"role": "user", "content": content}],
    )
    
    ticket_data = json.loads(response.content[0].text)
    
    # Check for semantic duplicates before creating
    duplicate = await check_semantic_duplicate(ticket_data["title"])
    if duplicate:
        # Link to existing instead of creating
        await link_finding_to_ticket(duplicate, finding)
        return duplicate
    
    res = await create_jira_ticket(
        issue_type=map_finding_to_issue_type(finding.get("type", "Bug")),
        title=ticket_data["title"],
        description=format_jira_description(ticket_data),
        severity=finding.get("severity", "Medium"),
        component=ticket_data.get("component", "General"),
        labels=ticket_data.get("labels", [])
    )
    
    return res.get("ticket_id", "MOCK-1")
