import { C } from "../constants";
import { SectionTitle, Card, CodeBlock } from "../components/UI";

const PHASES = [
    {
        n: "01", title: "Foundation & Core Scan", weeks: "Weeks 1–3", color: C.cyan, milestone: "MVP: URL → crawl → basic multi-agent report",
        tasks: ["Antigravity app scaffold + ag.State setup", "Input gateway + system classifier (LLM)", "Playwright crawler agent (ag.Tool)", "UI + Security + Performance agents (basic)", "LLMRouter with free-tier-first logic", "HTML + JSON report output", "Docker Compose dev environment"]
    },
    {
        n: "02", title: "Full Test Agent Suite", weeks: "Weeks 4–7", color: C.violet, milestone: "All 18 agents running in parallel",
        tasks: ["API Agent (Schemathesis + Newman)", "Accessibility Agent (axe-core + Pa11y)", "SEO Agent (Lighthouse + Google APIs)", "Data Quality Agent (Hypothesis + fuzzing)", "Mobile Agent (Appium integration)", "Code Analyzer Agent (Bandit + SonarQube API)", "ag.Parallel optimization for concurrent runs"]
    },
    {
        n: "03", title: "Auto-Debug & Self-Healing", weeks: "Weeks 8–10", color: C.orange, milestone: "Tests self-heal; dev errors auto-analyzed",
        tasks: ["AutoDebugAgent with LLM root cause loop", "Playwright error interceptors + console hooks", "Sentry + Datadog integration for prod errors", "git blame + PR correlation engine", "Auto-fix code generation (LLM patch generation)", "GitHub PR auto-creation for fixes"]
    },
    {
        n: "04", title: "SEO Engine + Auto-Repair", weeks: "Weeks 11–13", color: C.green, milestone: "Full SEO audit + automated fix application",
        tasks: ["SEORepairAgent with 30+ fix handlers", "Vision AI for alt text generation", "JSON-LD schema auto-injection", "Screaming Frog + Google Search Console API", "SEO score trending over time", "Sitemap + robots.txt auto-regeneration"]
    },
    {
        n: "05", title: "JIRA Automation + Issue Tracker", weeks: "Weeks 14–16", color: C.red, milestone: "Zero-click JIRA tickets for every finding",
        tasks: ["JIRAAutomationAgent with full ticket lifecycle", "Semantic duplicate detection (sentence-transformers)", "Smart assignee routing by expertise tags", "Sprint auto-assignment by severity", "IssueTrackerAgent with real-time log monitoring", "GitHub Issues bridge (JIRA alternative)"]
    },
    {
        n: "06", title: "DevOps, Scale & Antigravity Deploy", weeks: "Weeks 17–20", color: C.gold, milestone: "Production-ready, one-command deployment",
        tasks: ["ag deploy → full Kubernetes cluster", "HPA for agent worker auto-scaling", "CI/CD GitHub Actions + GitLab CI hooks", "Quality gates: block PR on Critical findings", "Prometheus + Grafana observability stack", "Scheduled cron regression scans (ag.Scheduler)"]
    },
    {
        n: "07", title: "Intelligence & Learning", weeks: "Weeks 21–26", color: "#ff6ec7", milestone: "Self-improving, trend-aware QA platform",
        tasks: ["Quality score trending per system over time", "ML-based test prioritization (train on findings history)", "Natural language query: 'Why did this fail?'", "Multi-environment diff (dev vs staging vs prod)", "Public REST API + Python SDK for programmatic access", "Predictive issue detection before deployment"]
    },
];

export default function RoadmapSection() {
    return (
        <div>
            <SectionTitle icon="◎" title="IMPLEMENTATION ROADMAP" sub="7-phase build plan from MVP to self-improving intelligence" color={C.cyan} />
            {PHASES.map(p => (
                <Card key={p.n} color={p.color} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                        <div>
                            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: p.color, marginRight: 10 }}>PHASE {p.n}</span>
                            <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.title}</span>
                            <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", marginTop: 3 }}>{p.weeks}</div>
                        </div>
                        <div style={{ fontSize: 9, padding: "6px 12px", border: `1px solid ${p.color}44`, borderRadius: 4, color: p.color, fontFamily: "monospace", textAlign: "right", maxWidth: 220, lineHeight: 1.4 }}>
                            🎯 {p.milestone}
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {p.tasks.map((task, j) => (
                            <div key={j} style={{ display: "flex", gap: 6, fontSize: 10, color: C.text, fontFamily: "monospace" }}>
                                <span style={{ color: p.color, flexShrink: 0 }}>☑</span> {task}
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
}
