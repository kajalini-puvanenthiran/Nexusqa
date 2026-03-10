import { C } from "../constants";
import { SectionTitle, Card, CodeBlock } from "../components/UI";

export default function AntigravitySection() {
    return (
        <div>
            <SectionTitle icon="✦" title="ANTIGRAVITY BUILD STRATEGY" sub="Transform the NEXUS QA blueprint into an Antigravity-native application" color={C.gold} />

            <Card color={C.gold} glow style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, color: C.gold, marginBottom: 16 }}>✦ WHAT IS ANTIGRAVITY?</div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: C.text, lineHeight: 1.9 }}>
                    Antigravity is a <span style={{ color: C.gold }}>Python-based rapid application framework</span> built for
                    production-grade, vertically-integrated AI applications. It treats the entire
                    application — from agent logic to UI to deployment — as a single composable unit.
                    NEXUS QA maps perfectly: <span style={{ color: C.gold }}>agents as first-class citizens,
                        everything async, events-driven, and deployable with one command</span>.
                </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                {[
                    {
                        title: "ANTIGRAVITY CORE → NEXUS QA MAPPING", color: C.gold, pairs: [
                            ["ag.Agent class", "Each of the 18 NEXUS agents extends ag.Agent"],
                            ["ag.Flow", "The orchestration pipeline = ag.Flow graph"],
                            ["ag.Tool", "Playwright, ZAP, Locust = ag.Tool wrappers"],
                            ["ag.State", "Scan state (sitemap, findings, results) = ag.State"],
                            ["ag.Event", "Test failure, issue found, JIRA created = ag.Event"],
                            ["ag.Scheduler", "Cron regression scans = ag.Scheduler jobs"],
                            ["ag.Dashboard", "Report UI = ag.Dashboard with live WebSocket"],
                            ["ag.Deploy", "Docker/K8s one-command deploy = ag.Deploy config"],
                        ]
                    },
                    {
                        title: "WHY ANTIGRAVITY FOR NEXUS QA", color: C.gold, pairs: [
                            ["Native async", "All 18 agents run concurrently with zero boilerplate"],
                            ["Built-in state", "Scan context persists across all agents automatically"],
                            ["Event bus", "Agents communicate via events without tight coupling"],
                            ["Hot reload", "Update agent logic without restarting the full system"],
                            ["Plugin system", "Add new test agents as installable ag.plugins"],
                            ["One-file deploy", "ag deploy nexusqa → full K8s cluster in minutes"],
                            ["LLM-native", "Built-in LLM tool calling, structured outputs, routing"],
                            ["Observable", "All agent activity auto-traced with OpenTelemetry"],
                        ]
                    },
                ].map(box => (
                    <Card key={box.title} color={box.color}>
                        <div style={{ fontFamily: "monospace", fontSize: 9, color: box.color, marginBottom: 12, fontWeight: 700, letterSpacing: "0.5px" }}>{box.title}</div>
                        {box.pairs.map(([k, v]) => (
                            <div key={k} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, marginBottom: 7, paddingBottom: 7, borderBottom: `1px solid ${C.border}` }}>
                                <span style={{ fontSize: 9, color: box.color, fontFamily: "monospace", fontWeight: 600 }}>{k}</span>
                                <span style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>{v}</span>
                            </div>
                        ))}
                    </Card>
                ))}
            </div>

            <CodeBlock lang="python // nexusqa_antigravity_app.py" color={C.gold} code={`import antigravity as ag
from antigravity import Agent, Flow, Tool, State, Event, Dashboard

class ScanState(ag.State):
    target_url: str
    findings: list[dict] = []
    jira_tickets: list[str] = []
    auto_fixes_applied: int = 0

class UIAgent(ag.Agent):
    name = "ui_tester"
    tools = [playwright_tool]
    llm = ag.LLM.auto()  # Uses LLMRouter — free if no API key set

    async def run(self, state: ScanState) -> ag.AgentResult:
        result = await self.tools.playwright_tool(state.target_url)
        findings = await self.llm.analyze(result, schema=FindingsSchema)
        return ag.AgentResult(findings=findings)

scan_flow = ag.Flow(
    name="nexusqa_scan",
    state=ScanState,
    graph=[
        ag.Node("classify", ClassifyAgent),
        ag.Node("crawl",    CrawlerAgent),
        ag.Parallel("test", [
            UIAgent, APIAgent, SecurityAgent, PerformanceAgent,
            AccessibilityAgent, SEOAgent, DataAgent, AutoDebugAgent,
            CodeAnalyzerAgent, MobileAgent, FuzzerAgent,
        ]),
        ag.Node("analyze", LLMAnalysisAgent),
        ag.Node("jira",    JIRAAutomationAgent),
        ag.Node("report",  ReportAgent),
    ],
    on_finding=lambda f, s: JIRAAutomationAgent().create_ticket_from_finding(f),
    on_error=lambda e, s:   AutoDebugAgent().self_heal(e, s),
)

app = ag.App(name="nexusqa", flows=[scan_flow],
    dashboard=ag.Dashboard(title="NEXUS QA Control Center", realtime=True, editable=True))

# ag deploy nexusqa.py --platform kubernetes
# ag run nexusqa.py`} />

            <Card color={C.gold} style={{ marginTop: 16 }}>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: C.gold, marginBottom: 12, fontWeight: 700 }}>ANTIGRAVITY PROJECT STRUCTURE</div>
                <pre style={{ margin: 0, fontSize: 10, color: "#4a8aaa", lineHeight: 1.9, fontFamily: "monospace", background: "transparent" }}>{`nexusqa/
├── nexusqa.py              # ag.App entrypoint
├── ag.config.yaml          # LLM keys, JIRA config, thresholds
├── agents/                 # 18 ag.Agent subclasses
│   ├── ui_agent.py
│   ├── security_agent.py
│   ├── seo_agent.py
│   ├── debug_agent.py
│   └── jira_agent.py
├── tools/                  # ag.Tool wrappers
│   ├── playwright_tool.py
│   ├── zap_tool.py
│   └── seo_tools.py
├── repair/                 # Auto-fix engines
│   ├── seo_repair.py
│   └── test_healer.py
├── Dockerfile              # ag dockerfile nexusqa.py
└── deploy/k8s.yaml         # ag k8s nexusqa.py`}</pre>
            </Card>
        </div>
    );
}
