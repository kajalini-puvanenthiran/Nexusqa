from nexusqa.tools.jira_tool import claude_create_jira_ticket
import anthropic

client = anthropic.Anthropic()

async def automate_jira_ticket(finding: dict, screenshot: bytes = None):
    """
    JIRA Automation Agent runs Claude to write every ticket contextually.
    """
    ticket_id = await claude_create_jira_ticket(client, finding, screenshot)
    return ticket_id
