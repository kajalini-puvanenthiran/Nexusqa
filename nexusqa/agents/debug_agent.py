import anthropic

client = anthropic.Anthropic()

class DebugResult:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

async def auto_debug_with_claude(error_log: str, codebase_path: str) -> DebugResult:
    """
    Claude debugs errors autonomously using:
    1. Extended Thinking for deep root cause analysis
    2. Text Editor Tool to read/edit source files
    3. Bash Tool to run git blame and tests
    4. create_jira_ticket tool for unfixable issues
    """
    
    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",  # Claude 3.7 enables extended thinking natively
        max_tokens=16000,
        thinking={
            "type": "enabled",
            "budget_tokens": 10000  # Deep reasoning budget for root cause
        },
        tools=[
            {"type": "text_editor_20241022", "name": "str_replace_editor"},
            {"type": "bash_20241022", "name": "bash"},
            {
                "name": "create_jira_ticket",
                "description": "Create JIRA ticket if bug cannot be auto-fixed",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "severity": {"type": "string"},
                        "root_cause": {"type": "string"},
                        "reproduction_steps": {"type": "string"},
                    },
                    "required": ["title", "description", "severity"]
                }
            }
        ],
        system="""You are an expert debugging engineer with deep knowledge of debugging and resolving errors.

When given an error:
1. THINK deeply (use your thinking budget) about the root cause
2. Use str_replace_editor to READ the relevant source files  
3. Use bash to run: git log --oneline -10, git blame <file>, python -m pytest <test>
4. If you can fix it: use str_replace_editor to apply the fix
5. If you fixed it: run the test again with bash to verify
6. If unfixable: create a detailed JIRA ticket with full root cause analysis

Always explain your reasoning. Always verify fixes with tests.""",
        messages=[{
            "role": "user",
            "content": f"""Debug this error:

Error Log:
{error_log}

Codebase is at: {codebase_path}

Please:
1. Find the root cause (think carefully — use your full thinking budget)
2. Read the relevant source file(s) with str_replace_editor
3. Apply a fix if possible
4. Verify the fix works with tests
5. If unfixable, create a JIRA ticket with full details"""
        }]
    )
    
    # Extract thinking blocks (Claude's internal reasoning)
    thinking = [b.thinking for b in response.content if getattr(b, "type", "") == "thinking"]
    fixes_applied = []
    jira_tickets = []
    
    for block in response.content:
        if getattr(block, "type", "") == "tool_use":
            if block.name == "str_replace_editor" and block.input.get("command") == "str_replace":
                fixes_applied.append({
                    "file": block.input["path"],
                    "old": block.input["old_str"][:100] + "...",
                    "new": block.input["new_str"][:100] + "...",
                })
            elif block.name == "create_jira_ticket":
                jira_tickets.append(block.input)
    
    final_text = next((b.text for b in response.content if getattr(b, "type", "") == "text"), "")
    
    return DebugResult(
        root_cause_reasoning=thinking[0] if thinking else "",
        fixes_applied=fixes_applied,
        jira_tickets_created=jira_tickets,
        summary=final_text,
    )
