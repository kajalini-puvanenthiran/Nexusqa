import { useState, useEffect } from "react";
import { C } from "../constants";
import { SectionTitle, GlowBadge } from "../components/UI";

const AGENTS = [
    {
        id: "ui", icon: "🖥️", name: "UI/UX AGENT", color: C.cyan, cat: "Testing",
        tests: ["Visual regression (screenshot diff)", "Form validation completeness", "Cross-browser rendering", "Responsive breakpoints 320px→4K"],
        tools: ["Playwright", "Selenium Grid"], autofix: "Auto-regenerates failing selectors using AI DOM analysis"
    },
    {
        id: "api", icon: "🔌", name: "API TESTING AGENT", color: C.violet, cat: "Testing",
        tests: ["OpenAPI contract validation", "Auth boundary testing", "Response schema checks", "Rate limit behavior"],
        tools: ["Schemathesis", "Postman"], autofix: "Auto-generates missing request examples and schema patches"
    },
    {
        id: "sec", icon: "🔒", name: "SECURITY AGENT", color: C.red, cat: "Security",
        tests: ["OWASP Top 10 full suite", "SQL/NoSQL injection", "XSS / CSRF / SSRF", "Broken auth detection"],
        tools: ["OWASP ZAP", "Nuclei"], autofix: "Generates security header patches and sanitization code"
    },
    {
        id: "perf", icon: "⚡", name: "PERFORMANCE AGENT", color: C.gold, cat: "Performance",
        tests: ["Core Web Vitals (LCP/CLS/INP)", "Load test 100→100K users", "Stress test breakpoint", "Memory leak detection"],
        tools: ["Locust", "k6", "Lighthouse"], autofix: "Auto-generates caching rules and lazy-load patches"
    },
    {
        id: "a11y", icon: "♿", name: "ACCESSIBILITY AGENT", color: "#64b5f6", cat: "Quality",
        tests: ["WCAG 2.1 AA compliance", "Screen reader compat", "Keyboard navigation", "Color contrast ratio"],
        tools: ["axe-core", "Pa11y"], autofix: "Auto-generates missing ARIA attributes and alt text via LLM"
    },
    {
        id: "seo", icon: "📈", name: "SEO AGENT", color: C.green, cat: "SEO",
        tests: ["Title/meta quality", "Open Graph tags", "JSON-LD structured data", "Canonical URLs"],
        tools: ["Screaming Frog API", "Lighthouse"], autofix: "SEO Repair Agent activates — see SEO Engine section"
    },
    {
        id: "dbg", icon: "🐛", name: "AUTO-DEBUG AGENT", color: C.orange, cat: "Debug",
        tests: ["Console error capture", "Network failure detection", "JS runtime exception trace", "API 5xx error pattern"],
        tools: ["Playwright console hooks"], autofix: "Full autonomous debug loop — see Auto Debug section"
    },
    {
        id: "jira", icon: "🎫", name: "JIRA AUTOMATION AGENT", color: "#ff7043", cat: "Tracking",
        tests: ["Finding severity classification", "Duplicate ticket detection", "Sprint capacity check", "Assignee routing"],
        tools: ["JIRA REST API v3"], autofix: "Creates, labels, assigns and prioritizes tickets with zero human input"
    },
    {
        id: "mob", icon: "📱", name: "MOBILE AGENT", color: "#ffcc02", cat: "Mobile",
        tests: ["iOS/Android UI automation", "Offline mode behavior", "Push notification testing", "Deep link validation"],
        tools: ["Appium", "XCUITest"], autofix: "Generates device-specific layout patches and manifest fixes"
    },
    {
        id: "sw", icon: "💿", name: "SOFTWARE SYSTEM AGENT", color: "#00e5ff", cat: "Systems",
        tests: ["Desktop app installation", "Registry integrity", "Local file system IO", "CPU/RAM spike monitoring"],
        tools: ["WinAppDriver", "AutoIt"], autofix: "Auto-generates installer patches and config repairs"
    },
    {
        id: "pos", icon: "🏧", name: "POS SYSTEM AGENT", color: "#69f0ae", cat: "Systems",
        tests: ["USB/Thermal printer integration", "Barcode scanner baud rate", "Credit card handshake", "Inventory sync latency"],
        tools: ["JPOS Emulator", "Cucumber-JVM"], autofix: "Fixes communication protocol errors and data sync logic"
    }
];

