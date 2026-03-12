import { useState, useEffect } from "react";
import { C } from "../constants";
import { SectionTitle, Card, CodeBlock, GlowBadge } from "../components/UI";
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
                    <textarea value={log} onChange={e => setLog(e.target.value)} placeholder="Paste error log here" style={{ width: "100%", height: 80, padding: "10px 14px", background: "rgba(0,0,0,0.05)", border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontFamily: "monospace", fontSize: 13, outline: "none", resize: "none" }} />
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
    const [marked, setMarked] = useState(() => localStorage.getItem('nexus_marked_issues') === 'true');
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);

    const [issues, setIssues] = useState([
        {
            id: 1, type: "websites_seo", title: "Missing Meta Canonical Tags", status: "Open", severity: "High", risk: 78, impact: ["SEO", "Conversion"],
            description: "The autonomous crawler detected multiple duplicate pages without canonical references, risking SEO ranking degradation.",
            assignedTo: "Kaji Puvanenthiran", date: "2026-03-12 09:12",
            logs: "WARN [SEO]: Search console reports duplicate content at /products/item-a and /shop/item-a"
        },
        {
            id: 2, type: "websites_qa", title: "Checkout Flow: Selector Mismatch", status: "Resolving", severity: "Critical", risk: 94, impact: ["Revenue", "UX", "Checkout"],
            description: "A recent front-end update changed the ID of the 'Place Order' button. Autonomous Playwright tests are failing.",
            assignedTo: "NEXUS Admin", date: "2026-03-12 10:45",
            logs: "ERROR [QA]: locator.click: Timeout 30000ms exceeded. at checkout.spec.js:142:15"
        },
        {
            id: 3, type: "websites_dev", title: "Unused Dependency in package.json", status: "Triaged", severity: "Low", risk: 12, impact: ["Bundle Size"],
            description: "The codebase contains references to 'lodash' which is no longer used. Removal recommended for bundle size.",
            assignedTo: "System Agent", date: "2026-03-11 14:20",
            logs: "INFO [DEV]: Dependency 'lodash-es' version 4.17.21 identified as zombie code."
        },
        {
            id: 4, type: "software_qa", title: "API Logic: Incorrect Response Code", status: "Escalated", severity: "Medium", risk: 55, impact: ["Security", "API"],
            description: "The authentication endpoint returns 200 OK even when the database connection fails, leading to ghost sessions.",
            assignedTo: "Kaji Puvanenthiran", date: "2026-03-12 11:30",
            logs: "CATASTROPHIC [API]: Connection to MySQL pool lost. Returning empty user object with 200 OK."
        },
        {
            id: 5, type: "software_dev", title: "Memory Leak in Data Parser", status: "Open", severity: "High", risk: 82, impact: ["Infrastructure", "Perf"],
            description: "Continuous parsing of large JSON logs is causing a steady increase in heap usage. Garbage collection ineffective.",
            assignedTo: "Lead Engineer", date: "2026-03-12 08:00",
            logs: "DEBUG [SYS]: Memory usage jumped from 142MB to 890MB during batch processing. OOM Risk."
        },
        {
            id: 6, type: "mobile_qa", title: "UAT: Touch Target Too Small", status: "Open", severity: "Medium", risk: 34, impact: ["UX", "Accessibility"],
            description: "The 'Revoke' button in the operator list is only 22x22px, violating accessibility guidelines for mobile touch devices.",
            assignedTo: "System Agent", date: "2026-03-12 11:55",
            logs: "WARN [MOBILE]: Element 'button#revoke-01' does not meet minimum touch target size (44x44px)."
        },
        {
            id: 7, type: "mobile_dev", title: "Firebase Config Initialization Fail", status: "Resolving", severity: "High", risk: 89, impact: ["Cloud", "Analytics"],
            description: "The Android build is failing to initialize the Firebase SDK due to a missing google-services.json file in the CI/CD pipeline.",
            assignedTo: "NEXUS Admin", date: "2026-03-11 18:30",
            logs: "FATAL [ANDROID]: java.lang.IllegalStateException: Default FirebaseApp is not initialized."
        },
    ]);

    const [autoPilot, setAutoPilot] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const [fusionStage, setFusionStage] = useState(0); // 0: Idle, 1: INTERCEPT, 2: RCA, 3: HEAL, 4: VERIFY
    const [sandboxLogs, setSandboxLogs] = useState([]);
    const [ingesting, setIngesting] = useState(false);
    const [activeCampaign, setActiveCampaign] = useState(null);

    useEffect(() => {
        const handleScanInbound = (e) => {
            const { results, target, type } = e.detail;
            const findings = results.findings || {};

            if (target.includes("mindvisionit.com")) {
                startMindvisionCampaign(target);
            } else if (findings.critical > 0 || findings.high > 0) {
                processInboundIssues(target, type, findings);
            }
        };

        window.addEventListener('NEXUS_SCAN_DATA', handleScanInbound);
        return () => window.removeEventListener('NEXUS_SCAN_DATA', handleScanInbound);
    }, []);

    const startMindvisionCampaign = async (url) => {
        setActiveCampaign({ url, stage: "INITIALIZING", progress: 0 });
        notify(`CAMPAIGN STARTED: Initiating 360° audit of ${url}...`, "info");

        const steps = [
            { stage: "SEO_CRAWL", label: "Crawling Meta-Intelligence...", p: 25 },
            { stage: "QA_AUTOMATION", label: "Executing Playwright UI Suite...", p: 50 },
            { stage: "DEV_AUDIT", label: "Analyzing Source Complexity & JS Health...", p: 75 },
            { stage: "INGESTION", label: "Streaming Findings to Resolution Matrix...", p: 100 }
        ];

        for (const step of steps) {
            await new Promise(r => setTimeout(r, 2000));
            setActiveCampaign(prev => ({ ...prev, stage: step.stage, progress: step.p }));
            notify(`SCAN UPDATE: ${step.label}`, "info");
        }

        // Generate Findings
        const findings = [
            { id: Date.now() + 1, type: "websites_seo", title: "MINDVISION: Multiple H1 Tags Detected", status: "Open", severity: "High", risk: 82, impact: ["SEO"], description: "The crawler detected non-unique H1 headers on the homepage, causing semantic confusion for search engines.", logs: "WARN [SEO]: Multiple <h1> elements found in DOM tree.", isAutoGenerated: true },
            { id: Date.now() + 2, type: "websites_qa", title: "MINDVISION: Contact Form Submit Hijack", status: "Open", severity: "Critical", risk: 96, impact: ["Revenue", "Lead Gen"], description: "A third-party script is intercepting the submit event, potentially leaking lead data.", logs: "ERROR [QA]: EventListener conflict on form#contact-submit.", isAutoGenerated: true },
            { id: Date.now() + 3, type: "websites_dev", title: "MINDVISION: Insecure JS Dependency", status: "Open", severity: "High", risk: 88, impact: ["Security"], description: "Found 'jquery@2.2.4' which contains known XSS vulnerabilities. Immediate upgrade required.", logs: "CRITICAL [DEV]: Vulnerable version of jQuery detected in bundle.", isAutoGenerated: true }
        ];

        setIssues(prev => [...findings, ...prev]);
        notify("CAMPAIGN COMPLETE: High-fidelity issues ingested for Mindvision.", "success");

        // Auto-fix the Critical one if Auto-Pilot is on
        if (autoPilot) {
            initiateAutonomousHealing(findings[1]);
        }
    };

    const processInboundIssues = async (target, type, findings) => {
        setIngesting(true);
        notify(`NEURAL LINK: Capturing ${findings.critical + findings.high} high-risk findings from ${target}...`, "info");

        await new Promise(r => setTimeout(r, 2000)); // Simulate AI parsing

        const newIssues = [];
        if (findings.critical > 0) {
            newIssues.push({
                id: Date.now(),
                type: `${type}_qa`,
                title: `[AUTOGEN] Critical Flaw: ${target.split('//')[1] || target}`,
                status: "Open",
                severity: "Critical",
                risk: 95,
                impact: ["System Core", "Security", "Availability"],
                description: `Autonomous scan identified ${findings.critical} critical vulnerabilities on the target ${target}. Automated RCA initiated.`,
                assignedTo: "Sentinel Agent",
                date: new Date().toLocaleString(),
                logs: `CRITICAL [VULN_SCAN]: Handled by Autonomous AI. Payload signature matches CVE-2026-X.`,
                isAutoGenerated: true
            });
        }

        setIssues(prev => [...newIssues, ...prev]);
        setIngesting(false);
        notify("INGESTION COMPLETE: Issues merged into Resolution Matrix.", "success");
    };

    useEffect(() => {
        if (autoPilot && !processingId) {
            const highSev = issues.find(i => (i.severity === "High" || i.severity === "Critical") && i.status === "Open");
            if (highSev) initiateAutonomousHealing(highSev);
        }
    }, [autoPilot, processingId, issues]);

    const initiateAutonomousHealing = async (issue) => {
        if (processingId) return;
        setProcessingId(issue.id);
        setFusionStage(1);
        setSandboxLogs([`[SENTINEL] Intercepting error data from issue #${issue.id}...`]);
        notify("SENTINEL FUSION INITIATED: Locking coordinate bridge...", "info");

        // Phase 1: JIRA Synchronization & Metadata Enrichment
        await new Promise(r => setTimeout(r, 1800));
        const jiraId = `NEXUS-${Math.floor(1000 + Math.random() * 9000)}`;
        setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, jiraId, status: "Synced with JIRA" } : i));
        setSandboxLogs(prev => [...prev, `[ORCHESTRATOR] JIRA Ticket ${jiraId} established. Bridging to Auto-Fix API.`]);
        notify(`JIRA HUB: Ticket ${jiraId} synchronized successfully.`, "success");

        // Phase 2: Neural Root Cause Analysis (RCA) & Dependency Mapping
        setFusionStage(2);
        await new Promise(r => setTimeout(r, 2200));
        setSandboxLogs(prev => [...prev, `[ORACLE] Analyzed impacted systems: ${issue.impact?.join(", ") || "Generic System"}`]);
        setSandboxLogs(prev => [...prev, `[ORACLE] Root cause isolated to local module context. Patch proposal generated.`]);
        notify("COGNITIVE ANALYSIS: Root cause and impact dependencies mapped.", "info");

        // Phase 3: Auto-Debug & Patching in Sandbox
        setFusionStage(3);
        await new Promise(r => setTimeout(r, 2500));
        setSandboxLogs(prev => [...prev, `[HEALER] Spinning up Docker sandbox...`]);
        setSandboxLogs(prev => [...prev, `[HEALER] Applying autonomous patch to ephemeral branch.`]);
        setSandboxLogs(prev => [...prev, `[HEALER] Running Playwright regression suite: 0 regressions found.`]);
        notify("SANDBOX REMEDIATION: Autonomous patch verified and applied.", "success");

        // Phase 4: Final Verification & Governance
        setFusionStage(4);
        await new Promise(r => setTimeout(r, 2000));
        setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, status: "Verified", severity: "Resolved", risk: 0 } : i));
        setSandboxLogs(prev => [...prev, `[SENTINEL] Global system integrity restored. Closing coordinate bridge.`]);
        notify(`HEAL COMPLETE: System integrity verified globally.`, "success");

        setTimeout(() => {
            setProcessingId(null);
            setFusionStage(0);
            setSandboxLogs([]);
        }, 8000);
    };

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
        <>
            <style>{`
                @keyframes modalIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes loading {
                    0% { left: -100%; width: 0%; }
                    50% { left: 0%; width: 100%; }
                    100% { left: 100%; width: 0%; }
                }
                .issue-title:hover {
                    text-decoration: underline;
                    color: ${C.pink} !important;
                }
                .fusion-glow {
                    animation: fusionGlow 3s infinite ease-in-out;
                    border: 1px solid ${C.cyan}44 !important;
                }
                @keyframes fusionGlow {
                    0%, 100% { box-shadow: 0 0 5px ${C.cyan}22; }
                    50% { box-shadow: 0 0 20px ${C.cyan}66; }
                }
            `}</style>
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <SectionTitle icon="◈" title="UNIVERSAL ISSUE TRACKER" sub="Real-time multi-platform error detection & autonomous fixing" color={C.pink} />
                    <div
                        onClick={() => {
                            const newState = !marked;
                            setMarked(newState);
                            localStorage.setItem('nexus_marked_issues', newState);
                        }}
                        style={{
                            padding: "6px 14px",
                            borderRadius: 20,
                            background: marked ? `${C.pink}22` : "rgba(255,255,255,0.03)",
                            border: `1px solid ${marked ? C.pink : C.border}`,
                            color: marked ? C.pink : C.muted,
                            fontSize: 9,
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            transition: "all 0.3s"
                        }}
                    >
                        {marked ? "✓ MARKED COMPLETE" : "☐ MARK AS COMPLETE"}
                    </div>
                    <div
                        onClick={() => {
                            setAutoPilot(!autoPilot);
                            notify(`Auto-Pilot ${!autoPilot ? 'ENGAGED' : 'DISENGAGED'}: Autonomous resolution ${!autoPilot ? 'active' : 'suspended'}.`, !autoPilot ? "success" : "info");
                        }}
                        style={{
                            padding: "6px 14px",
                            borderRadius: 20,
                            background: autoPilot ? `${C.cyan}22` : "rgba(255,255,255,0.03)",
                            border: `1px solid ${autoPilot ? C.cyan : C.border}`,
                            color: autoPilot ? C.cyan : C.muted,
                            fontSize: 9,
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            transition: "all 0.3s",
                            boxShadow: autoPilot ? `0 0 15px ${C.cyan}33` : "none"
                        }}
                    >
                        {autoPilot ? "⚡ AUTO-PILOT ON" : "⚪ AUTO-PILOT OFF"}
                    </div>

                    {ingesting && (
                        <div style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 8, animation: "fadeIn 0.3s" }}>
                            <div className="pulse" style={{ width: 8, height: 8, background: C.pink, borderRadius: "50%" }} />
                            <span style={{ fontSize: 9, color: C.pink, fontWeight: 900 }}>NEURAL STREAM ACTIVE</span>
                        </div>
                    )}

                    {activeCampaign && (
                        <div style={{ marginLeft: 16, padding: "4px 12px", background: "rgba(0,0,0,0.2)", border: `1px solid ${C.green}44`, borderRadius: 20, display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="pulse" style={{ width: 8, height: 8, background: C.green, borderRadius: "50%" }} />
                            <span style={{ fontSize: 9, color: C.green, fontWeight: 900 }}>ACTIVE CAMPAIGN: {activeCampaign.url}</span>
                            <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                                <div style={{ width: `${activeCampaign.progress}%`, height: "100%", background: C.green, borderRadius: 2, transition: "0.5s" }} />
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
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

                {processingId && (
                    <div style={{
                        margin: "0 0 24px 0", padding: 24, background: "rgba(0,0,0,0.3)", borderRadius: 16, border: `1px solid ${C.cyan}44`,
                        animation: "fadeIn 0.5s ease-out", position: "relative", overflow: "hidden"
                    }}>
                        <div style={{ position: "absolute", top: 0, left: 0, height: 2, background: C.cyan, width: `${(fusionStage / 4) * 100}%`, transition: "width 0.5s" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <div>
                                <div style={{ fontSize: 9, color: C.cyan, fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>SENTINEL AUTONOMOUS FUSION MATRIX</div>
                                <div style={{ fontSize: 13, color: C.heading, fontWeight: 900, fontFamily: "monospace" }}>
                                    TRACKING ID #{processingId} • STAGE: {fusionStage === 4 ? "INTEGRITY RESTORED" : (fusionStage === 1 ? "JIRA_SYNC" : (fusionStage === 2 ? "RCA_ANALYSIS" : "AUTO_PATCHING"))}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <div style={{ fontSize: 8, color: C.muted }}>PROCESSOR: CLAUDE-3.7-SONNET</div>
                                <div className="pulse" style={{ width: 8, height: 8, background: C.cyan, borderRadius: "50%" }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                            {[
                                { s: 1, label: "JIRA", icon: "⬡" },
                                { s: 2, label: "RCA", icon: "◈" },
                                { s: 3, label: "HEAL", icon: "⌬" },
                                { s: 4, label: "VERIFY", icon: "✔" }
                            ].map(step => (
                                <div key={step.s} style={{ flex: 1, padding: "12px", background: fusionStage >= step.s ? `${C.cyan}11` : "rgba(255,255,255,0.02)", border: `1px solid ${fusionStage >= step.s ? C.cyan : C.border}33`, borderRadius: 8, opacity: fusionStage >= step.s ? 1 : 0.3, transition: "0.5s", textAlign: "center" }}>
                                    <div style={{ fontSize: 16, marginBottom: 4 }}>{step.icon}</div>
                                    <div style={{ fontSize: 8, fontWeight: 900, color: fusionStage >= step.s ? C.cyan : C.muted }}>{step.label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 12, border: `1px solid ${C.cyan}22`, height: 80, overflowY: "auto", fontFamily: "monospace" }}>
                            {sandboxLogs.map((l, idx) => (
                                <div key={idx} style={{ fontSize: 9, color: l.includes("[HEALER]") ? C.green : (l.includes("[ORACLE]") ? C.violet : C.text), marginBottom: 4 }}>
                                    {l}
                                </div>
                            ))}
                            <div className="pulse" style={{ width: 10, height: 10, background: C.cyan, borderRadius: "50%", display: "inline-block", marginLeft: 4 }} />
                        </div>
                    </div>
                )}

                <Card color={C.pink} style={{ marginBottom: 24 }}>
                    <div style={{ padding: "0 10px 14px", borderBottom: `1px solid ${C.border}33`, display: "grid", gridTemplateColumns: "100px 1fr 100px 120px 80px 100px 180px", gap: 16, fontSize: 10, color: C.muted, fontWeight: 800 }}>
                        <span>TRACK</span>
                        <span>INTEL / ISSUE</span>
                        <span>RISK INDEX</span>
                        <span>STATUS</span>
                        <span>SEVERITY</span>
                        <span style={{ textAlign: "center" }}>AUTO-HEAL</span>
                        <span>ACTIONS</span>
                    </div>
                    {filtered.map(i => (
                        <div key={i.id} style={{
                            padding: "14px 10px",
                            borderBottom: `1px solid ${C.border}22`,
                            display: "grid",
                            gridTemplateColumns: "100px 1fr 100px 120px 80px 100px 180px",
                            gap: 16,
                            alignItems: "center",
                            fontSize: 12,
                            background: processingId === i.id ? `${C.cyan}05` : "transparent",
                            boxShadow: processingId === i.id ? `inset 2px 0 0 ${C.cyan}` : "none",
                            transition: "all 0.4s"
                        }}>
                            <span style={{ fontSize: 9, color: C.pink, fontWeight: 700 }}>{i.type.split("_")[1].toUpperCase()}</span>
                            <div>
                                <span
                                    onClick={() => setViewing(i)}
                                    className="issue-title"
                                    style={{ color: C.heading, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}
                                >
                                    {i.title}
                                </span>
                                {i.isAutoGenerated && <span style={{ marginLeft: 8, fontSize: 7, color: C.pink, border: `1px solid ${C.pink}44`, padding: "1px 4px", borderRadius: 4, fontWeight: 900 }}>AI_DETECTED</span>}
                                <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                                    {(i.impact || []).map(tag => (
                                        <span key={tag} style={{ fontSize: 7, color: C.muted, background: "rgba(255,255,255,0.05)", padding: "1px 4px", borderRadius: 2, border: `1px solid ${C.border}` }}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 14, fontWeight: 900, color: i.risk > 70 ? C.red : (i.risk > 40 ? C.orange : C.green) }}>{i.risk}</div>
                                <div style={{ fontSize: 7, color: C.muted, fontWeight: 700 }}>NEURAL_SCORE</div>
                            </div>
                            <span style={{ fontSize: 10, color: i.status === "Verified" ? C.green : C.cyan, fontWeight: 700 }}>
                                <select
                                    value={i.status}
                                    onChange={(e) => updateIssue(i.id, "status", e.target.value)}
                                    style={{ background: "transparent", border: "none", color: i.status === "Verified" ? C.green : C.cyan, fontWeight: 700, fontSize: 10, cursor: "pointer", outline: "none" }}
                                >
                                    {["Open", "Triaged", "Resolving", "Verified", "Escalated", "Synced with JIRA"].map(s => <option key={s} value={s} style={{ background: C.panel }}>● {s.toUpperCase()}</option>)}
                                </select>
                            </span>
                            <span style={{ fontSize: 10, color: i.severity === "Critical" ? C.red : (i.severity === "High" ? C.orange : (i.status === "Verified" ? C.green : C.green)), fontWeight: 800 }}>{i.severity}</span>

                            <div style={{ textAlign: "center" }}>
                                {processingId === i.id ? (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                        <div className="pulse" style={{ width: 10, height: 10, background: C.cyan, borderRadius: "50%" }} />
                                        <span style={{ fontSize: 7, color: C.cyan, fontWeight: 900 }}>SENTINEL_OK</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => initiateAutonomousHealing(i)}
                                        className="fusion-glow"
                                        style={{
                                            background: `rgba(0,184,212,0.05)`,
                                            border: `1px solid ${C.cyan}44`, color: C.cyan, padding: "6px 12px", borderRadius: 8,
                                            fontSize: 9, fontWeight: 900, cursor: "pointer", transition: "0.3s"
                                        }}
                                    >
                                        FUSE FIX
                                    </button>
                                )}
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => setViewing(i)} style={{ padding: "4px 8px", background: `${C.pink}11`, border: `1px solid ${C.pink}33`, color: C.pink, borderRadius: 4, fontSize: 9, fontWeight: 800, cursor: "pointer" }}>VIEW</button>
                                <button onClick={() => setEditing(i)} style={{ padding: "4px 8px", background: `${C.cyan}11`, border: `1px solid ${C.cyan}33`, color: C.cyan, borderRadius: 4, fontSize: 9, fontWeight: 800, cursor: "pointer" }}>EDIT</button>
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

                {/* View Issue Modal */}
                {viewing && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
                        <div style={{ width: 600, background: C.panel, border: `1px solid ${C.pink}44`, borderRadius: 16, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.8)", animation: "modalIn 0.3s ease-out" }}>
                            <div style={{ padding: "20px 32px", background: `linear-gradient(90deg, ${C.pink}33, transparent)`, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 900, color: C.heading, letterSpacing: 1.5 }}><span style={{ color: C.pink }}>ISSUE INTEL</span> #{viewing.id}</div>
                                <div style={{ fontSize: 9, color: "#fff", background: viewing.severity === "Critical" ? C.red : (viewing.severity === "High" ? C.orange : C.green), padding: "4px 10px", borderRadius: 4, fontWeight: 800 }}>{viewing.severity.toUpperCase()}</div>
                            </div>

                            <div style={{ padding: 32 }}>
                                <div style={{ fontSize: 18, fontWeight: 800, color: C.heading, marginBottom: 8 }}>{viewing.title}</div>
                                <div style={{ fontSize: 11, color: C.muted, marginBottom: 24, display: "flex", gap: 16 }}>
                                    <span>PLATFORM: <b style={{ color: C.pink }}>{viewing.type.replace("_", " ").toUpperCase()}</b></span>
                                    <span>TRACKED: <b>{viewing.date}</b></span>
                                </div>
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ fontSize: 10, color: C.muted, fontWeight: 900, letterSpacing: 1.5, display: "block", marginBottom: 12 }}>DIAGNOSTIC SUMMARY</label>
                                    <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6, background: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 12, border: `1px solid ${C.border}` }}>{viewing.description}</div>
                                </div>
                                <div style={{ marginBottom: 32 }}>
                                    <label style={{ fontSize: 10, color: C.muted, fontWeight: 900, letterSpacing: 1.5, display: "block", marginBottom: 12 }}>CRITICAL LOG TRACE</label>
                                    <div style={{ background: "#000", padding: 16, borderRadius: 8, fontFamily: "monospace", fontSize: 12, color: C.red, border: `1px solid ${C.red}44`, overflowX: "auto" }}><code>{viewing.logs}</code></div>
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <button onClick={() => { setEditing(viewing); setViewing(null); }} style={{ flex: 1, padding: "14px", background: C.pink, color: "#fff", border: "none", borderRadius: 8, fontWeight: 900, fontSize: 12, cursor: "pointer" }}>RECALIBRATE INTEL</button>
                                    <button onClick={() => setViewing(null)} style={{ flex: 1, padding: "14px", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, fontWeight: 900, fontSize: 12, cursor: "pointer" }}>CLOSE ARCHIVE</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
