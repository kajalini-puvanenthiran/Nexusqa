import { useState, useEffect } from "react";
import { C } from "../constants";
import { SectionTitle, Card, GlowBadge, CodeBlock } from "../components/UI";
import { jira } from "../api/client";
import { useNotify } from "../context/NotificationContext";

const TICKET_TYPES = [
    {
        type: "DEVELOPMENT", color: C.red, icon: "💻",
        triggers: ["Logic error", "Runtime crash", "API failure", "Security vulnerability"],
        fields: ["Issue title", "Module affected", "Root cause", "Suggested fix (AI)", "Severity", "Assignee", "Priority"]
    },
    {
        type: "SEO INTELLIGENCE", color: C.green, icon: "📈",
        triggers: ["Ranking drop", "Meta mismatch", "Schema error", "Core Web Vitals gap"],
        fields: ["Affected URL", "SEO impact", "Recommendation", "Auto-patch status", "Verification status"]
    },
    {
        type: "UI/UX DESIGN", color: C.violet, icon: "✨",
        triggers: ["Visual bug", "Flow dead-end", "A11y violation", "Design inconsistency"],
        fields: ["Component", "Heuristic violated", "UX improvement", "Wait time", "Priority"]
    },
];

function AutomatedTicketHub() {
    const { notify } = useNotify();
    const [tickets, setTickets] = useState([]);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => { load(); }, []);
    const load = () => jira.list().then(r => setTickets(r.data)).catch(() => setTickets([]));

    const handleSync = async () => {
        setSyncing(true);
        try {
            await jira.sync();
            await load();
            notify("JIRA findings synced", "success");
        } catch (e) { notify("Sync failed", "error"); }
        setSyncing(false);
    };

    const handleDelete = async (id) => {
        await jira.delete(id);
        setTickets(tickets.filter(t => t.id !== id));
    };

    return (
        <Card color={C.red} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: C.heading, fontWeight: 900 }}>LIVE JIRA AUTOMATION STREAM</div>
                <button onClick={handleSync} disabled={syncing} style={{ padding: "10px 20px", background: C.red, color: "#fff", border: "none", borderRadius: 8, fontFamily: C.font, fontSize: 11, cursor: "pointer", fontWeight: 900, letterSpacing: "0.5px" }}>
                    {syncing ? "SYNCING FINDINGS..." : "SYNC ALL AGENTS"}
                </button>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", color: C.text, fontFamily: C.font, fontSize: 11 }}>
                    <thead>
                        <tr style={{ background: "rgba(0,0,0,0.05)", borderBottom: `2px solid ${C.border}` }}>
                            <th style={{ padding: "14px 10px", textAlign: "left", fontSize: 10, color: C.muted, fontWeight: 800 }}>ID</th>
                            <th style={{ padding: "14px 10px", textAlign: "left", fontSize: 10, color: C.muted, fontWeight: 800 }}>TITLE</th>
                            <th style={{ padding: "14px 10px", textAlign: "left", fontSize: 10, color: C.muted, fontWeight: 800 }}>TYPE</th>
                            <th style={{ padding: "14px 10px", textAlign: "left", fontSize: 10, color: C.muted, fontWeight: 800 }}>STATUS</th>
                            <th style={{ padding: "14px 10px", textAlign: "left", fontSize: 10, color: C.muted, fontWeight: 800 }}>ASSIGNEE</th>
                            <th style={{ padding: "14px 10px", textAlign: "right", fontSize: 10, color: C.muted, fontWeight: 800 }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: 24, textAlign: "center", color: C.muted, fontWeight: 500 }}>No active tickets. Sync agents to generate.</td></tr>
                        ) : tickets.map(t => (
                            <tr key={t.id} style={{ borderBottom: `1px solid ${C.border}44`, transition: "background 0.2s" }}>
                                <td style={{ padding: 12, color: C.red, fontWeight: 700 }}>{t.id}</td>
                                <td style={{ padding: 12 }}>{t.title}</td>
                                <td style={{ padding: 12 }}>
                                    <span style={{ padding: "2px 6px", borderRadius: 3, background: `${C.violet}22`, color: C.violet, fontSize: 8 }}>{t.type}</span>
                                </td>
                                <td style={{ padding: 12 }}>
                                    <span style={{ color: t.status === "In Progress" ? C.gold : (t.status === "Open" ? C.cyan : C.green) }}>{t.status.toUpperCase()}</span>
                                </td>
                                <td style={{ padding: 12, color: C.muted }}>{t.assignee}</td>
                                <td style={{ padding: 12, textAlign: "right" }}>
                                    <button onClick={() => handleDelete(t.id)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 14 }}>×</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default function JIRASection() {
    return (
        <div>
            <SectionTitle icon="⬟" title="JIRA AUTOMATION ENGINE" sub="Zero-click ticket creation for every finding, error, and feature" color={C.red} />
            <AutomatedTicketHub />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {TICKET_TYPES.map(t => (
                    <Card key={t.type} color={t.color}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: t.color, marginBottom: 4, fontWeight: 700 }}>{t.icon} {t.type} TICKET</div>
                        <div style={{ fontSize: 9, color: C.muted, fontWeight: 600, marginBottom: 12 }}>Auto-created when:</div>
                        {t.triggers.map(tr => <div key={tr} style={{ fontSize: 9, color: C.text, fontWeight: 500, marginBottom: 3 }}>· {tr}</div>)}
                        <div style={{ height: 1, background: `${t.color}22`, margin: "10px 0" }} />
                        <div style={{ fontSize: 9, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Auto-populated fields:</div>
                        {t.fields.map(f => <div key={f} style={{ fontSize: 9, color: t.color, fontWeight: 600, marginBottom: 3 }}>✓ {f}</div>)}
                    </Card>
                ))}
            </div>

            <Card color={C.red} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: C.red, marginBottom: 16, fontWeight: 800, letterSpacing: "1px" }}>ADVANCED JIRA INTELLIGENCE</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                        ["Duplicate Detection", "Before creating, checks existing tickets via semantic similarity. Links related instead of duplicating."],
                        ["Smart Assignee Routing", "Reads team member expertise tags in JIRA. Routes security bugs to security engineer, UI bugs to frontend."],
                        ["Auto-Prioritization", "CVSS score for security, Core Web Vitals delta for perf, revenue impact estimate for business issues."],
                        ["Sprint Auto-Assignment", "Critical → current sprint. High → next sprint. Medium → backlog with suggested sprint date."],
                        ["Acceptance Criteria AI", "LLM generates testable acceptance criteria for every ticket automatically."],
                        ["Regression Prevention", "When fixing a bug, auto-generates a new test case and links it to the ticket."],
                    ].map(([t, d]) => (
                        <div key={t} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: 12 }}>
                            <div style={{ fontSize: 11, color: C.heading, fontWeight: 600, marginBottom: 4 }}>{t}</div>
                            <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6 }}>{d}</div>
                        </div>
                    ))}
                </div>
            </Card>

            <CodeBlock lang="python // jira_automation_agent.py" color={C.red} code={`class JIRAAutomationAgent:
    async def create_ticket_from_finding(self, finding: Finding) -> JiraIssue | None:
        existing = await self.find_semantic_duplicate(finding)
        if existing:
            await self.link_finding(existing, finding)
            return None

        ticket_content = await self.llm.generate(
            f"Create JIRA ticket for: {finding.type} [{finding.severity}]\\n"
            f"Evidence: {finding.evidence}\\n"
            "Output JSON: title, description, acceptance_criteria, labels[], components[]",
            format="json"
        )
        priority = self.map_severity_to_priority(finding.severity)
        sprint_id = await self.get_target_sprint(priority)
        assignee  = await self.route_to_expert(finding.type)

        issue = self.jira.create_issue(fields={
            "project":    {"key": JIRA_PROJECT},
            "issuetype":  {"name": self.map_to_issue_type(finding.type)},
            "summary":    ticket_content['title'],
            "priority":   {"name": priority},
            "labels":     ticket_content['labels'] + ["nexusqa","auto-generated"],
            "assignee":   {"accountId": assignee},
            "customfield_10020": sprint_id,
        })
        if finding.screenshot:
            self.jira.add_attachment(issue, finding.screenshot)
        return issue`} />
        </div>
    );
}
