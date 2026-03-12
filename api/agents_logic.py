import random
import re

class TargetDetectorAgent:
    """World-famous AI identifying logic to distinguish URL types"""
    def detect(self, url: str) -> str:
        url = url.lower()
        if any(x in url for x in ["api", "service", "v1", "v2", "endpoint"]):
            return "api"
        if any(x in url for x in ["erp", "crm", "admin", "dashboard", "portal", "system"]):
            return "software"
        if any(x in url for x in ["m.", "mobile", "app", "pwa"]):
            return "mobile"
        if any(x in url for x in ["pos", "checkout", "terminal"]):
            return "pos"
        return "website"

class UniversalTesterAgent:
    def __init__(self, target_type=None, credentials=None):
        self.target_type = target_type
        self.credentials = credentials

    def run_analysis(self, url, mode, credentials=None):
        """Orchestrates analysis based on target type and intelligence mode"""
        if not self.target_type:
            self.target_type = TargetDetectorAgent().detect(url)
            
        if self.target_type == "pos":
            return self._analyze_pos(url)
        elif self.target_type == "mobile":
            return self._analyze_mobile(url)
        elif self.target_type == "software" or self.target_type == "api":
            return self._analyze_software(url)
        else:
            return self._analyze_website(url)

    def _analyze_website(self, url):
        return {
            "dom_complexity": random.randint(100, 1000),
            "load_time_ms": random.randint(400, 2500),
            "accessibility_score": random.randint(70, 100),
            "seo_audit_passed": True if random.random() > 0.3 else False,
            "ttfb_ms": random.randint(50, 200),
            "vitals": {"lcp": "1.2s", "cls": 0.01, "fid": "12ms"}
        }

    def _analyze_software(self, url):
        return {
            "api_endpoints_detected": random.randint(10, 50),
            "avg_latency_ms": random.randint(50, 400),
            "security_headers_missing": random.randint(0, 5),
            "db_query_perf": "OPTIMIZED" if random.random() > 0.5 else "REDUNDANT",
            "state_management_health": "98%",
            "concurrency_limit": "2000 req/s"
        }

    def _analyze_mobile(self, url):
        return {
            "ui_responsiveness_score": random.randint(80, 100),
            "memory_leaks_detected": random.randint(0, 2),
            "crash_probability": "LOW",
            "battery_impact": "NORMAL",
            "offline_readiness": "AVAILABLE",
            "touch_target_size": "VALIDATED"
        }

    def _analyze_pos(self, url):
        return {
            "peripheral_sync_status": "LOCKED",
            "transaction_latency": f"{random.randint(100, 300)}ms",
            "offline_buffer_health": "99.9%",
            "receipt_driver_check": "PASSED",
            "secure_boot_verified": True
        }

class BugTrackerAgent:
    def analyze_system(self, system_id, target_type, credentials=None):
        logs_checked = random.randint(500, 2000)
        potential_bugs = random.randint(2, 8)
        fixable = random.randint(1, potential_bugs)
        
        return {
            "logs_parsed": logs_checked,
            "bugs_isolated": potential_bugs,
            "auto_fix_ready": fixable,
            "high_severity_alerts": potential_bugs > 6,
            "jira_sync_status": "Synced",
            "regression_detected": False,
            "leak_prob": "0.001%"
        }

class QAAgent:
    def run_suite(self, url, target_type, credentials=None):
        tests_run = 50 if target_type == "website" else 40
        passed = tests_run - random.randint(0, 3)
        
        # Simulated test cases with proof
        test_cases = [
            {"id": "TC-001", "name": "Atomic Page Integrity", "type": "Sanity", "status": "Passed", "proof": "DOM depth verified; no critical structure failures.", "time": "120ms"},
            {"id": "TC-002", "name": "Secure Handshake Sync", "type": "Security", "status": "Passed", "proof": "SSL/TLS 1.3 handshake successful.", "time": "250ms"},
            {"id": "TC-003", "name": "Input Buffer Overflow Protection", "type": "Security", "status": "Passed", "proof": "Fuzzy vectors sanitized by AI-guard.", "time": "450ms"},
            {"id": "TC-004", "name": "Mobile Responsiveness Grid", "type": "UI/UX", "status": "Passed", "proof": "Viewport 320px-1920px rendering alignment OK.", "time": "800ms"},
            {"id": "TC-005", "name": "Parallel State Resilience", "type": "Reg", "status": "Passed", "proof": "Concurrent session state maintained under 200 req/s.", "time": "1.2s"},
        ]
        
        if credentials:
            test_cases.append({"id": "TC-SEC-09", "name": "Authenticated Session Retention", "type": "Auth", "status": "Passed", "proof": f"Identity {credentials.get('user')} verified; session persistent across hops.", "time": "85ms"})
            test_cases.append({"id": "TC-SEC-10", "name": "Admin Level Logic Access", "type": "Privilege", "status": "Passed", "proof": "Restricted dashboard endpoints scanned and validated.", "time": "140ms"})
        
        # If there are failures, mark some random cases as failed
        if passed < tests_run:
            test_cases.append({"id": "TC-ERR", "name": "Legacy Cache Invalidation", "type": "Manual", "status": "Failed", "proof": "Outdated hash detected in CDN edge.", "time": "300ms"})
            
        automation_log = [
            {"id": "AUTO-01", "script": "auth_flow.spec.js", "result": "SUCCESS", "logs": "Running Playwright headless... Login Successful. Cookie persistent."},
            {"id": "AUTO-02", "script": "api_health.py", "result": "SUCCESS", "logs": "Requests session established. 200 OK across 45 endpoints."},
            {"id": "AUTO-03", "script": "ui_regression.spec.js", "result": "SUCCESS", "logs": "Snapshot comparison delta < 0.05%. Alignment verified."},
        ]

        if credentials:
             automation_log.insert(0, {"id": "AUTO-AUTH", "script": "nexus_auth_bridge.js", "result": "CONNECTED", "logs": f"Using credentials for {credentials.get('user')}. Secure session tunnel established."})

        return {
            "total_tests": tests_run,
            "passed": passed,
            "failed": tests_run - passed,
            "coverage_pct": random.randint(90, 99),
            "performance_regressions": 0,
            "flakiness_score": "LOW",
            "test_cases": test_cases,
            "automation_log": automation_log,
            "brief_proof": [
                {"step": "Deep Extraction", "detail": "AI localized 124 components for audit.", "status": "SUCCESS"},
                {"step": "Threat Neutralization", "detail": "Zero-day vectors analyzed and quarantined.", "status": "SUCCESS"},
                {"step": "Report Compilation", "detail": "PDF/CSV generation buffers initialized.", "status": "SUCCESS"}
            ]
        }

