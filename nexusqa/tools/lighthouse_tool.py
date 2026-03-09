import asyncio
import json
import subprocess

async def run_lighthouse_performance(url: str, categories: list = ["performance", "accessibility", "seo", "best-practices"]) -> dict:
    cat_str = ",".join(categories)
    # Mocking lighthouse subprocess
    # result = subprocess.run(["lighthouse", url, "--output=json", "--quiet", f"--only-categories={cat_str}"], capture_output=True)
    # return json.loads(result.stdout)
    await asyncio.sleep(1)
    return {
        "performance_score": 0.9,
        "seo_score": 0.95,
        "accessibility_score": 1.0,
        "best_practices_score": 0.85
    }
