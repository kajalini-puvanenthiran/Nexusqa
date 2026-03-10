import { C } from "../constants";
import { SectionTitle, Card, GlowBadge, CodeBlock } from "../components/UI";

const CATEGORIES = [
    {
        cat: "🧠 AI / Orchestration", color: C.violet, items: [
            ["LangGraph", "Agent state machines & workflow graphs"],
            ["LangChain", "Tool binding, chains, retrievers"],
            ["Antigravity Framework", "Primary application framework"],
            ["Claude Sonnet 4", "Primary LLM for analysis"],
            ["GPT-4o", "Vision + multimodal tasks"],
            ["GPT-3.5-turbo", "Free tier analysis"],
            ["Ollama + Llama3", "Local / offline mode"],
            ["Groq (Llama3-8b)", "Free tier ultra-fast inference"],
        ]
    },
    {
        cat: "🕷️ Testing & Automation", color: C.cyan, items: [
            ["Playwright", "Primary browser automation"],
            ["Selenium Grid", "Cross-browser parallel testing"],
            ["Appium", "Mobile iOS/Android testing"],
            ["Schemathesis", "API contract testing"],
            ["Postman/Newman", "API collection runner"],
            ["Hypothesis", "Property-based data testing"],
            ["axe-core", "WCAG accessibility audit"],
            ["Pa11y", "CI-friendly a11y CLI"],
        ]
    },
    {
        cat: "🔒 Security", color: C.red, items: [
            ["OWASP ZAP", "Active + passive scanning"],
            ["Nuclei", "7000+ CVE templates"],
            ["SQLMap API", "SQL injection suite"],
            ["SSLyze", "TLS/SSL audit"],
            ["Bandit", "Python SAST"],
            ["Safety", "Dependency CVE scan"],
        ]
    },
    {
        cat: "📈 SEO & Performance", color: C.green, items: [
            ["Screaming Frog API", "Technical SEO crawler"],
            ["Google Search Console API", "Real ranking data"],
            ["Lighthouse (Python)", "Core Web Vitals + SEO score"],
            ["WebPageTest API", "Waterfall analysis"],
            ["Locust", "Load & stress testing"],
            ["k6", "API performance testing"],
        ]
    },
    {
        cat: "🎫 Issue Management", color: C.orange, items: [
            ["JIRA REST API v3", "Ticket creation & management"],
            ["Atlassian Python API", "JIRA Python client"],
            ["GitHub Issues API", "Alt to JIRA for GitHub users"],
            ["Sentry SDK", "Error monitoring integration"],
            ["sentence-transformers", "Duplicate ticket detection"],
            ["GitPython", "git blame & commit analysis"],
        ]
    },
    {
        cat: "🏗️ Infrastructure", color: C.gold, items: [
            ["FastAPI", "REST API + WebSocket backend"],
            ["Celery + Redis", "Distributed task queue"],
            ["PostgreSQL + JSONB", "Results & findings storage"],
            ["MinIO / S3", "Screenshot & artifact storage"],
            ["Docker + Kubernetes", "Container orchestration"],
            ["Prometheus + Grafana", "Metrics & dashboards"],
        ]
    },
];

export default function TechStackSection() {
    return (
        <div>
            <SectionTitle icon="◉" title="COMPLETE TECH STACK" sub="Every library, tool, and service in the NEXUS QA system" color={C.cyan} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {CATEGORIES.map(cat => (
                    <Card key={cat.cat} color={cat.color}>
                        <div style={{ fontFamily: "monospace", fontSize: 10, color: cat.color, marginBottom: 12, fontWeight: 700 }}>{cat.cat}</div>
                        {cat.items.map(([name, role]) => (
                            <div key={name} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 7, paddingBottom: 7, borderBottom: `1px solid ${C.border}` }}>
                                <span style={{ fontSize: 10, color: "#fff", fontFamily: "monospace", fontWeight: 600 }}>{name}</span>
                                <span style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>{role}</span>
                            </div>
                        ))}
                    </Card>
                ))}
            </div>
        </div>
    );
}
