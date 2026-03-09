import anthropic
import base64
import subprocess
import json

client = anthropic.Anthropic()

async def launch_browser_sandbox(target_url: str):
    """Mock implementation for browser sandbox returning async class obj"""
    class MockEnv:
        async def capture_screenshot(self): return b"mock_screenshot_data"
        async def click(self, x, y, action): pass
        async def type_text(self, text): pass
    return MockEnv()

def parse_findings(text: str):
    return [{"parsed": True, "raw": text}]

async def run_computer_use_ui_test(target_url: str, test_instructions: str) -> dict:
    """
    Claude directly controls a browser using Computer Use API.
    No Playwright code — Claude sees and interacts naturally.
    """
    
    # Start a sandboxed browser environment (Docker with VNC)
    browser_env = await launch_browser_sandbox(target_url)
    
    conversation = []
    screenshots = []
    test_results = []
    
    # Tell Claude what to test
    conversation.append({
        "role": "user",
        "content": f"""You are controlling a browser for QA testing.
        
The browser is currently open at: {target_url}

Please perform this UI test: {test_instructions}

Use the computer tools to:
1. Take a screenshot to see the current state
2. Interact with the page (click, type, scroll)
3. Verify each element works correctly
4. Document any bugs you find
5. Take evidence screenshots of any issues

Be thorough. Test all interactive elements. Report findings in structured format."""
    })
    
    # Computer Use agent loop
    while True:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",  # Changed to 3.5 sonnet which supports computer use natively
            max_tokens=4096,
            tools=[
                {
                    "type": "computer_20241022",
                    "name": "computer",
                    "display_width_px": 1920,
                    "display_height_px": 1080,
                    "display_number": 1,
                },
                {
                    "type": "text_editor_20241022",
                    "name": "str_replace_editor",
                },
                {
                    "type": "bash_20241022",
                    "name": "bash",
                },
            ],
            messages=conversation,
            system="""You are a meticulous QA engineer performing visual browser testing.
            Take screenshots frequently to verify results.
            For every bug found, take a screenshot as evidence.
            Document findings with: what you expected, what you observed, severity.""",
        )
        
        conversation.append({"role": "assistant", "content": response.content})
        
        if response.stop_reason == "end_turn":
            break
        
        tool_results = []
        for block in response.content:
            if block.type != "tool_use":
                continue
            
            if block.name == "computer":
                action = block.input["action"]
                
                if action == "screenshot":
                    # Capture real screenshot from browser sandbox
                    screenshot_data = await browser_env.capture_screenshot()
                    screenshots.append(screenshot_data)
                    
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": [{
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": base64.b64encode(screenshot_data).decode("utf-8"),
                            }
                        }]
                    })
                
                elif action in ["left_click", "right_click", "double_click"]:
                    x, y = block.input["coordinate"]
                    await browser_env.click(x, y, action)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": "Action performed"
                    })
                
                elif action == "type":
                    await browser_env.type_text(block.input["text"])
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": "Text typed"
                    })
        
        conversation.append({"role": "user", "content": tool_results})
    
    # Extract findings from Claude's final response
    final_text = next((b.text for b in response.content if b.type == "text"), "")
    
    return {
        "test_instructions": test_instructions,
        "findings": parse_findings(final_text),
        "evidence_screenshots": screenshots,
        "claude_narrative": final_text,
    }
