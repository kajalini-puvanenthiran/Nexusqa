from nexusqa.computer_use import run_computer_use_ui_test

async def execute_ui_test(url: str, instructions: str):
    """
    UI Testing Agent using the native Computer Use API.
    Claude controls a real browser, takes screenshots, clicks elements.
    """
    res = await run_computer_use_ui_test(url, instructions)
    return res
