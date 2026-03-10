import { C } from "../constants";
import { SectionTitle, Card, GlowBadge } from "../components/UI";

const LAYERS = [
    {
        n: "L0", title: "INPUT & AUTHENTICATION GATEWAY", color: C.cyan,
        components: ["URL Parser", "System Classifier AI", "Auth Negotiator (OAuth/JWT/Cookie)", "Scope Resolver", "Rate Limiter"],
        desc: "Accepts any URL, API endpoint, config, or codebase path. Uses LLM to classify system type and negotiates authentication automatically."
    },
    {
        n: "L1", title: "ORCHESTRATOR BRAIN (LangGraph)", color: C.violet,
        components: ["Task Decomposer", "Agent Router", "Priority Queue", "State Machine", "Context Memory (Redis)"],
        desc: "The central LangGraph state machine that breaks targets into testable units, assigns agents, manages parallel execution, and maintains global scan state."
    },
    {
        n: "L2", title: "PARALLEL TEST AGENTS (18 Agents)", color: C.gold,
        components: ["UI Agent", "API Agent", "Security Agent", "Performance Agent", "A11y Agent", "SEO Agent", "Data Agent", "ERP Agent", "Debug Agent", "Issue Tracker", "Code Analyzer", "JIRA Bot", "Mobile Agent", "SEO Repair Agent", "POS Agent", "Fuzzer Agent", "Regression Agent", "Report Agent"],
        desc: "18 specialized agents operating concurrently via asyncio. Each owns a domain and communicates results back through the shared state store."
    },
    {
        n: "L3", title: "AUTO-REPAIR ENGINES", color: C.green,
        components: ["SEO Auto-Fixer", "Code Debugger", "Test Self-Healer", "Config Auto-Patcher", "Dependency Updater"],
        desc: "Post-detection repair layer. When issues are found, repair agents attempt automated fixes using LLM-generated patches, SEO tools, and code rewriters."
    },
    {
        n: "L4", title: "TOOL EXECUTION LAYER", color: C.orange,
        components: ["Playwright/Selenium", "OWASP ZAP", "Lighthouse", "axe-core", "Locust", "Nuclei", "SQLMap", "Screaming Frog API", "Schemathesis"],
        desc: "60+ industry tools wrapped as LangChain ToolNodes. Each agent selects tools dynamically based on scan context."
    },
    {
        n: "L5", title: "LLM ANALYSIS LAYER", color: "#ff6ec7",
        components: ["Claude Sonnet (Primary)", "GPT-4o (Secondary)", "GPT-3.5-turbo (Free Tier)", "Ollama / Llama3 (Local)", "Mistral (Offline)", "LLM Router (cost-aware)"],
        desc: "Multi-LLM routing layer. Selects the optimal model based on task complexity, cost budget, and privacy requirements. Free tier always available."
    },
    {
        n: "L6", title: "ISSUE TRACKING & JIRA ENGINE", color: C.red,
        components: ["Finding Aggregator", "Severity Scorer", "JIRA Ticket Creator", "Label Assigner", "Sprint Router", "Duplicate Detector", "GitHub Issues Bridge"],
        desc: "Every finding automatically becomes a structured JIRA ticket with severity, labels, assignee, sprint, description, and reproduction steps."
    },
    {
        n: "L7", title: "REPORT & DASHBOARD LAYER", color: C.cyan,
        components: ["PDF Generator", "HTML Dashboard", "Editable Report Editor", "REST API", "WebSocket Live Feed", "Grafana Bridge", "Webhook Publisher"],
        desc: "Generates editable, live reports. Users can modify findings, re-trigger specific scans, and publish reports to Slack/Email/JIRA."
    },
];

export default function ArchitectureSection() {
    return (
        <div>
            <SectionTitle icon="⬡" title="SYSTEM ARCHITECTURE" sub="8-Layer autonomous intelligence pipeline" color={C.cyan} />
            {LAYERS.map((layer, i) => (
                <Card key={layer.n} color={layer.color} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: layer.color, marginRight: 10 }}>{layer.n}</span>
                            <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#fff", fontSize: 13 }}>{layer.title}</span>
                        </div>
                        <div style={{ fontSize: 9, color: layer.color, border: `1px solid ${layer.color}33`, padding: "2px 8px", borderRadius: 3, fontFamily: "monospace" }}>
                            LAYER {i}
                        </div>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 12, fontFamily: "monospace", lineHeight: 1.6 }}>{layer.desc}</div>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {layer.components.map(c => <GlowBadge key={c} color={layer.color} small>{c}</GlowBadge>)}
                    </div>
                </Card>
            ))}
        </div>
    );
}
