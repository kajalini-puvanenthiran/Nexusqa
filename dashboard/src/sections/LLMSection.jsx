import { C } from "../constants";
import { SectionTitle, Card, GlowBadge, CodeBlock } from "../components/UI";

const FREE_MODELS = [
    { name: "OpenAI GPT-3.5-turbo", note: "Free tier via OpenAI API. 3 req/min rate limit. Good for report generation & SEO." },
    { name: "Ollama (Local)", note: "Run Llama3, Mistral, Phi-3 locally. No API key. Full privacy. Ideal for air-gapped systems." },
    { name: "Google Gemini Flash", note: "Gemini 1.5 Flash has generous free tier. Great for vision tasks (screenshot analysis)." },
    { name: "Groq (Llama3-8b)", note: "Groq free tier: 30 req/min on Llama3. Ultra-fast inference. Good for real-time debug." },
];

export default function LLMSection() {
    return (
        <div>
            <SectionTitle icon="⬡" title="MULTI-LLM INTEGRATION" sub="Free, local, and premium AI backends — user chooses" color={C.violet} />

            <Card color={C.gold} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: C.gold, marginBottom: 12 }}>✦ FREE TIER — ZERO COST TO START</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {FREE_MODELS.map(m => (
                        <div key={m.name} style={{ background: "#030e05", border: `1px solid ${C.green}22`, borderRadius: 5, padding: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 11, color: "#fff", fontFamily: "monospace", fontWeight: 600 }}>{m.name}</span>
                                <GlowBadge color={C.green} small>FREE</GlowBadge>
                            </div>
                            <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", lineHeight: 1.6 }}>{m.note}</div>
                        </div>
                    ))}
                </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <Card color={C.violet}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: C.violet, marginBottom: 12, fontWeight: 700 }}>PREMIUM MODELS (Optional)</div>
                    {[
                        ["Claude Sonnet 4 (Anthropic)", "Best reasoning, security analysis, code debug"],
                        ["GPT-4o (OpenAI)", "Best multimodal — screenshot + DOM analysis"],
                        ["Gemini 1.5 Pro", "1M context — ideal for large codebase analysis"],
                        ["Claude Haiku", "Fast + cheap — bulk SEO rewrites, repetitive tasks"],
                    ].map(([m, use]) => (
                        <div key={m} style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 10, color: C.violet, fontFamily: "monospace", fontWeight: 600 }}>{m}</div>
                            <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", marginTop: 2 }}>{use}</div>
                        </div>
                    ))}
                </Card>
                <Card color={C.violet}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: C.violet, marginBottom: 12, fontWeight: 700 }}>LLM ROUTER (Smart Dispatch)</div>
                    {[
                        ["Task complexity", "Simple → free tier. Complex reasoning → premium."],
                        ["User budget config", "'free_only': true uses only zero-cost models"],
                        ["Privacy mode", "'local_only': true routes everything to Ollama"],
                        ["Rate limit fallback", "Hit GPT-3.5 limit? Auto-falls back to Groq."],
                        ["Speed vs quality", "Real-time debug → fastest. Final report → best."],
                    ].map(([k, v]) => (
                        <div key={k} style={{ marginBottom: 6, display: "flex", gap: 6 }}>
                            <span style={{ color: C.violet, flexShrink: 0, fontSize: 10 }}>▸</span>
                            <div style={{ fontSize: 9, fontFamily: "monospace", color: C.muted }}>
                                <span style={{ color: C.text }}>{k}: </span>{v}
                            </div>
                        </div>
                    ))}
                </Card>
            </div>

            <CodeBlock lang="python // llm_router.py" color={C.violet} code={`class LLMRouter:
    MODELS = {
        "free_fast":  {"provider": "groq",     "model": "llama3-8b-8192",          "cost": 0},
        "free_smart": {"provider": "openai",   "model": "gpt-3.5-turbo",           "cost": 0},
        "free_vision":{"provider": "google",   "model": "gemini-1.5-flash",        "cost": 0},
        "local":      {"provider": "ollama",   "model": "llama3:8b",               "cost": 0},
        "smart":      {"provider": "anthropic","model": "claude-sonnet-4-20250514","cost": "$$"},
        "vision":     {"provider": "openai",   "model": "gpt-4o",                  "cost": "$$$"},
    }

    async def generate(self, prompt: str, task_type: str = "general",
                       format: str = "text", require_vision: bool = False) -> str:
        model_key = self.select_model(task_type, require_vision)
        model = self.MODELS[model_key]

        if self.config.free_only and model['cost'] != 0:
            model_key, model = "free_smart", self.MODELS["free_smart"]
        if self.config.local_only:
            model_key, model = "local", self.MODELS["local"]

        try:
            return await self._call(model, prompt, format)
        except RateLimitError:
            fallback = self.get_fallback(model_key)
            return await self._call(self.MODELS[fallback], prompt, format)`} />
        </div>
    );
}