export default function AgentsSection() {
    const [open, setOpen] = useState(null);
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        const interval = setInterval(() => {
            const newStatuses = {};
            AGENTS.forEach(a => {
                const rand = Math.random();
                newStatuses[a.id] = rand > 0.8 ? "ACTIVE" : (rand > 0.7 ? "REPAIRING" : "IDLE");
            });
            setStatuses(newStatuses);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <SectionTitle icon="◉" title="18 AI AGENT MISSION CONTROL" sub="Live autonomous operative fleet health and activity monitor" color={C.violet} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                    { l: "ACTIVE AGENTS", v: Object.values(statuses).filter(s => s !== "IDLE").length, c: C.cyan },
                    { l: "IDLE FLEET", v: Object.values(statuses).filter(s => s === "IDLE").length, c: C.muted },
                    { l: "AUTO-REPAIRS", v: Object.values(statuses).filter(s => s === "REPAIRING").length, c: C.gold },
                    { l: "HEALTH SCORE", v: "98.4%", c: C.green },
                ].map(s => (
                    <div key={s.l} style={{ background: C.panel, border: `1px solid ${s.c}33`, borderRadius: 8, padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: s.c, fontFamily: "'Orbitron', monospace" }}>{s.v}</div>
                        <div style={{ fontSize: 8, color: C.muted, fontFamily: "monospace", marginTop: 4 }}>{s.l}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {AGENTS.map(agent => (
                    <div
                        key={agent.id}
                        onClick={() => setOpen(open === agent.id ? null : agent.id)}
                        style={{
                            border: `1px solid ${open === agent.id ? agent.color + "55" : C.border}`,
                            borderLeft: `4px solid ${agent.color}`,
                            borderRadius: 6, padding: 16,
                            background: `${C.panel}${open === agent.id ? "" : "bb"}`,
                            cursor: "pointer", transition: "all 0.2s",
                            opacity: statuses[agent.id] === "IDLE" ? 0.8 : 1
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <span style={{ fontSize: 20 }}>{agent.icon}</span>
                                <div>
                                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: agent.color }}>{agent.name}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: statuses[agent.id] === "IDLE" ? C.muted : (statuses[agent.id] === "ACTIVE" ? C.green : C.gold), animation: statuses[agent.id] === "IDLE" ? "none" : "pulse 1.5s infinite" }} />
                                        <span style={{ fontSize: 9, color: C.muted, fontWeight: 500 }}>{statuses[agent.id] || "IDLE"}</span>
                                    </div>
                                </div>
                            </div>
                            <GlowBadge color={agent.color} small>{agent.cat}</GlowBadge>
                        </div>

                        {open === agent.id && (
                            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${agent.color}22` }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
                                    <div>
                                        <div style={{ fontSize: 9, color: agent.color, letterSpacing: "1.2px", marginBottom: 10, fontWeight: 700 }}>CORE TEST SUITE</div>
                                        {agent.tests.map((t, i) => (
                                            <div key={i} style={{ fontSize: 10, color: C.text, marginBottom: 6, display: "flex", gap: 8, fontWeight: 500 }}>
                                                <span style={{ color: agent.color }}>▶</span> {t}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ background: "#020608", borderRadius: 4, padding: 12, border: `1px solid ${agent.color}11` }}>
                                        <div style={{ fontSize: 8, color: agent.color, marginBottom: 8, fontFamily: "monospace" }}>AGENT BRAIN LOG</div>
                                        <div style={{ fontSize: 8, color: C.muted, fontFamily: "monospace", height: 60, overflowY: "auto", lineHeight: 1.6 }}>
                                            [INFO] Connecting to {agent.name} protocol...<br />
                                            [OK] Handshake successful.<br />
                                            [SCAN] Initializing {agent.cat} audit suite...<br />
                                            {statuses[agent.id] === "ACTIVE" ? <span style={{ color: C.green }}>[LIVE] Scanning target surface...</span> : <span style={{ color: C.muted }}>[WAIT] Standing by for mission...</span>}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ fontSize: 8, color: C.muted, fontFamily: "monospace" }}>AUTO-FIX: <span style={{ color: agent.color }}>{agent.autofix}</span></div>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        {agent.tools.map(t => <span key={t} style={{ fontSize: 7, color: agent.color, padding: "2px 6px", border: `1px solid ${agent.color}33`, borderRadius: 10 }}>{t}</span>)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
