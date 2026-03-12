import { useState, useEffect } from "react";
import { C } from "../constants";
import { SectionTitle, Card, GlowBadge, CodeBlock } from "../components/UI";
import { useNotify } from "../context/NotificationContext";

const MODELS = [
    { id: "gpt-3.5", name: "GPT-3.5 TURBO", tier: "FREE", lat: "45ms", power: 65, cost: 95, provider: "OpenAI", note: "Best for SEO & Reports" },
    { id: "gemini-flash", name: "GEMINI 1.5 FLASH", tier: "FREE", lat: "112ms", power: 82, cost: 98, provider: "Google", note: "Vision & Screenshot Analysis" },
    { id: "llama3-groq", name: "LLAMA 3 (GROQ)", tier: "FREE", lat: "12ms", power: 78, cost: 100, provider: "Groq", note: "Ultra-fast Real-time Debug" },
    { id: "ollama-local", name: "OLLAMA (LOCAL)", tier: "LOCAL", lat: "0ms", power: 70, cost: 100, provider: "Self", note: "Privacy-first Air-gapped Ops" },
    { id: "claude-sonnet", name: "CLAUDE 3.7 SONNET", tier: "PREMIUM", lat: "185ms", power: 98, cost: 40, provider: "Anthropic", note: "Elite Logic & Code Repair" },
    { id: "gpt-4o", name: "GPT-4O MASTER", tier: "PREMIUM", lat: "140ms", power: 95, cost: 35, provider: "OpenAI", note: "Complex Multimodal Reasoning" },
];

