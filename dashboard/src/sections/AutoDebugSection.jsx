import { useState } from "react";
import { C } from "../constants";
import { SectionTitle, Card, CodeBlock } from "../components/UI";

const HEAL_STEPS = ["Test Fails", "Error Captured", "Stack Trace Parsed", "LLM Root Cause Analysis", "Fix Generated", "Fix Applied", "Test Re-Run", "Pass? → Done", "Fail? → Escalate to JIRA"];

export default function AutoDebugSection() {
    const [track, setTrack] = useState("websites");

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <SectionTitle icon="⚙" title="AUTO DEBUG ENGINE" sub="Self-healing tests, error detection, and autonomous code fixing" color={C.orange} style={{ margin: 0 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "1px" }}>ACTIVE TRACK:</span>
                    <select value={track} onChange={e => setTrack(e.target.value)} style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.orange, padding: "8px 16px", borderRadius: 8, fontSize: 11, fontWeight: 800, outline: "none", cursor: "pointer" }}>
                        <option value="websites">WEBSITES (SEO/QA/DEV)</option>
                        <option value="software">SOFTWARE SYSTEMS (QA/DEV)</option>
                        <option value="mobile">MOBILE APP (QA/DEV)</option>
                    </select>
                </div>
            </div>

            <Card color={C.orange} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: C.orange, fontWeight: 900 }}>{track.toUpperCase()} SELF-HEALING LOOP</div>
                    <div style={{ fontSize: 9, color: C.green, background: `${C.green}11`, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>LIVE AGENT MONITORING</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, fontSize: 11 }}>
                    {(track === "websites" ? ["SEO Audit", "QA Scan", "Issue ID", "AI Patch", "DOM Sync", "Verify", "Done"] : (track === "software" ? ["Log Captured", "Stack Trace", "Logic Analysis", "Fix Gen", "Deploy", "Verified"] : ["Crash Log", "Device Repro", "UAT Patch", "Swift/Kotlin Fix", "Bundle Sync", "Verified"])).map((s, i, arr) => (
                        <span key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{
                                padding: "6px 14px", borderRadius: 8, background: "rgba(0,0,0,0.1)",
                                border: `1px solid ${s.includes("Pass") || s.includes("Sync") || s.includes("Done") || s.includes("Verified") ? C.green : s.includes("Fail") || s.includes("Crash") ? C.red : C.orange}33`,
                                color: s.includes("Pass") || s.includes("Sync") || s.includes("Done") || s.includes("Verified") ? C.green : s.includes("Fail") || s.includes("Crash") ? C.red : C.text,
                                whiteSpace: "nowrap", fontWeight: 600, fontSize: 10
                            }}>{s}</span>
                            {i < arr.length - 1 && <span style={{ color: C.orange, opacity: 0.5 }}>→</span>}
                        </span>
                    ))}
                </div>
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

            <CodeBlock lang="python // auto_debug_agent.py" color={C.orange} code={`class AutoDebugAgent:
    async def execute_with_healing(self, test_func, context: dict) -> TestResult:
        for attempt in range(self.max_retries):
            try:
                return await test_func(context)
            except PlaywrightError as e:
                new_selector = await self.ai_rediscover_selector(
                    error=str(e), page_dom=await context['page'].content(),
                    original_intent=context['element_description']
                )
                context['selector'] = new_selector
            except TimeoutError as e:
                wait_strategy = await self.llm.generate(
                    f"Test timed out: {e}. Suggest Playwright wait strategy."
                )
                context['wait_strategy'] = wait_strategy
            except Exception as e:
                fix = await self.deep_analyze_and_fix(e, context)
                if fix.confidence < 0.7:
                    await JIRAAgent().create_bug_ticket(e, context, fix)
                    return TestResult(status="escalated")
                await fix.apply()
        return TestResult(status="failed_after_healing")`} />
        </div>
    );
}
