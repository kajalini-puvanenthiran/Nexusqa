import { useState, useEffect } from "react";
import { C } from "../constants";
import { SectionTitle, Card, CodeBlock, GlowBadge } from "../components/UI";
import { useNotify } from "../context/NotificationContext";

const FUSION_HEAL_STEPS = [
    { s: "INTERCEPT", desc: "Sentinel socket caught runtime exception" },
    { s: "RCA_EXTRACT", desc: "Neural trace identifying root cause" },
    { s: "JIRA_SYNC", desc: "Generating coordinate bridge to JIRA" },
    { s: "AUTO_PATCH", desc: "Claude-3.7 formulating neural patch" },
    { s: "INTEGRITY_CHECK", desc: "Verifying global system restore" }
];

export default function AutoDebugSection() {
    const { notify } = useNotify();
    const [track, setTrack] = useState("websites");
    const [healing, setHealing] = useState(false);
    const [step, setStep] = useState(-1);
    const [telemetry, setTelemetry] = useState([]);

    const startHealing = () => {
        setHealing(true);
        setStep(0);
        setTelemetry([`[${new Date().toLocaleTimeString()}] SENTINEL_READY: Standing by for intercept`]);
        notify("LOCKING COORDINATES: Autonomous healing sequence engaged.", "success");
    };

    useEffect(() => {
        if (healing && step < FUSION_HEAL_STEPS.length - 1) {
            const timer = setTimeout(() => {
                const nextStep = step + 1;
                setStep(nextStep);
                setTelemetry(prev => [
                    `[${new Date().toLocaleTimeString()}] ${FUSION_HEAL_STEPS[nextStep].s.toUpperCase()}: ${FUSION_HEAL_STEPS[nextStep].desc}`,
                    ...prev
                ].slice(0, 8));
            }, 2000);
            return () => clearTimeout(timer);
        } else if (step === FUSION_HEAL_STEPS.length - 1) {
            notify("FUSION COMPLETE: System integrity restored and synced to origin.", "success");
        }
    }, [healing, step]);

    return (
        <div style={{ animation: "fadeIn 0.6s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <SectionTitle icon="⚙" title="AUTO DEBUG ENGINE" sub="Self-healing tests, autonomous error detection, and neural code fixing" color={C.orange} style={{ margin: 0 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "1px" }}>ACTIVE TRACK:</span>
                    <select value={track} onChange={e => setTrack(e.target.value)} style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.orange, padding: "8px 16px", borderRadius: 8, fontSize: 11, fontWeight: 800, outline: "none", cursor: "pointer" }}>
                        <option value="websites">WEBSITES (DOM/SEO)</option>
                        <option value="software">SOFTWARE (API/CORE)</option>
                        <option value="mobile">MOBILE (UI/TOUCH)</option>
                    </select>
                </div>
            </div>

            {/* Live Debug Workshop */}
            <Card color={C.orange} style={{ marginBottom: 24, padding: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                        <div style={{ fontSize: 11, color: C.orange, fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: 1.5 }}>SENTINEL AUTO-DEEP-FIX ENGINE</div>
                        <div style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>Neural Trace v5.0 • Real-time self-healing coordinate sync</div>
                    </div>
                    {!healing ? (
                        <button onClick={startHealing} style={{ padding: "10px 20px", background: C.orange, color: "#000", border: 'none', borderRadius: 8, fontWeight: 900, cursor: "pointer", fontSize: 10, boxShadow: `0 0 15px ${C.orange}44` }}>▶ START FUSION SCAN</button>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="pulse" style={{ width: 8, height: 8, background: C.green, borderRadius: "50%" }} />
                            <span style={{ fontSize: 10, color: C.green, fontWeight: 900 }}>SENTINEL_OK_ACTIVE</span>
                            <button onClick={() => { setHealing(false); setStep(-1); setTelemetry([]); }} style={{ padding: "4px 10px", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: 8, borderRadius: 4, cursor: "pointer" }}>CANCEL</button>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
                    {FUSION_HEAL_STEPS.map((s, i) => {
                        const isCurrent = step === i;
                        const isDone = step > i;
                        return (
                            <div key={s.s} style={{ flex: 1, position: "relative" }}>
                                <div style={{
                                    height: 3, background: isDone ? C.green : (isCurrent ? C.orange : "rgba(255,255,255,0.05)"),
                                    transition: "all 0.5s", borderRadius: 2, marginBottom: 12
                                }} />
                                <div style={{ textAlign: "center", opacity: isCurrent || isDone ? 1 : 0.2, transition: "0.4s" }}>
                                    <div style={{ fontSize: 18, marginBottom: 6 }}>{isDone ? "✔" : s.i}</div>
                                    <div style={{ fontSize: 9, fontWeight: 900, color: isCurrent ? C.orange : (isDone ? C.green : C.text) }}>{s.s.toUpperCase()}</div>
                                    <div style={{ fontSize: 7, color: C.muted }}>{s.desc}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {healing && (
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
                        <div style={{ display: "grid", gap: 16 }}>
                            {step >= 1 && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "fadeIn 0.5s ease-out" }}>
                                    <div style={{ position: "relative", background: "#020810", borderRadius: 8, border: `1px solid ${C.red}22`, padding: 16 }}>
                                        <div style={{ fontSize: 8, color: C.red, fontWeight: 900, marginBottom: 8 }}>IDENTIFIED FLAW [SENTINEL_LOCK]</div>
                                        <pre style={{ fontSize: 9, color: "#8ab8cc", margin: 0, overflowX: "auto", fontFamily: "monospace", lineHeight: 1.5 }}>
                                            {`// checkout.js
const total = items.map(i => i.price);
// Error: Cannot call price of undefined`}
                                        </pre>
                                    </div>
                                    <div style={{ position: "relative", background: "#020810", borderRadius: 8, border: `1px solid ${C.green}22`, padding: 16 }}>
                                        <div style={{ fontSize: 8, color: C.green, fontWeight: 900, marginBottom: 8 }}>NEURAL PATCH [DEPLOYED]</div>
                                        <pre style={{ fontSize: 9, color: "#8ab8cc", margin: 0, overflowX: "auto", fontFamily: "monospace", lineHeight: 1.5 }}>
                                            {`// checkout.js
const total = items
  .filter(i => !!i)
  .map(i => i.price);`}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {step >= 2 && (
                                <div style={{ background: "rgba(0,184,212,0.05)", border: `1px solid ${C.cyan}44`, borderRadius: 8, padding: 16, animation: "fadeIn 0.5s ease-out" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                        <div style={{ fontSize: 8, color: C.cyan, fontWeight: 900, letterSpacing: 1 }}>JIRA AUTO-SYNC BRIDGE</div>
                                        <GlowBadge color={C.cyan} small>ID: NEXUS-AUTO-404</GlowBadge>
                                    </div>
                                    <div style={{ fontSize: 9, color: C.text, fontFamily: "monospace", lineHeight: 1.4 }}>
                                        "Bridged neural Trace to JIRA Hub. Auto-comment posted: Fix coord (x,y) applied by Claude-3.7 Agent. Verification status: PENDING_RE_RUN."
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ background: "#010409", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
                            <div style={{ fontSize: 8, color: C.muted, fontWeight: 900, letterSpacing: 1, borderBottom: `1px solid ${C.border}`, paddingBottom: 8, marginBottom: 12 }}>NEURAL TRACE TELEMETRY</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {telemetry.map((t, i) => (
                                    <div key={i} style={{ fontSize: 9, color: i === 0 ? C.orange : (t.includes("FUSION") ? C.green : C.muted), fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t}</div>
                                ))}
                                {healing && step < FUSION_HEAL_STEPS.length - 1 && <div className="blink" style={{ fontSize: 9, color: C.orange, fontFamily: "monospace" }}>[BUSY] ANALYZING</div>}
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                {[
                    {
                        title: "Test Error Types Handled", color: C.orange, items: [
                            "Selector not found (DOM change) → AI re-discovers element",
                            "Network timeout → Adds retry logic + wait conditions",
                            "JS TypeError / ReferenceError → Traces to source line",
                            "React hydration mismatch → Flags SSR/CSR inconsistency",
                            "Auth token expired during test → Auto-refreshes session",
                            "Race condition in async tests → Adds proper await patterns",
                            "Viewport-dependent failures → Detects responsive breakage",
                        ]
                    },
                    {
                        title: "Code Debug Capabilities", color: C.red, items: [
                            "Parses Python / JS / TS / Java stack traces",
                            "Identifies exact file, line, and function of error",
                            "Checks git blame for who introduced the bug",
                            "Correlates with recent commits / PRs",
                            "Suggests minimal diff to fix the error",
                            "Generates unit test to prevent regression",
                            "Posts fix as GitHub PR or JIRA comment automatically",
                        ]
                    },
                ].map(box => (
                    <Card key={box.title} color={box.color}>
                        <div style={{ fontFamily: "monospace", fontSize: 10, color: box.color, marginBottom: 12, letterSpacing: "0.5px", fontWeight: 700 }}>{box.title}</div>
                        {box.items.map((item, i) => (
                            <div key={i} style={{ fontSize: 10, color: C.text, marginBottom: 6, display: "flex", gap: 6, fontFamily: "monospace", lineHeight: 1.5 }}>
                                <span style={{ color: box.color, flexShrink: 0 }}>▸</span> {item}
                            </div>
                        ))}
                    </Card>
                ))}
            </div>

            <CodeBlock lang="python // sentinel_fusion_logic.py" color={C.orange} code={`class SentinelFusionBridge:
    async def bridge_and_fix(self, issue_id: str, context: dict) -> FusionResult:
        # Step 1: Neural Intercept from Tracker
        trace = await SentinelOracle.extract_neural_trace(issue_id)
        
        # Step 2: Auto-Synchronize with JIRA Hub
        jira_ticket = await JIRAAgent().sync_fusion_coord(trace)
        
        # Step 3: Trigger Claude-3.7 Code Remediation
        fix_proposal = await DeepDebugAgent.generate_patch(trace.logs, context['repo'])
        
        if fix_proposal.confidence > 0.95:
            # Step 4: Autonomous Patching & Verification
            await fix_proposal.apply()
            verification = await self.run_sentinel_verify(fix_proposal.target_module)
            
            if verification.success:
                await jira_ticket.update_status("FIXED", comment="Sentinel_Fusion_Patch_01 Applied.")
                return FusionResult(status="HEALED", ticket=jira_ticket.id)
                
        # Escalation Loop if confidence is low
        return FusionResult(status="ESCALATED_TO_HUMAN")`} />
        </div>
    );
}