export default function LLMSection() {
    const { notify } = useNotify();
    const [activeModel, setActiveModel] = useState("llama3-groq");
    const [latencies, setLatencies] = useState({});

    useEffect(() => {
        const it = setInterval(() => {
            const newLats = {};
            MODELS.forEach(m => {
                const base = parseInt(m.lat) || 5;
                newLats[m.id] = base + Math.floor(Math.random() * 20 - 10);
            });
            setLatencies(newLats);
        }, 3000);
        return () => clearInterval(it);
    }, []);

    const selectModel = (id) => {
        setActiveModel(id);
        notify(`Neural Router: Primary engine switched to ${MODELS.find(m => m.id === id).name}`, "success");
    };

    return (
        <div style={{ animation: "fadeIn 0.5s ease-out" }}>
            <SectionTitle icon="⬡" title="NEURAL ROUTER HUB" sub="Dynamic multi-model orchestration with real-time performance telemetry" color={C.violet} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                {MODELS.map(m => {
                    const isActive = activeModel === m.id;
                    const curLat = latencies[m.id] || parseInt(m.lat);
                    return (
                        <Card
                            key={m.id}
                            color={isActive ? C.violet : C.border}
                            glow={isActive}
                            style={{
                                cursor: "pointer",
                                borderLeft: isActive ? `4px solid ${C.violet}` : `2px solid ${C.border}`,
                                background: isActive ? "rgba(124, 77, 255, 0.05)" : C.panel,
                                transition: "all 0.3s ease",
                                opacity: isActive ? 1 : 0.8
                            }}
                        >
                            <div onClick={() => selectModel(m.id)}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                    <div>
                                        <div style={{ fontSize: 9, color: C.muted, fontWeight: 800, letterSpacing: 1 }}>{m.provider.toUpperCase()}</div>
                                        <div style={{ fontSize: 13, fontWeight: 900, color: isActive ? C.heading : C.text, fontFamily: "'Orbitron', sans-serif" }}>{m.name}</div>
                                    </div>
                                    <GlowBadge color={m.tier === "FREE" ? C.green : (m.tier === "LOCAL" ? C.cyan : C.gold)} small>{m.tier}</GlowBadge>
                                </div>

                                <div style={{ marginBottom: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: C.muted, fontWeight: 700, marginBottom: 4 }}>
                                        <span>LATENCY</span>
                                        <span style={{ color: curLat < 50 ? C.green : (curLat < 150 ? C.gold : C.red) }}>{curLat}ms</span>
                                    </div>
                                    <div style={{ height: 2, background: "rgba(0,0,0,0.2)", borderRadius: 1 }}>
                                        <div style={{ width: `${Math.min(100, (curLat / 300) * 100)}%`, height: "100%", background: curLat < 50 ? C.green : (curLat < 150 ? C.gold : C.red), transition: "width 0.5s" }} />
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontSize: 7, color: C.muted, fontWeight: 800 }}>REASONING</div>
                                        <div style={{ fontSize: 10, color: C.violet, fontWeight: 900 }}>{m.power}%</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 7, color: C.muted, fontWeight: 800 }}>EFFICIENCY</div>
                                        <div style={{ fontSize: 10, color: C.green, fontWeight: 900 }}>{m.cost}%</div>
                                    </div>
                                </div>

                                <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.4, fontStyle: "italic" }}>"{m.note}"</div>

                                {isActive && (
                                    <div style={{ marginTop: 12, padding: "4px 0", borderTop: `1px solid ${C.violet}33`, textAlign: "center", fontSize: 9, color: C.violet, fontWeight: 900 }}>
                                        ACTIVE ENGINE
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginBottom: 16 }}>
                <Card color={C.violet}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: C.violet, marginBottom: 16, fontWeight: 800, letterSpacing: 1 }}>SMART_DISPATCH_PROTOCOL [ACTIVE]</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        {[
                            { k: "Priority Pathing", v: "High severity issues auto-escalate to Claude Sonnet." },
                            { k: "Privacy Shield", v: "Personally identifiable data always routes to Local Ollama." },
                            { k: "Cost Optimization", v: "Repetitive SEO tasks strictly utilize Gemini Flash free tier." },
                            { k: "Vision Routing", v: "Screenshot comparisons dispatched to GPT-4o Multimodal." }
                        ].map(item => (
                            <div key={item.k}>
                                <div style={{ fontSize: 11, color: C.heading, fontWeight: 700, marginBottom: 4 }}>{item.k}</div>
                                <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>{item.v}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card color={C.violet}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: C.violet, marginBottom: 12, fontWeight: 800 }}>GLOBAL CONFIGURATION</div>
                    <div style={{ display: "grid", gap: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(0,0,0,0.1)", borderRadius: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700 }}>STRICT PRIVACY MODE</span>
                            <span style={{ fontSize: 10, color: C.cyan, fontWeight: 900 }}>OFF</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(0,0,0,0.1)", borderRadius: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700 }}>AUTO-FALLBACK ENABLED</span>
                            <span style={{ fontSize: 10, color: C.green, fontWeight: 900 }}>ON</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(0,0,0,0.1)", borderRadius: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700 }}>FREE-ONLY ROUTING</span>
                            <span style={{ fontSize: 10, color: C.muted, fontWeight: 900 }}>AUTO</span>
                        </div>
                    </div>
                    <button style={{ width: "100%", marginTop: 14, padding: "10px", background: "transparent", border: `1px solid ${C.violet}`, color: C.violet, borderRadius: 8, fontSize: 9, fontWeight: 900, cursor: "pointer", letterSpacing: 1 }}>
                        APPLY NETWORK DEPLOYMENT
                    </button>
                </Card>
            </div>

            <CodeBlock lang="python // llm_router_nexus.py" color={C.violet} code={`class NexusNeuralRouter:
    async def dispatch(self, payload: TaskPayload):
        # 1. Analyze Task Requirements
        intent = await self.detect_intent(payload.context)
        
        # 2. Check Constraint Matrix (Cost vs Privacy)
        if payload.contains_p_data:
            return await self.execute_locally(payload)
            
        # 3. Dynamic Routing based on real-time Telemetry
        model = self.select_best_performer(
            task_complexity=intent.complexity,
            priority=payload.priority,
            vision_required=intent.needs_vision
        )
        
        # 4. Execute with Cross-Model Verification if high priority
        results = await self.call_ai(model, payload)
        if payload.priority == "CRITICAL":
            await self.verify_result(results, fallback_model="claude-sonnet")
            
        return results`} />
        </div>
    );
}
