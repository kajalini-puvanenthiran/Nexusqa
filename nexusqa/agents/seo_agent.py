import asyncio
from nexusqa.batch_seo import batch_seo_scan_and_repair

async def run_seo_audit(url: str, pages: list[str]):
    """
    SEO Agent implementing the Batch API and auto-repair.
    """
    report = await batch_seo_scan_and_repair(url, pages)
    return report
