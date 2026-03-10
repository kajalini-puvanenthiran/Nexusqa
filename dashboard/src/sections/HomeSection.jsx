import { useState, useEffect } from "react";
import { C } from "../constants";
import { Card } from "../components/UI";
import { automation } from "../api/client";
import { useNotify } from "../context/NotificationContext";

export default function HomeSection({ setActive }) {
    const { notify } = useNotify();
    const [running, setRunning] = useState(false);
    const [typed, setTyped] = useState("");
    const [stats, setStats] = useState({ status: "IDLE", last_run: "—" });

    const runDaily = async () => {
        setRunning(true);
        try {
            await automation.runDaily();
            notify("NEXUS Daily Autonomous Sequence Commenced.", "success");
            setTimeout(() => {
                setRunning(false);
                setStats({ status: "OPTIMIZING", last_run: "NOW" });
            }, 3000);
        } catch (e) {
            notify("Automation sequence failed to initialize.", "error");
            setRunning(false);
        }
    };
    const full = "nexus-qa --scan https://yourapp.com --mode full --auto-fix --jira-sync";
    useEffect(() => {
        let i = 0;
        const t = setInterval(() => { setTyped(full.slice(0, i++)); if (i > full.length) clearInterval(t); }, 40);
        return () => clearInterval(t);
    }, []);

    return (
        <div>
            {/* Hero */}
            <div style={{
                borderRadius: 12, padding: "40px 36px",
                background: `linear-gradient(135deg, ${C.panel} 0%, #050e1a 100%)`,
                border: `1px solid ${C.cyan}22`, marginBottom: 28,
                position: "relative", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: 0, right: 0, width: 300, height: 300,
                    background: `radial-gradient(circle at center, ${C.cyan}08 0%, transparent 70%)`,
                    pointerEvents: "none",
                }} />
                <div style={{
                    display: "inline-block", padding: "4px 14px",
                    border: `1px solid ${C.gold}44`, borderRadius: 6, fontSize: 10,
                    color: C.gold, letterSpacing: "1.5px", marginBottom: 20, fontWeight: 700,
                }}>✦ NEXUS INTELLIGENCE — UNIFIED DEVELOPMENT & OPTIMIZATION SYSTEM</div>

                <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 42, margin: "0 0 8px 0", lineHeight: 1.1, color: C.heading }}>
                    NEXUS<span style={{ color: C.cyan }}>QA</span>
                </h1>
                <div style={{ fontWeight: 500, fontSize: 14, color: C.muted, marginBottom: 24, letterSpacing: "0.5px" }}>
                    Neural EXecution & Understanding System for Quality Assurance
                </div>

                <div style={{
                    background: C.inputBg, border: `1px solid ${C.cyan}33`, borderRadius: 8,
                    padding: "16px 20px", fontFamily: "monospace", fontSize: 13, color: C.cyan, marginBottom: 28,
                }}>
                    <span style={{ color: C.muted }}>$ </span>{typed}
                    <span style={{ animation: "blink 1s infinite", borderRight: `2px solid ${C.cyan}`, marginLeft: 1 }}>|</span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {[
                        ["🔍", "Auto Scan & Test"], ["🐛", "Auto Debug & Fix"], ["🔒", "Security Hardening"],
                        ["📈", "SEO Intelligence"], ["🎫", "JIRA Integration"], ["🧠", "Multi-LLM Engine"],
                        ["📊", "Issue Tracking"], ["🏧", "POS & Software"],
                    ].map(([icon, label]) => (
                        <div key={label} style={{
                            padding: "8px 14px", border: `1px solid ${C.border}`, borderRadius: 6,
                            fontSize: 11, color: C.text, background: "rgba(0,0,0,0.1)", fontWeight: 500,
                        }}>{icon} {label}</div>
                    ))}
                </div>
            </div>

            {/* Automation Master Controller */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                <Card color={C.cyan} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px" }}>
                    <div>
                        <div style={{ fontSize: 10, color: C.cyan, fontWeight: 900, letterSpacing: "1px", marginBottom: 4 }}>MASTER AUTOMATION CONTROL</div>
                        <div style={{ fontSize: 18, color: C.heading, fontWeight: 900, fontFamily: "'Orbitron', sans-serif" }}>DAILY RUN PROTOCOL</div>
                    </div>
                    <button
                        onClick={runDaily}
                        disabled={running}
                        style={{ padding: "12px 24px", background: running ? C.border : C.cyan, color: "#000", border: "none", borderRadius: 8, fontWeight: 900, cursor: "pointer", fontSize: 11 }}
                    >
                        {running ? "INITIALIZING AGENTS..." : "▶ LAUNCH DAILY RUN"}
                    </button>
                </Card>
                <Card color={C.violet} style={{ display: "flex", gap: 24, alignItems: "center", padding: "20px 24px" }}>
                    <div style={{ textAlign: "center", minWidth: 80 }}>
                        <div style={{ fontSize: 10, color: C.violet, fontWeight: 900, marginBottom: 4 }}>STATUS</div>
                        <div style={{ fontSize: 14, color: stats.status === 'IDLE' ? C.muted : C.green, fontWeight: 900 }}>● {stats.status}</div>
                    </div>
                    <div style={{ height: 30, width: 1, background: `${C.border}44` }} />
                    <div>
                        <div style={{ fontSize: 10, color: C.muted, fontWeight: 900, marginBottom: 4 }}>LAST AGENTIC AUDIT</div>
                        <div style={{ fontSize: 12, color: C.heading, fontWeight: 700 }}>{stats.last_run}</div>
                    </div>
                </Card>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                {[
                    { v: "18", l: "AI Agents", c: C.cyan },
                    { v: "FULL", l: "Auto-Fix Coverage", c: C.green },
                    { v: "∞", l: "LLM Backends", c: C.violet },
                    { v: "0-Click", l: "JIRA Integration", c: C.gold },
                ].map(s => (
                    <Card key={s.l} color={s.c}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 26, fontWeight: 900, color: s.c }}>{s.v}</div>
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontWeight: 600 }}>{s.l}</div>
                    </Card>
                ))}
            </div>

            {/* What's New */}
            <Card color={C.gold} style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, color: C.gold, marginBottom: 14, letterSpacing: "1px", fontWeight: 700 }}>
                    ✦ NEW CAPABILITIES IN THIS VERSION
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                        ["Auto-Debug Engine", "Self-healing tests that detect, analyze and fix errors automatically"],
                        ["SEO Auto-Repair Agent", "Detects SEO issues and applies fixes using SEO tools + LLM rewrites"],
                        ["JIRA Zero-Click Tickets", "Every finding auto-creates, labels, prioritizes and assigns JIRA tickets"],
                        ["Dev Issue Tracker", "Real-time code error tracking, stack trace analysis, and fix suggestions"],
                        ["Free LLM Mode", "OpenAI free tier + Ollama local models — no paid API required"],
                        ["POS & Software Testing", "Specialized agents for hardware integration, legacy systems, and POS peripherals"],
                        ["Universal Test Generator", "Auto-generates test suites for any system without prior knowledge"],
                        ["Editable Reports", "In-browser report editing with real-time re-scan on changes"],
                    ].map(([t, d]) => (
                        <div key={t} style={{ display: "flex", gap: 10 }}>
                            <span style={{ color: C.gold, flexShrink: 0 }}>✦</span>
                            <div>
                                <div style={{ fontSize: 12, color: C.heading, fontWeight: 600 }}>{t}</div>
                                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{d}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* 4 Pillars Status */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                    { id: "home", icon: "🌐", name: "WEBSITES", status: "READY", color: C.cyan, link: "scans" },
                    { id: "sw", icon: "💿", name: "SOFTWARE", status: "STABLE", color: C.violet, link: "agents" },
                    { id: "mobile", icon: "📱", name: "MOBILE APP", status: "ACTIVE", color: C.gold, link: "mobile" },
                    { id: "pos", icon: "🏧", name: "POS SYSTEM", status: "ACTIVE", color: C.green, link: "pos" },
                ].map(p => (
                    <div
                        key={p.id}
                        style={{
                            background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, textAlign: "center",
                            boxShadow: `0 0 20px ${p.color}05`, position: "relative",
                        }}
                    >
                        <div style={{ fontSize: 26, marginBottom: 10 }}>{p.icon}</div>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 900, color: C.heading, marginBottom: 6, letterSpacing: "1px" }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: p.color, fontWeight: 700, letterSpacing: "1px", marginBottom: 14 }}>● {p.status}</div>
                        <button
                            onClick={() => setActive(p.link)}
                            className="pillar-btn"
                            style={{
                                width: "100%", padding: "8px 0", background: "transparent", border: `1px solid ${p.color}44`,
                                color: p.color, fontSize: 10, fontWeight: 700, cursor: "pointer", borderRadius: 6,
                                transition: "all 0.2s"
                            }}
                        >
                            RUN DIAGNOSTICS
                        </button>
                    </div>
                ))}
            </div>
            <style>{`.pillar-btn:hover{background:${C.cyan}11; border-color:${C.cyan}}`}</style>
        </div>
    );
}
