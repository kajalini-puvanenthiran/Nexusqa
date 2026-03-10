import { useState } from "react";
import { C } from "../constants";
import { SectionTitle, Card, GlowBadge } from "../components/UI";

const DEVICES = [
    { id: "iphone", name: "iPhone 15 Pro", os: "iOS 17.2", status: "READY", battery: "98%", icon: "🍎" },
    { id: "pixel", name: "Google Pixel 8", os: "Android 14", status: "BUSY", battery: "45%", icon: "🤖" },
    { id: "samsung", name: "Galaxy S24 Ultra", os: "Android 14", status: "OFFLINE", battery: "—", icon: "📱" },
];

export default function MobileSection() {
    const [running, setRunning] = useState(false);

    return (
        <div>
            <SectionTitle icon="📱" title="MOBILE APP INTELLIGENCE" sub="Unified development, SEO & performance optimization for mobile ecosystems" color={C.gold} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <Card color={C.gold}>
                    <div style={{ fontSize: 10, color: C.gold, marginBottom: 14, fontWeight: 700, letterSpacing: "1px" }}>DEVICE CLOUD STATUS</div>
                    {DEVICES.map(d => (
                        <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}44` }}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <span style={{ fontSize: 18 }}>{d.icon}</span>
                                <div>
                                    <div style={{ fontSize: 11, color: C.text, fontWeight: 600 }}>{d.name}</div>
                                    <div style={{ fontSize: 9, color: C.muted }}>{d.os}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 10, color: d.status === "READY" ? C.green : (d.status === "BUSY" ? C.gold : C.muted), fontWeight: 800 }}>{d.status}</div>
                                <div style={{ fontSize: 9, color: C.muted }}>🔋 {d.battery}</div>
                            </div>
                        </div>
                    ))}
                </Card>

                <Card color={C.gold}>
                    <div style={{ fontSize: 10, color: C.gold, marginBottom: 14, fontWeight: 700, letterSpacing: "1px" }}>AUTONOMOUS AUDIT LOGS</div>
                    <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: 8, padding: 14, border: `1px solid ${C.gold}22`, height: 160, marginBottom: 14, overflowY: "auto", fontFamily: "monospace", fontSize: 10 }}>
                        {running ? (
                            <div style={{ color: C.gold }}>
                                [0.0s] ATTACHING TO REMOTELY HOSTED DEVICE...<br />
                                <span style={{ color: C.heading }}>[0.8s] APP INSTALLED (nexus_intelligence_v1.apk)</span><br />
                                [1.5s] ANALYZZING UI HIERARCHY FOR SEO GAPS...<br />
                                [2.2s] INJECTING INTERACTION FLOWS...<br />
                                <span style={{ color: C.green }}>[3.5s] PERFORMANCE BOTTLENECK DETECTED IN RENDER LOOP.</span><br />
                                [4.0s] GENERATING CODE PATCH FOR THREAD BLOCKING...<br />
                                [5.5s] VERIFYING MEMORY STABILITY...<br />
                                <span style={{ color: C.heading }}>[6.0s] OPTIMIZATION COMPLETE. SYNCING TO JIRA.</span>
                            </div>
                        ) : (
                            <div style={{ color: C.muted, textAlign: "center", paddingTop: 60, fontWeight: 500 }}>
                                STANDBY. PRESS RUN TO BEGIN AGENTIC AUDIT.
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => { setRunning(true); setTimeout(() => setRunning(false), 6500); }}
                        disabled={running}
                        style={{ width: "100%", padding: "12px", background: C.gold, color: "#000", border: "none", borderRadius: 8, fontFamily: C.font, fontWeight: 900, fontSize: 11, cursor: "pointer" }}
                    >
                        {running ? "AUDITING..." : "RUN MOBILE INTELLIGENCE"}
                    </button>
                </Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                    { t: "FPS STABILITY", v: "59.2", d: "Average frames per second", c: C.gold },
                    { t: "COLD START", v: "1.2s", d: "App launch time", c: C.cyan },
                    { t: "CPU UTIL", v: "14%", d: "Peak processor usage", c: C.violet }
                ].map(s => (
                    <div key={s.t} style={{ background: C.panel, padding: 16, borderRadius: 8, borderLeft: `2px solid ${s.c}`, border: `1px solid ${C.border}33` }}>
                        <div style={{ fontSize: 9, color: s.c, fontWeight: 700, marginBottom: 4 }}>{s.t}</div>
                        <div style={{ fontSize: 16, color: C.heading, fontFamily: "'Orbitron', sans-serif", fontWeight: 900 }}>{s.v}</div>
                        <div style={{ fontSize: 9, color: C.muted, marginTop: 4, fontWeight: 500 }}>{s.d}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
