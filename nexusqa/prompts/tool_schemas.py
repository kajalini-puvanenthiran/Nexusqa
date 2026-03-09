NEXUS_TOOLS = [
    {
        "name": "playwright_ui_test",
        "description": "Run Playwright browser automation to test UI flows, forms, navigation, and visual elements.",
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "Target URL to test"},
                "test_scenario": {"type": "string", "description": "What to test: 'forms', 'navigation', 'visual', 'responsive'"},
                "viewport": {"type": "string", "description": "Viewport size e.g. '1920x1080' or 'mobile'"},
            },
            "required": ["url", "test_scenario"]
        }
    },
    {
        "name": "owasp_security_scan",
        "description": "Run OWASP ZAP security scan to detect OWASP Top 10 vulnerabilities.",
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {"type": "string"},
                "scan_type": {"type": "string", "enum": ["passive", "active", "ajax_spider"]},
            },
            "required": ["url"]
        }
    },
    {
        "name": "lighthouse_performance",
        "description": "Run Google Lighthouse to get Core Web Vitals, SEO score, and performance metrics.",
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {"type": "string"},
                "categories": {"type": "array", "items": {"type": "string",
                    "enum": ["performance", "accessibility", "seo", "best-practices"]}},
            },
            "required": ["url"]
        }
    },
    {
        "name": "axe_accessibility_check",
        "description": "Run axe-core to detect WCAG 2.1 accessibility violations.",
        "input_schema": {"type": "object", "properties": {"url": {"type": "string"}}, "required": ["url"]}
    },
    {
        "name": "seo_crawler",
        "description": "Crawl a URL for technical SEO issues: meta tags, schema, canonical, sitemap.",
        "input_schema": {"type": "object", "properties": {"url": {"type": "string"}, "depth": {"type": "integer"}}, "required": ["url"]}
    },
    {
        "name": "apply_seo_fix",
        "description": "Apply an SEO fix to the target system (inject meta tag, fix canonical, add schema JSON-LD).",
        "input_schema": {
            "type": "object",
            "properties": {
                "fix_type": {"type": "string", "enum": ["meta_title", "meta_desc", "canonical", "schema_jsonld", "alt_text"]},
                "url": {"type": "string"},
                "content": {"type": "string", "description": "The fix content to inject"},
            },
            "required": ["fix_type", "url", "content"]
        }
    },
    {
        "name": "create_jira_ticket",
        "description": "Create a JIRA ticket for a QA finding with full details.",
        "input_schema": {
            "type": "object",
            "properties": {
                "issue_type": {"type": "string", "enum": ["Bug", "Task", "Story", "Epic"]},
                "title": {"type": "string"},
                "description": {"type": "string"},
                "severity": {"type": "string", "enum": ["Critical", "High", "Medium", "Low", "Info"]},
                "component": {"type": "string"},
                "labels": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["issue_type", "title", "description", "severity"]
        }
    },
    {
        "name": "analyze_error_log",
        "description": "Parse and analyze an error log or stack trace to find root cause.",
        "input_schema": {
            "type": "object",
            "properties": {
                "log_content": {"type": "string"},
                "language": {"type": "string", "enum": ["python", "javascript", "java", "go", "ruby"]},
            },
            "required": ["log_content"]
        }
    },
    {
        "name": "apply_code_fix",
        "description": "Apply an auto-generated code fix to the codebase.",
        "input_schema": {
            "type": "object",
            "properties": {
                "file_path": {"type": "string"},
                "fix_description": {"type": "string"},
                "patch": {"type": "string", "description": "Unified diff format patch to apply"},
            },
            "required": ["file_path", "fix_description", "patch"]
        }
    },
    {
        "name": "generate_qa_report",
        "description": "Generate the final QA report from all collected findings.",
        "input_schema": {
            "type": "object",
            "properties": {
                "format": {"type": "string", "enum": ["json", "pdf", "html", "markdown"]},
                "include_fixes": {"type": "boolean"},
                "include_jira_links": {"type": "boolean"},
            },
            "required": ["format"]
        }
    },
]
