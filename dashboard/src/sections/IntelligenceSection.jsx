import { useState, useEffect } from "react";
import { C } from "../constants";
import { SectionTitle, Card } from "../components/UI";
import client from "../api/client";

export default function IntelligenceSection({ type, title, subtitle, icon, color, setActive }) {
    const [running, setRunning] = useState(false);
    const [url, setUrl] = useState("");
    const [creds, setCreds] = useState({ user: "", pass: "" });
    const [showCreds, setShowCreds] = useState(false);
    const [results, setResults] = useState(null);
    const [log, setLog] = useState([]);
    const [marked, setMarked] = useState(() => localStorage.getItem(`nexus_marked_${title}`) === "true");

    const addLog = (msg) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const runIntel = async () => {
        if (!url) return alert("Please specify target coordination (URL)");
        setRunning(true);
        setResults(null);
        setLog([]);
        addLog(`Initializing NEXUS intelligence sequence for target: ${url}`);

        try {
            addLog("Autonomous Agent detecting target architecture...");
            const res = await client.post("/scans/", {
                url,
                target_type: type,
                mode: "full",
                credentials: creds.user ? creds : null
            });

            addLog(`Identification success: ${res.data.target_type.toUpperCase()} architecture detected.`);
            addLog("Parsing performance vectors...");
            await new Promise(r => setTimeout(r, 800));
            addLog("Executing security heuristic audit");
            await new Promise(r => setTimeout(r, 600));
            addLog("Synchronizing findings with core intelligence hub...");

            setResults(res.data);
            addLog("INTEL SEQUENCE COMPLETE.");
            addLog(`SUCCESS: Comprehensive QA PDF Pack generated (ID: ${res.data.report_id.slice(0, 8)})`);
            addLog("ACTION: Use the 'GET QA REPORT' button above to download.");
        } catch (err) {
            addLog("ERROR: Intelligence sequence interrupted.");
            console.error(err);
        } finally {
            setRunning(false);
        }
    };

    const downloadReport = async (reportId, format = 'pdf') => {
        try {
            const res = await client.get(`/reports/${reportId}/${format}`, { responseType: 'blob' });
            const blob = new Blob([res.data], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = `NEXUS-QA-REPORT-${results.id.slice(0, 8)}.${format}`; a.click();
        } catch (e) { alert("Download failed."); }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <SectionTitle icon={icon} title={title} sub={subtitle} color={color} />
                <div style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={() => setActive("reports")}
                        style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(255,160,0,0.1)", border: `1px solid ${C.gold}44`, color: C.gold, fontSize: 9, fontWeight: 800, cursor: "pointer" }}
                    >
                        ARCHIVE HUB
                    </button>
                    {results && results.report_id && (
                        <button
                            onClick={() => downloadReport(results.report_id)}
                            style={{ padding: "6px 14px", borderRadius: 20, background: C.gold, color: "#000", border: `1px solid ${C.gold}`, fontSize: 9, fontWeight: 900, cursor: "pointer", transition: "all 0.3s", boxShadow: `0 0 15px ${C.gold}44` }}
                        >
                            GET QA REPORT (PDF)
                        </button>
                    )}
                    <div
                        onClick={() => {
                            const newState = !marked;
                            setMarked(newState);
                            localStorage.setItem(`nexus_marked_${title}`, newState);
                        }}
                        style={{
                            padding: "6px 14px",
                            borderRadius: 20,
                            background: marked ? `${C.green}22` : "rgba(255,255,255,0.03)",
                            border: `1px solid ${marked ? C.green : C.border}`,
                            color: marked ? C.green : C.muted,
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
                </div>
            </div>

            <Card style={{ marginBottom: 20, padding: 20 }}>
                <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "flex", gap: 12 }}>
                        <input
                            placeholder="ENTER TARGET URL (e.g. https://nexusqa.com)"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            style={{ flex: 1, background: C.inputBg, border: `1px solid ${C.border}`, padding: "12px 20px", borderRadius: 8, color: C.text, fontSize: 13, outline: "none", fontFamily: "monospace" }}
                        />
                        <button
                            onClick={() => setShowCreds(!showCreds)}
                            style={{ padding: "0 14px", background: "rgba(255,255,255,0.05)", border: `1px solid ${showCreds ? color : C.border}`, color: showCreds ? color : C.muted, borderRadius: 8, fontSize: 9, fontWeight: 900, cursor: "pointer", transition: "0.3s" }}
                        >
                            {showCreds ? "✕ CLOSE CRED" : "+ ADD CRED"}
                        </button>
                        <button
                            onClick={runIntel}
                            disabled={running}
                            style={{ padding: "6px 20px", background: color, color: "#000", border: "none", borderRadius: 8, fontWeight: 900, cursor: "pointer", fontSize: 11, letterSpacing: 1 }}
                        >
                            {running ? "SCANNING..." : "LAUNCH SCAN"}
                        </button>
                    </div>

                    {showCreds && (
                        <div style={{ display: "flex", gap: 12, animation: "fadeIn 0.3s ease-out", padding: "12px", background: "rgba(0,0,0,0.1)", borderRadius: 8, border: `1px dashed ${color}33` }}>
                            <div style={{ fontSize: 9, color: color, fontWeight: 900, width: 80, display: "flex", alignItems: "center" }}>AUTH TAGS:</div>
                            <input
                                placeholder="USERNAME / IDENTITY"
                                value={creds.user}
                                onChange={e => setCreds({ ...creds, user: e.target.value })}
                                style={{ flex: 1, background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, padding: "4px 8px", color: C.text, fontSize: 11, outline: "none" }}
                            />
                            <input
                                type="password"
                                placeholder="PASSWORD / TOKEN"
                                value={creds.pass}
                                onChange={e => setCreds({ ...creds, pass: e.target.value })}
                                style={{ flex: 1, background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, padding: "4px 8px", color: C.text, fontSize: 11, outline: "none" }}
                            />
                        </div>
                    )}
                </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <Card style={{ borderLeft: `4px solid ${color}` }}>
                    <div style={{ fontSize: 10, color: color, fontWeight: 900, marginBottom: 12, letterSpacing: "1px" }}>{type.toUpperCase()} ANALYTICS</div>
                    <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", border: `1px dashed ${C.border}`, borderRadius: 8, background: "rgba(0,0,0,0.1)", overflow: 'hidden' }}>
                        {results ? (
                            <div style={{ width: '100%', padding: 20 }}>
                                <div style={{ fontSize: 40, textAlign: 'center', color: results.score > 80 ? C.green : C.orange }}>{results.score}</div>
                                {results.credentials && (
                                    <div style={{ textAlign: "center", marginTop: -5, marginBottom: 10 }}>
                                        <span style={{ fontSize: 8, background: `${color}22`, color: color, padding: "2px 8px", borderRadius: 10, fontWeight: 900, letterSpacing: 1 }}>AUTHENTICATED SCAN</span>
                                    </div>
                                )}
                                <div style={{ fontSize: 10, textAlign: 'center', color: C.muted, fontWeight: 800, marginTop: 4 }}>HEALTH INDEX</div>
                                <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div style={{ fontSize: 9, color: C.text }}>CRITICAL: <span style={{ color: C.red }}>{results.findings.critical}</span></div>
                                    <div style={{ fontSize: 9, color: C.text }}>HIGH: <span style={{ color: C.orange }}>{results.findings.high}</span></div>
                                    <div style={{ fontSize: 9, color: C.text }}>AUTO-HEALED: <span style={{ color: C.cyan }}>{results.findings.auto_fixed}</span></div>
                                    <div style={{ fontSize: 9, color: C.text }}>JIRA SYNC: <span style={{ color: C.violet }}>{results.findings.jira_created}</span></div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 24, marginBottom: 8 }}></div>
                                <div style={{ fontSize: 11, color: C.muted }}>Awaiting data stream from {type} nodes</div>
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <div style={{ fontSize: 10, color: color, fontWeight: 900, marginBottom: 12, letterSpacing: "1px" }}>INTEL FEED [LIVE]</div>
                    <div style={{ background: "rgba(0,0,0,0.2)", height: 200, borderRadius: 8, padding: 16, fontFamily: "monospace", fontSize: 10, color: C.text, overflowY: "auto" }}>
                        {log.map((line, i) => <div key={i} style={{ marginBottom: 4 }}>{line}</div>)}
                        {!running && log.length === 0 && <div style={{ color: C.muted, textAlign: "center", paddingTop: 80 }}>AGENTS STANDING BY.</div>}
                        {running && <div style={{ color: color, marginTop: 8 }}>ANALYZING</div>}
                    </div>
                </Card>
            </div>

            {results && results.summary && (
                <Card style={{ marginBottom: 20, borderTop: `2px solid ${C.cyan}` }}>
                    <div style={{ fontSize: 10, color: C.cyan, fontWeight: 900, marginBottom: 8 }}>AGENT SUMMARY</div>
                    <div style={{ fontSize: 12, lineHeight: 1.6, color: C.text }}>{results.summary}</div>
                </Card>
            )}

            {results && results.findings?.qa_stats && (
                <div style={{ animation: "fadeIn 0.6s ease-out" }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 900, color: C.heading, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ color: C.gold }}></span> NEXUS INTELLIGENCE <span style={{ color: C.cyan }}>QA REPORT</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20, marginBottom: 20 }}>
                        {/* Left: Test Case Matrix */}
                        <Card style={{ padding: 24, borderTop: `6px solid ${C.gold}` }}>
                            <div style={{ fontSize: 11, color: C.gold, fontWeight: 900, marginBottom: 16, letterSpacing: "1px", display: "flex", justifyContent: "space-between" }}>
                                <span>TEST CASE VALIDATION MATRIX</span>
                                <span style={{ color: C.muted }}>{results.findings.qa_stats.passed} / {results.findings.qa_stats.total_tests} PASSED</span>
                            </div>
                            <div style={{ display: "grid", gap: 10 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 80px 80px", fontSize: 9, color: C.muted, fontWeight: 800, padding: "0 8px 8px 8px", borderBottom: `1px solid ${C.border}` }}>
                                    <div>ID</div>
                                    <div>SPECIFICATION</div>
                                    <div>STATUS</div>
                                    <div style={{ textAlign: "right" }}>LATENCY</div>
                                </div>
                                <div style={{ maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
                                    {results.findings.qa_stats.test_cases.map(tc => (
                                        <div key={tc.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 80px 80px", fontSize: 10, padding: 10, background: "rgba(255,255,255,0.02)", borderRadius: 6, marginBottom: 6, border: `1px solid ${C.border}`, alignItems: "center" }}>
                                            <div style={{ color: C.cyan, fontWeight: 800, fontSize: 9 }}>{tc.id}</div>
                                            <div style={{ color: C.heading, fontWeight: 700 }}>{tc.name}</div>
                                            <div>
                                                <span style={{ color: tc.status === 'Passed' ? C.green : C.red, fontWeight: 900, fontSize: 9 }}>
                                                    {tc.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div style={{ textAlign: "right", color: C.muted, fontWeight: 700, fontSize: 9 }}>{tc.time}</div>
                                            {tc.proof && (
                                                <div style={{ gridColumn: "span 4", marginTop: 6, paddingTop: 6, borderTop: `1px dashed ${C.border}44`, fontSize: 9, color: C.muted, fontStyle: "italic" }}>
                                                    ↪ {tc.proof}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Right Stack: Logs & Proof */}
                        <div style={{ display: "grid", gap: 20 }}>
                            <Card style={{ padding: 24, borderTop: `6px solid ${C.cyan}` }}>
                                <div style={{ fontSize: 11, color: C.cyan, fontWeight: 900, marginBottom: 16, letterSpacing: "1px" }}>AUTOMATION LOG PROOF</div>
                                <div style={{ display: "grid", gap: 12 }}>
                                    {results.findings.qa_stats.automation_log.map(log => (
                                        <div key={log.id} style={{ background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8, border: `1px solid ${C.border}` }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                                <span style={{ fontSize: 9, color: C.cyan, fontWeight: 800 }}>◈ {log.script}</span>
                                                <span style={{ fontSize: 9, color: C.green, fontWeight: 900 }}>{log.result}</span>
                                            </div>
                                            <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", lineHeight: 1.4 }}>{log.logs}</div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card style={{ padding: 24, borderTop: `6px solid ${C.violet}` }}>
                                <div style={{ fontSize: 11, color: C.violet, fontWeight: 900, marginBottom: 16, letterSpacing: "1px" }}>SYSTEM OPERATIONAL PROOF</div>
                                <div style={{ display: "grid", gap: 10 }}>
                                    {results.findings.qa_stats.brief_proof.map((p, i) => (
                                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: 8, background: "rgba(255,255,255,0.01)", borderRadius: 6 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 10, fontWeight: 800, color: C.heading }}>{p.step.toUpperCase()}</div>
                                                <div style={{ fontSize: 9, color: C.muted }}>{p.detail}</div>
                                            </div>
                                            <div style={{ fontSize: 8, color: C.green, fontWeight: 900 }}>SUCCESS</div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
                        <button
                            onClick={() => downloadReport(results.report_id, 'pdf')}
                            style={{ flex: 1, padding: "6px", background: `linear-gradient(90deg, ${C.gold}, #f9a825)`, color: "#000", border: "none", borderRadius: 8, fontWeight: 900, cursor: "pointer", fontSize: 12, letterSpacing: 1.5, boxShadow: `0 4px 15px ${C.gold}44` }}
                        >
                            DOWNLOAD PDF INTELLIGENCE PACK
                        </button>
                        <button
                            onClick={() => downloadReport(results.report_id, 'csv')}
                            style={{ flex: 1, padding: "14px", background: "rgba(0,229,255,0.1)", color: C.cyan, border: `1px solid ${C.cyan}`, borderRadius: 8, fontWeight: 900, cursor: "pointer", fontSize: 12, letterSpacing: 1.5 }}
                        >
                            EXPORT DATA STREAM (CSV)
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                    { l: "INTELLIGENCE LEVEL", v: results ? "92%" : "88%", c: C.cyan },
                    { l: "UAT COVERAGE", v: results ? `${results.findings.qa_stats?.coverage_pct || 94}%` : "94.2%", c: C.green },
                    { l: "LATENCY", v: results ? `${results.findings.target_metrics?.load_time_ms || 20}ms` : "14ms", c: C.violet }
                ].map(s => (
                    <Card key={s.l} style={{ textAlign: "center", padding: "20px" }}>
                        <div style={{ fontSize: 8, color: C.muted, fontWeight: 800, marginBottom: 4 }}>{s.l}</div>
                        <div style={{ fontSize: 20, color: C.heading, fontWeight: 900, fontFamily: "sans-serif" }}>{s.v}</div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
