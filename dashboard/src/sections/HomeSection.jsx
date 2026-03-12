import { useState, useEffect } from "react";
import { C } from "../constants";
import { Card } from "../components/UI";
import { automation } from "../api/client";
import { useNotify } from "../context/NotificationContext";

export default function HomeSection({ setActive }) {
    const { notify } = useNotify();
    const [running, setRunning] = useState(false);
    const [typed, setTyped] = useState("");
    const [stats, setStats] = useState({ status: "IDLE", last_run: "2026-03-11 14:12" });
    const [ticker, setTicker] = useState("SYSCALL: AGENT_01 DETECTING VECTORS[OK]");

    const runDaily = async () => {
        setRunning(true);
        try {
            await automation.runDaily();
            notify("NEXUS Daily Autonomous Sequence Commenced.", "success");
            setTimeout(() => {
                setRunning(false);
                setStats({ status: "OPTIMIZING", last_run: "JUST NOW" });
            }, 3000);
        } catch (e) {
            notify("Automation sequence failed to initialize.", "error");
            setRunning(false);
        }
    };

    const full = "nexus-qa --scan https://envoyortus.com --mode full --auto-heal --jira-sync";
    useEffect(() => {
        let i = 0;
        const t = setInterval(() => { setTyped(full.slice(0, i++)); if (i > full.length) clearInterval(t); }, 35);

        const tickLines = [
            "SYSCALL: AGENT_01 DETECTING VECTORS[OK]",
            "THREAD: SECURITY_AUDIT_X64 INITIALIZED",
            "MAPPING: DIRECTORY STRUCTURE EXTRACTION",
            "AI_THOUGHT: 'POSSIBLE DOM MANIPULATION IN LOGIN.JS'",
            "SYNC: JIRA-LINK-STABLE [NEXUS-778]",
            "CLEANUP: CACHE_REDUNDANCY PURGED",
            "SIGNAL: UAT_VALIDATION_PASSED [SUCCESS]"
        ];
        let ti = 0;
        const tt = setInterval(() => { setTicker(tickLines[ti++ % tickLines.length]); }, 4000);

        return () => { clearInterval(t); clearInterval(tt); };
    }, []);

    return (
        <div style={{ animation: "fadeIn 0.8s ease-out" }}>
            <style>{`
                @keyframes pulse-ring { 0% { transform: scale(.33); opacity: 0; } 100% { transform: scale(1.2); opacity: 0.1; } }
                @keyframes heartbeat { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px ${C.cyan}); } 50% { transform: scale(1.05); filter: drop-shadow(0 0 20px ${C.cyan}); } }
                @keyframes slideRight { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                .pillar-card:hover { transform: translateY(-5px); border-color: ${C.cyan} !important; border-width: 2px !important; }
            `}</style>

            {/* Hero Hub */}
            <div style={{
                borderRadius: 24, padding: "50px 40px",
                background: `radial-gradient(circle at 70% 30%, #0a192f 0%, #050e1a 100%)`,
                border: `1px solid ${C.border}`, marginBottom: 32,
                position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 40,
                boxShadow: `inset 0 0 100px rgba(0,229,255,0.03)`
            }}>
                <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                    <div style={{
                        padding: "6px 14px", border: `1px solid ${C.gold}44`, borderRadius: 100, fontSize: 9,
                        color: C.gold, letterSpacing: "2.5px", marginBottom: 24, fontWeight: 900, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,160,0,0.05)"
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, animation: "blink 1.5s infinite" }} />
                        CORE INTELLIGENCE SYSTEM [V4.2.0]
                    </div>

                    <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 52, margin: "0 0 12px 0", lineHeight: 1, color: C.heading }}>
                        NEXUS<span style={{ color: C.cyan }}>QA</span>
                    </h1>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.muted, marginBottom: 32, letterSpacing: "1px", maxWidth: 450, lineHeight: 1.6 }}>
                        Neural EXecution & Understanding System. Deploying <span style={{ color: C.cyan }}>Autonomous Agents</span> across your entire digital ecosystem for elite performance and absolute reliability.
                    </div>

                    <div style={{
                        background: "rgba(0,0,0,0.4)", border: `1px solid ${C.cyan}22`, borderRadius: 12,
                        padding: "20px", fontFamily: "monospace", fontSize: 14, color: C.cyan, marginBottom: 32,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)", position: "relative"
                    }}>
                        <div style={{ position: "absolute", top: -8, left: 14, background: "#050e1a", padding: "0 8px", fontSize: 8, color: C.muted, fontWeight: 900 }}>TERMINAL_INPUT</div>
                        <span style={{ color: C.muted }}>$ </span>{typed}
                        <span style={{ animation: "blink 1s infinite", borderRight: `2px solid ${C.cyan}`, marginLeft: 2 }}></span>
                    </div>

                    <div style={{ display: "flex", gap: 16 }}>
                        <button
                            onClick={() => setActive("scans")}
                            style={{ padding: "14px 28px", background: C.cyan, color: "#000", border: "none", borderRadius: 12, fontWeight: 900, cursor: "pointer", fontSize: 12, letterSpacing: 1, boxShadow: `0 8px 25px ${C.cyan}44` }}
                        >
                            INITIATE SCAN →
                        </button>
                        <button
                            onClick={runDaily}
                            style={{ padding: "14px 28px", background: "rgba(255,255,255,0.03)", color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 900, cursor: "pointer", fontSize: 12, letterSpacing: 1 }}
                        >
                            SCHEDULE AUDIT
                        </button>
                    </div>
                </div>

                {/* Intelligence Heartbeat visualization */}
                <div style={{ width: 300, height: 300, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "absolute", width: "100%", height: "100%", border: `1px solid ${C.cyan}11`, borderRadius: "50%", animation: "pulse-ring 3s infinite" }} />
                    <div style={{ position: "absolute", width: "80%", height: "80%", border: `1px solid ${C.cyan}22`, borderRadius: "50%", animation: "pulse-ring 4s infinite 1s" }} />
                    <svg viewBox="0 0 200 200" style={{ width: 180, height: 180, animation: "heartbeat 4s ease-in-out infinite", zIndex: 2 }}>
                        <defs>
                            <linearGradient id="nqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={C.cyan} />
                                <stop offset="100%" stopColor="#0044ff" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <circle cx="100" cy="100" r="40" fill="url(#nqGrad)" filter="url(#glow)" />
                        <path d="M100 20 L100 60 M100 140 L100 180 M20 100 L60 100 M140 100 L180 100" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                        <path d="M45 45 L75 75 M125 125 L155 155 M155 45 L125 75 M75 125 L45 155" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                    </svg>
                    <div style={{ position: "absolute", bottom: 20, width: "100%", textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: C.cyan, fontWeight: 900, letterSpacing: 2, textShadow: `0 0 10px ${C.cyan}` }}>SYSTEM_OK</div>
                        <div style={{ fontSize: 7, color: C.muted, marginTop: 4 }}>Uptime: 99.999%</div>
                    </div>
                </div>

                {/* Bottom Ticker */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 40px", background: "rgba(0,0,0,0.5)", borderTop: `1px solid ${C.border}`, display: "flex", gap: 30, zIndex: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: C.green, fontWeight: 900 }}>● LIVE_TELEM:</span>
                        <span key={ticker} style={{ fontSize: 10, color: C.text, fontFamily: "monospace", animation: "slideRight 0.3s ease-out" }}>{ticker}</span>
                    </div>
                </div>
            </div>

            {/* Metrics Overview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
                {[
                    { v: "18", l: "ACTIVE AGENTS", c: C.cyan, desc: "Distributed Intelligence" },
                    { v: "FULL", l: "HEALING COV.", c: C.green, desc: "Self-Repair Ratio" },
                    { v: "420k", l: "DAILY OPS", c: C.gold, desc: "Autonomous Signals" },
                    { v: "14ms", l: "LATENCY", c: C.violet, desc: "Analysis Speed" },
                ].map(s => (
                    <Card key={s.l} color={s.c} style={{ overflow: "hidden", position: "relative" }}>
                        <div style={{ position: "absolute", top: -10, right: -10, fontSize: 40, opacity: 0.03 }}>{s.l[0]}</div>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 28, fontWeight: 900, color: s.c, marginBottom: 4 }}>{s.v}</div>
                        <div style={{ fontSize: 9, color: C.heading, fontWeight: 900, letterSpacing: 1 }}>{s.l}</div>
                        <div style={{ fontSize: 8, color: C.muted, marginTop: 4, fontWeight: 600 }}>{s.desc}</div>
                    </Card>
                ))}
            </div>

            {/* 4 Pillars Control Center */}
            <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
                {[
                    { id: "home", name: "WEBSITE INTEL", status: "READY", color: C.cyan, link: "scans", det: "Full DOM & SEO Audit" },
                    { id: "sw", name: "SOFTWARE SYS", status: "STABLE", color: C.violet, link: "agents", det: "Logic & Binary Tracing" },
                    { id: "mobile", name: "MOBILE APPS", status: "ACTIVE", color: C.gold, link: "mobile", det: "Touch & UX Heuristics" },
                    { id: "pos", name: "POS SYSTEM", status: "ACTIVE", color: C.green, link: "software", det: "Hardware Integration" },
                ].map(p => (
                    <div
                        key={p.id}
                        className="pillar-card"
                        onClick={() => setActive(p.link)}
                        style={{
                            flex: 1, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, textAlign: "center",
                            cursor: "pointer", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        }}
                    >
                        {/* <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div> */}
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 900, color: C.heading, marginBottom: 4 }}>{p.name}</div>
                        <div style={{ fontSize: 8, color: C.muted, marginBottom: 16 }}>{p.det}</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9, color: p.color, fontWeight: 900, letterSpacing: 1, background: `${p.color}15`, padding: "4px 12px", borderRadius: 100 }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.color }} />
                            {p.status}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
                {/* Capability Matrix */}
                <Card color={C.gold}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, color: C.gold, marginBottom: 20, letterSpacing: "1px", fontWeight: 900, display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16 }}>◈</span> NEXUS INTEGRATED CAPABILITIESMAP
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        {[
                            ["AUTO-DEBUG ENGINE", "Self-healing tests that detect and fix errors automatically"],
                            ["SEO AUTO-REPAIR", "Autonomous meta-data correction and pattern optimization"],
                            ["JIRA SYNC LAYER", "Zero-click ticket lifecycle management strictly for agents"],
                            ["DEV TRACKER", "Real-time codebase analysis with instant fix proposals"],
                            ["UNIVERSAL AGENT", "Cross-platform QA for Web, Mobile, and POS systems"],
                            ["LLM AGNOSTIC", "Switch backends (OpenAI/Gemini/Ollama) with 1 click"]
                        ].map(([t, d]) => (
                            <div key={t}>
                                <div style={{ fontSize: 10, color: C.heading, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ width: 4, height: 4, background: C.gold, borderRadius: "50%" }} />
                                    {t}
                                </div>
                                <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>{d}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Master Controller Card */}
                <Card color={C.violet} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontSize: 10, color: C.violet, fontWeight: 900, letterSpacing: "1px", marginBottom: 12 }}>MASTER CONTROL PROTOCOL</div>
                        <div style={{ fontSize: 18, color: C.heading, fontWeight: 900, fontFamily: "'Orbitron', sans-serif", lineHeight: 1.3 }}>DAILY AUTONOMOUS SYSTEM AUDIT</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 12, lineHeight: 1.6 }}>Initialize a full-stack sequence across all active tracks to identify regressions and security vulnerabilities.</div>
                    </div>
                    <div style={{ marginTop: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted, marginBottom: 10, fontWeight: 700 }}>
                            <span>SYSTEM LOAD: 22%</span>
                            <span>LAST RUN: {stats.last_run}</span>
                        </div>
                        <button
                            onClick={runDaily}
                            disabled={running}
                            style={{
                                width: "100%", padding: "16px", background: running ? "rgba(255,255,255,0.05)" : C.violet,
                                color: running ? C.muted : "#fff", border: "none", borderRadius: 12, fontWeight: 900,
                                cursor: "pointer", fontSize: 11, letterSpacing: 2, transition: "all 0.3s"
                            }}
                        >
                            {running ? "AGENT_HANDSHAKE..." : "▶ DEPLOY AUDIT AGENTS"}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
