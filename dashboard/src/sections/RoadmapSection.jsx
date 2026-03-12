import { useState } from "react";
import { C } from "../constants";
import { SectionTitle, Card, GlowBadge } from "../components/UI";

const PHASES = [
    { n: "01", status: 100, title: "Foundation & Core Scan", weeks: "Weeks 1–3", color: C.cyan, milestone: "MVP: URL → crawl → basic multi-agent report", tasks: ["Antigravity scaffold", "System classifier", "Playwright crawler", "UI/Security agents", "LLMRouter", "JSON reports"] },
    { n: "02", status: 100, title: "Full Test Agent Suite", weeks: "Weeks 4–7", color: C.violet, milestone: "All 18 agents running in parallel", tasks: ["API Agent (Newman)", "Accessibility (axe)", "SEO (Lighthouse)", "Data Quality (fuzzing)", "Mobile Agent (Appium)", " ag.Parallel Opt"] },
    { n: "03", status: 100, title: "Auto-Debug & Self-Healing", weeks: "Weeks 8–10", color: C.orange, milestone: "Tests self-heal; dev errors auto-analyzed", tasks: ["AutoDebugAgent", "Error interceptors", "Sentry/Datadog hooks", "git blame engine", "Auto-fix code gen", "GitHub PR bridge"] },
    { n: "04", status: 85, title: "SEO Engine + Auto-Repair", weeks: "Weeks 11–13", color: C.green, milestone: "Full SEO audit + automated repair", tasks: ["SEORepairAgent", "Vision AI alt-gen", "JSON-LD injection", "Sitemap auto-gen", "SEO trend analysis", "Link validator"] },
    { n: "05", status: 45, title: "JIRA Automation Hub", weeks: "Weeks 14–16", color: C.red, milestone: "Zero-click JIRA lifecycle sync", tasks: ["JIRAAutomationAgent", "Dup detection", "Smart routing", "Sprint assignment", "IssueTracker monitoring", "Bridge construction"] },
    { n: "06", status: 0, title: "DevOps & Scaling", weeks: "Weeks 17–20", color: C.gold, milestone: "Production-ready Kubernetes deploy", tasks: ["K8s cluster deploy", "HPA auto-scaling", "CI/CD GitHub Actions", "Quality gate blocks", "Prometheus/Grafana", "ag.Scheduler"] },
    { n: "07", status: 0, title: "Intelligence & Learning", weeks: "Weeks 21–26", color: "#ff6ec7", milestone: "Self-improving, trend-aware platform", tasks: ["Quality score trending", "ML test priority", "NL Query: 'Why failed?'", "Multi-env diffing", "Nexus SDK", "Predictive detection"] },
];

export default function RoadmapSection() {
    const [hovered, setHovered] = useState(null);

    return (
        <div style={{ animation: "fadeIn 0.8s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
                <SectionTitle icon="◎" title="PROJECT STELLAR ROADMAP" sub="7-phase evolution from core scanning to autonomous intelligence" color={C.cyan} />
                <div style={{ padding: "12px 20px", background: "rgba(0,229,255,0.05)", border: `1px solid ${C.cyan}22`, borderRadius: 12, textAlign: "right" }}>
                    <div style={{ fontSize: 8, color: C.cyan, fontWeight: 900, letterSpacing: 1, marginBottom: 4 }}>PROJECT VELOCITY</div>
                    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 20 }}>
                        {[4,6,10,14,22,28,40,55,70,85].map((v, i) => (
                            <div key={i} style={{ width: 4, height: `${v}%`, background: C.cyan, borderRadius: 1, opacity: 0.3 + (i * 0.07) }} />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .timeline-phase:hover { transform: translateX(10px); }
                .phase-current { animation: glowPulse 2s infinite ease-in-out; }
                @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 10px rgba(0,229,255,0.1); } 50% { box-shadow: 0 0 30px rgba(0,229,255,0.3); } }
            `}</style>

            <div style={{ position: "relative", paddingLeft: 40, borderLeft: `1px solid ${C.border}` }}>
                {PHASES.map((p, i) => {
                    const isCurrent = p.status > 0 && p.status < 100;
                    const isFuture = p.status === 0;
                    const isComplete = p.status === 100;

                    return (
                        <div 
                            key={p.n} 
                            onMouseEnter={() => setHovered(p.n)} 
                            onMouseLeave={() => setHovered(null)}
                            className={`timeline-phase ${isCurrent ? "phase-current" : ""}`}
                            style={{ position: "relative", marginBottom: 24, transition: "all 0.4s ease" }}
                        >
                            {/* Timeline node */}
                            <div style={{ 
                                position: "absolute", left: -52, top: 20, width: 24, height: 24, borderRadius: "50%", 
                                background: isComplete ? p.color : (isCurrent ? p.color : "#0a192f"), 
                                border: `2px solid ${p.color}`, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.3s"
                            }}>
                                <span style={{ fontSize: 9, fontWeight: 900, color: isComplete || isCurrent ? "#000" : p.color }}>{p.n}</span>
                            </div>

                            <Card color={p.color} style={{ padding: "20px 24px", opacity: isFuture ? 0.6 : 1, borderLeft: isCurrent ? `4px solid ${p.color}` : `1px solid ${p.border}` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                                            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 900, color: C.heading }}>{p.title.toUpperCase()}</span>
                                            {isCurrent && <GlowBadge color={p.color} small>IN PROGRESS</GlowBadge>}
                                            {isComplete && <GlowBadge color={C.green} small>STABLE</GlowBadge>}
                                        </div>
                                        <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: 1 }}>{p.weeks.toUpperCase()} · {p.milestone}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 11, fontWeight: 900, color: p.color }}>{p.status}%</div>
                                        <div style={{ width: 100, height: 3, background: "rgba(0,0,0,0.2)", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
                                            <div style={{ width: `${p.status}%`, height: "100%", background: p.color, transition: "width 1s cubic-bezier(0.65, 0, 0.35, 1)" }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                        {p.tasks.map((task, j) => (
                                            <div key={j} style={{ display: "flex", gap: 6, fontSize: 9, color: C.text, opacity: 0.8 }}>
                                                <span style={{ color: p.color }}>◈</span> {task}
                                            </div>
                                        ))}
                                    </div>
                                    {hovered === p.n && (
                                        <div style={{ background: "rgba(0,0,0,0.15)", padding: 12, borderRadius: 8, borderLeft: `2px solid ${p.color}44`, animation: "slideRight 0.3s ease-out" }}>
                                            <div style={{ fontSize: 8, color: p.color, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>EVOLUTIONARY ARCHIVE_LOG</div>
                                            <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.5 }}>
                                                Antigravity signal identified {p.tasks.length} core dependencies for this milestone. 
                                                {isComplete ? " Verification telemetry confirms absolute status synchronization." : " Active threads are optimizing vector weights for next-phase transition."}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 20, textAlign: "center", padding: 20, border: `1px dashed ${C.border}`, borderRadius: 12, color: C.muted, fontSize: 10, letterSpacing: 1, fontWeight: 700 }}>
                ◎ END OF PROJECTED TIMELINE (Q4 2026) · <span style={{ color: C.cyan }}>BEYOND: SELF-REPLICATING QA CORE</span>
            </div>
        </div>
    );
}
