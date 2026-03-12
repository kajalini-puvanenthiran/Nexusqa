import { useState } from "react";
import { C } from "../constants";

export function GlowBadge({ color = C.cyan, children, small }) {
    return (
        <span style={{
            display: "inline-block",
            padding: small ? "2px 7px" : "3px 10px",
            border: `1px solid ${color}44`,
            borderRadius: 3,
            fontSize: small ? 9 : 10,
            color,
            background: `${color}0d`,
            fontFamily: "monospace",
            letterSpacing: "0.5px",
            margin: "2px",
        }}>{children}</span>
    );
}

export function SectionTitle({ icon, title, sub, color = C.cyan }) {
    return (
        <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <h2 style={{
                    margin: 0,
                    fontFamily: "sans-serif",
                    fontWeight: 900,
                    fontSize: 22,
                    color: C.heading,
                    letterSpacing: "1px",
                }}>{title}</h2>
            </div>
            {sub && <p style={{ margin: "0 0 0 34px", fontSize: 12, color: C.muted, fontFamily: C.font }}>{sub}</p>}
            <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${color}, transparent)`, marginTop: 12 }} />
        </div>
    );
}

export function Card({ children, color = C.cyan, style = {}, glow }) {
    const [hover, setHover] = useState(false);
    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                border: `1px solid ${hover || glow ? color + "55" : C.border}`,
                borderLeft: `2px solid ${color}`,
                borderRadius: 6,
                padding: 20,
                background: C.panel,
                transition: "all 0.2s",
                boxShadow: hover || glow ? `0 0 24px ${color}15` : "none",
                ...style,
            }}
        >{children}</div>
    );
}

export function CodeBlock({ code, lang = "python", color = C.cyan }) {
    return (
        <div style={{ borderRadius: 6, overflow: "hidden", marginTop: 8 }}>
            <div style={{
                background: "#050c14",
                borderBottom: `1px solid ${color}22`,
                padding: "8px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <span style={{ fontSize: 10, color, fontFamily: "monospace", letterSpacing: "1px" }}>{lang.toUpperCase()}</span>
                <div style={{ display: "flex", gap: 5 }}>
                    {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                        <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                    ))}
                </div>
            </div>
            <pre style={{
                margin: 0, padding: "16px",
                background: "#040b12",
                color: "#8ab8cc",
                fontSize: 11,
                lineHeight: 1.75,
                overflowX: "auto",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}>{code}</pre>
        </div>
    );
}
