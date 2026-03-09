import anthropic
import json

client = anthropic.Anthropic()

async def analyze_vulnerability_chain(context: dict):
    """
    Security Agent uses extended thinking to trace attack surfaces 
    and CVSS scorings for the security findings.
    """
    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",  # Models with max reasoning budget
        max_tokens=16000,
        thinking={
            "type": "enabled",
            "budget_tokens": 10000
        },
        system="You are a senior security researcher analyzing vulnerabilities.",
        messages=[{
            "role": "user",
            "content": f"Analyze this security scan result thoroughly: {json.dumps(context)}"
        }]
    )
    
    thinking = [b.thinking for b in response.content if getattr(b, "type", "") == "thinking"]
    summary = next((b.text for b in response.content if getattr(b, "type", "") == "text"), "")
    
    return {
        "reasoning": thinking[0] if thinking else "",
        "summary": summary
    }
