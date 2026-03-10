import { useState, useEffect } from "react";
import { C } from "../constants";
import { SectionTitle, Card, CodeBlock } from "../components/UI";
import { debug } from "../api/client";
import { useNotify } from "../context/NotificationContext";

function AutonomousDebugger() {
    const { notify } = useNotify();
    const [log, setLog] = useState("TypeError: Cannot read property 'token' of undefined\n  at api/client.js:45:22\n  at processTicksAndRejections (node:internal/process/task_queues:95:5)");
    const [path, setPath] = useState("c:/intelliinspire/NEXUSQA");
    const [task, setTask] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const startDebug = async () => {
        setLoading(true); setTask(null); setStatus(null);
        try {
            const res = await debug.run(log, path);
            setTask(res.data.task_id);
        } catch (e) { alert("Debug initiation failed"); setLoading(false); }
    };

    useEffect(() => {
        if (!task || status?.status === "completed" || status?.status === "failed") return;
        const it = setInterval(async () => {
            try {
                const res = await debug.status(task);
                setStatus(res.data);
                if (res.data.status === "completed" || res.data.status === "failed") {
                    clearInterval(it); setLoading(false);
                }
            } catch (e) { clearInterval(it); setLoading(false); }
        }, 2000);
        return () => clearInterval(it);
    }, [task, status]);

    return (
        <Card color={C.pink} style={{ marginBottom: 20, borderLeft: `3px solid ${C.pink}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: C.heading, fontWeight: 700 }}>AUTONOMOUS SELF-HEALING ENGINE</div>
                <div style={{ fontSize: 9, color: C.pink, background: `${C.pink}11`, padding: "4px 10px", borderRadius: 8, fontWeight: 700 }}>CLAUDE 3.7 AGENT</div>
            </div>

            {!task ? (
                <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
                    <textarea value={log} onChange={e => setLog(e.target.value)} placeholder="Paste error log here..." style={{ width: "100%", height: 80, padding: "10px 14px", background: "rgba(0,0,0,0.05)", border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontFamily: "monospace", fontSize: 13, outline: "none", resize: "none" }} />
                    <div style={{ display: "flex", gap: 10 }}>
                        <input value={path} onChange={e => setPath(e.target.value)} placeholder="Codebase path..." style={{ flex: 1, padding: "10px 14px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontFamily: C.font, fontSize: 13, outline: "none" }} />
                        <button onClick={startDebug} disabled={loading} style={{ padding: "10px 24px", background: C.pink, color: "#fff", border: "none", borderRadius: 8, fontFamily: C.font, fontWeight: 900, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
                            {loading ? "WAKING AGENT..." : "FIX ERROR"}
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div style={{ height: 140, background: "rgba(0,0,0,0.1)", borderRadius: 8, padding: 14, overflowY: "auto", border: `1px solid ${C.pink}33`, marginBottom: 16 }}>
                        {status?.logs?.map((l, i) => (
                            <div key={i} style={{ fontSize: 10, color: l.includes("Thinking") ? C.violet : (l.includes("Fix") ? C.green : C.text), fontFamily: "monospace", marginBottom: 6 }}>
                                <span style={{ color: C.muted }}>[{new Date().toLocaleTimeString()}]</span> {l}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted, marginBottom: 8, fontFamily: "monospace" }}>
                        <span>AGENT STATUS: {status?.status?.toUpperCase() || "PENDING"}</span>
                        <span>{status?.progress || 0}%</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(0,0,0,0.1)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${status?.progress || 0}%`, height: "100%", background: C.pink, transition: "all 0.5s" }} />
                    </div>

                    {status?.status === "completed" && (
                        <div style={{ marginTop: 16, background: `${C.green}11`, border: `1px solid ${C.green}33`, borderRadius: 6, padding: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.green, fontSize: 10, fontWeight: 700, fontFamily: "monospace", marginBottom: 4 }}>
                                <span>✔ AUTO-FIX SUCCESSFUL</span>
                            </div>
                            <div style={{ fontSize: 9, color: C.text, fontFamily: "monospace" }}>
                                Applied changes to {status.result.files_changed[0]}. JIRA ticket {status.result.jira_ticket} updated.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

export default function IssueTrackerSection() {
    const { notify } = useNotify();
    const [filter, setFilter] = useState("all");

    const [issues, setIssues] = useState([
        { id: 1, type: "websites_seo", title: "Missing Meta Canonical Tags", status: "Auto-Fixing", severity: "High" },
        { id: 2, type: "websites_qa", title: "Checkout Flow: Selector Mismatch", status: "Healed", severity: "Critical" },
        { id: 3, type: "websites_dev", title: "Unused Dependency in package.json", status: "Draft PR", severity: "Low" },
        { id: 4, type: "software_qa", title: "API Logic: Incorrect Response Code", status: "Tracing", severity: "Medium" },
        { id: 5, type: "software_dev", title: "Memory Leak in Data Parser", status: "Analyzing", severity: "High" },
        { id: 6, type: "mobile_qa", title: "UAT: Touch Target Too Small", status: "Reporting", severity: "Medium" },
        { id: 7, type: "mobile_dev", title: "Firebase Config Initialization Fail", status: "Escalated", severity: "High" },
    ]);

    const [editing, setEditing] = useState(null);

    const updateIssue = (id, field, val) => {
        setIssues(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));
        if (field === "status") notify(`Issue #${id} status changed to ${val.toUpperCase()}`, "success");
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIssues(prev => prev.map(i => i.id === editing.id ? editing : i));
        notify(`Issue "${editing.title}" updated successfully`, "success");
        setEditing(null);
    };

    const filtered = filter === "all" ? issues : issues.filter(i => i.type.startsWith(filter));

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <SectionTitle icon="◈" title="UNIVERSAL ISSUE TRACKER" sub="Real-time multi-platform error detection & autonomous fixing" color={C.pink} style={{ margin: 0 }} />
                <div style={{ display: "flex", gap: 10 }}>
                    {["all", "websites", "software", "mobile"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: "8px 16px", borderRadius: 8, background: filter === f ? C.pink : C.panel,
                            border: `1px solid ${filter === f ? C.pink : C.border}`, color: filter === f ? "#fff" : C.muted,
                            fontSize: 10, fontWeight: 800, cursor: "pointer", textTransform: "uppercase"
                        }}>{f}</button>
                    ))}
                </div>
            </div>

            <AutonomousDebugger />

            <Card color={C.pink} style={{ marginBottom: 24 }}>
                <div style={{ padding: "0 10px 14px", borderBottom: `1px solid ${C.border}33`, display: "grid", gridTemplateColumns: "100px 1fr 120px 100px 180px", gap: 16, fontSize: 10, color: C.muted, fontWeight: 800 }}>
                    <span>TRACK</span>
                    <span>INTEL / ISSUE</span>
                    <span>STATUS</span>
                    <span>SEVERITY</span>
                    <span>ACTIONS</span>
                </div>
                {filtered.map(i => (
                    <div key={i.id} style={{ padding: "14px 10px", borderBottom: `1px solid ${C.border}22`, display: "grid", gridTemplateColumns: "100px 1fr 120px 100px 180px", gap: 16, alignItems: "center", fontSize: 12 }}>
                        <span style={{ fontSize: 9, color: C.pink, fontWeight: 700 }}>{i.type.split("_")[1].toUpperCase()}</span>
                        <span style={{ color: C.heading, fontWeight: 600 }}>{i.title}</span>
                        <span style={{ fontSize: 10, color: C.cyan, fontWeight: 700 }}>
                            <select
                                value={i.status}
                                onChange={(e) => updateIssue(i.id, "status", e.target.value)}
                                style={{ background: "transparent", border: "none", color: C.cyan, fontWeight: 700, fontSize: 10, cursor: "pointer", outline: "none" }}
                            >
                                {["Open", "Triaged", "Resolving", "Verified", "Escalated"].map(s => <option key={s} value={s} style={{ background: C.panel }}>● {s.toUpperCase()}</option>)}
                            </select>
                        </span>
                        <span style={{ fontSize: 10, color: i.severity === "Critical" ? C.red : (i.severity === "High" ? C.orange : C.green), fontWeight: 800 }}>{i.severity}</span>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => setEditing(i)} style={{ padding: "4px 8px", background: `${C.cyan}11`, border: `1px solid ${C.cyan}33`, color: C.cyan, borderRadius: 4, fontSize: 9, fontWeight: 800, cursor: "pointer" }}>EDIT INTEL</button>
                            <button style={{ padding: "4px 8px", background: `${C.red}11`, border: `1px solid ${C.red}33`, color: C.red, borderRadius: 4, fontSize: 9, fontWeight: 800, cursor: "pointer" }}>PURGE</button>
                        </div>
                    </div>
                ))}
            </Card>

            {/* Edit Issue Modal */}
            {editing && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
                    <form onSubmit={handleSave} style={{ width: 400, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 900, color: C.heading, marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>MODIFY <span style={{ color: C.pink }}>INTEL</span> #{editing.id}</div>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: 10, color: C.muted, fontWeight: 800, marginBottom: 8 }}>ISSUE TITLE</label>
                            <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} style={{ width: "100%", padding: "12px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 12 }} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 10, color: C.muted, fontWeight: 800, marginBottom: 8 }}>PLATFORM</label>
                                <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })} style={{ width: "100%", padding: "12px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 11 }}>
                                    <option value="websites_seo">Websites: SEO</option>
                                    <option value="websites_qa">Websites: QA</option>
                                    <option value="software_qa">Software: QA</option>
                                    <option value="mobile_qa">Mobile: QA</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 10, color: C.muted, fontWeight: 800, marginBottom: 8 }}>SEVERITY</label>
                                <select value={editing.severity} onChange={e => setEditing({ ...editing, severity: e.target.value })} style={{ width: "100%", padding: "12px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 11 }}>
                                    {["Low", "Medium", "High", "Critical"].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12 }}>
                            <button type="submit" style={{ flex: 1, padding: "12px", background: C.pink, color: "#000", border: "none", borderRadius: 8, fontWeight: 900, fontSize: 11, cursor: "pointer" }}>UPDATE INTEL →</button>
                            <button type="button" onClick={() => setEditing(null)} style={{ flex: 1, padding: "12px", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, fontWeight: 900, fontSize: 11, cursor: "pointer" }}>CANCEL</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <Card color={C.pink}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: C.pink, marginBottom: 12, fontWeight: 700 }}>TRACKED SOURCES</div>
                    {[
                        ["Websites", "SEO, QA & Autonomous Development tracks"],
                        ["Software Systems", "Core logic QA & Development patches"],
                        ["Mobile Apps", "iOS/Android UAT & Kotlin/Swift fixes"],
                        ["Runtime Logs", "stdout/stderr from multi-platform apps"],
                    ].map(([src, desc]) => (
                        <div key={src} style={{ display: "flex", gap: 10, marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ color: C.pink, fontSize: 12, flexShrink: 0 }}>◈</span>
                            <div>
                                <div style={{ fontSize: 12, color: C.heading, fontWeight: 600 }}>{src}</div>
                                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{desc}</div>
                            </div>
                        </div>
                    ))}
                </Card>
                <Card color={C.pink}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: C.pink, marginBottom: 12, fontWeight: 700 }}>INTEL PIPELINE</div>
                    {[
                        ["Stack Trace Analysis", "Extracts exact file:line origins across tracks"],
                        ["Root Cause Isolation", "Identifies if symptom is Web, App, or Logic based"],
                        ["Cross-Track Correlation", "Links web failures to back-end logic bugs"],
                        ["Impact Prediction", "Estimates severity across platforms"],
                    ].map(([cap, desc]) => (
                        <div key={cap} style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 12, color: C.heading, fontWeight: 600 }}>{cap}</div>
                            <div style={{ fontSize: 10, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
                        </div>
                    ))}
                </Card>
            </div>

            <CodeBlock lang="python // issue_tracker_agent.py" color={C.pink} code={`class IssueTrackerAgent:
    async def monitor_and_track(self, target: str, duration_sec: int = 300):
        error_buffer = []
        async with self.log_stream(target) as stream:
            async for log_line in stream:
                error = self.parse_error(log_line)
                if not error:
                    continue
                grouped = self.group_with_existing(error, error_buffer)
                if grouped:
                    grouped.count += 1
                    continue
                error_buffer.append(error)
                asyncio.create_task(self.analyze_and_act(error))

    async def analyze_and_act(self, error: TrackedError):
        analysis = await self.llm.generate(
            f"Analyze error: {error.message}\\nStack: {error.stack_trace}\\n"
            "JSON: root_cause, is_regression, fix_code, fix_confidence, severity",
            format="json"
        )
        blame = await self.git_blame(error.file, error.line)
        error.introduced_by = blame.author

        if analysis['fix_confidence'] > 0.85:
            await self.apply_fix(analysis['fix_code'], error)
            await self.create_pr(f"fix: auto-repair {error.error_type} in {error.file}")

        await JIRAAutomationAgent().create_ticket_from_finding(
            Finding(type="dev_error", severity=analysis['severity'],
                    description=analysis['root_cause'], assignee=blame.author_jira_id)
        )`} />
        </div>
    );
}
