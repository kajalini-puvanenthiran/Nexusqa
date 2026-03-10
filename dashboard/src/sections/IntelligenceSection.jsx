import { useState } from "react";
import { C } from "../constants";
import { SectionTitle, Card } from "../components/UI";

export default function IntelligenceSection({ type, title, subtitle, icon, color }) {
    const [running, setRunning] = useState(false);

    return (
        <div>
            <SectionTitle icon={icon} title={title} sub={subtitle} color={color} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <Card style={{ borderLeft: `4px solid ${color}` }}>
                    <div style={{ fontSize: 10, color: color, fontWeight: 900, marginBottom: 12, letterSpacing: "1px" }}>{type.toUpperCase()} ANALYTICS</div>
                    <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", border: `1px dashed ${C.border}`, borderRadius: 8, background: "rgba(0,0,0,0.1)" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
                            <div style={{ fontSize: 11, color: C.muted }}>Awaiting data stream from {type} nodes...</div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ fontSize: 10, color: color, fontWeight: 900, marginBottom: 12, letterSpacing: "1px" }}>{type.toUpperCase()} OPERATIONAL LOG</div>
                    <div style={{ background: "rgba(0,0,0,0.2)", height: 200, borderRadius: 8, padding: 16, fontFamily: "monospace", fontSize: 10, color: C.text, overflowY: "auto" }}>
                        {running ? (
                            <div>
                                <span style={{ color: C.cyan }}>[INFO]</span> Initializing {type} intelligence sequence...<br />
                                <span style={{ color: C.cyan }}>[INFO]</span> Scanning target infrastructure...<br />
                                <span style={{ color: C.violet }}>[AUTO-FIX]</span> Optimizing response headers...<br />
                                <span style={{ color: C.green }}>[DONE]</span> System synchronized successfully.
                            </div>
                        ) : (
                            <div style={{ color: C.muted, textAlign: "center", paddingTop: 80 }}>READY FOR DEPLOYMENT.</div>
                        )}
                    </div>
                    <button
                        onClick={() => { setRunning(true); setTimeout(() => setRunning(false), 4000); }}
                        style={{ width: "100%", marginTop: 16, padding: "10px", background: color, color: "#000", border: "none", borderRadius: 4, fontWeight: 900, cursor: "pointer", fontSize: 10 }}
                    >
                        {running ? "SYNCING..." : "RUN INTEL AGENT"}
                    </button>
                </Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                    { l: "INTELLIGENCE LEVEL", v: "88%", c: C.cyan },
                    { l: "UAT COVERAGE", v: "94.2%", c: C.green },
                    { l: "LATENCY", v: "14ms", c: C.violet }
                ].map(s => (
                    <Card key={s.l} style={{ textAlign: "center", padding: "20px" }}>
                        <div style={{ fontSize: 8, color: C.muted, fontWeight: 800, marginBottom: 4 }}>{s.l}</div>
                        <div style={{ fontSize: 20, color: C.heading, fontWeight: 900, fontFamily: "'Orbitron', sans-serif" }}>{s.v}</div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
