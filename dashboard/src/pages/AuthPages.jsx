import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const S = {
    page: {
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg, #03070d)", fontFamily: "'Inter', sans-serif"
    },
    box: {
        width: 420, padding: 40, background: "var(--panel, #070f1a)", border: "1px solid var(--border, #0d2035)",
        borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
    },
    logo: { textAlign: "center", marginBottom: 32 },
    h1: { fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 28, color: "#fff", margin: 0 },
    sub: { fontSize: 10, color: "#3a6080", letterSpacing: "1px", marginTop: 6 },
    label: { display: "block", fontSize: 11, color: "var(--muted, #3a6080)", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 6 },
    input: {
        width: "100%", padding: "12px 14px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border, #0d2035)",
        borderRadius: 8, color: "var(--text, #c0d8f0)", fontSize: 14, fontFamily: "'Inter', sans-serif",
        outline: "none", boxSizing: "border-box"
    },
    btn: {
        width: "100%", padding: 13, background: "linear-gradient(135deg,#00e5ff,#0044ff)",
        border: "none", borderRadius: 6, color: "#000", fontSize: 12, fontWeight: 900,
        fontFamily: "'Orbitron',monospace", letterSpacing: "1px", cursor: "pointer", marginTop: 8
    },
    err: { color: "#ff1744", fontSize: 10, fontFamily: "monospace", marginTop: 6 },
    link: { color: "#00e5ff", fontSize: 10, fontFamily: "monospace", textDecoration: "none" },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
};

function Field({ label, type = "text", value, onChange, placeholder, error }) {
    const [show, setShow] = useState(false);
    const isPass = type === "password";

    return (
        <div style={{ marginBottom: 18 }}>
            <label style={S.label}>{label}</label>
            <div style={{ position: "relative" }}>
                <input style={{ ...S.input, borderColor: error ? "#ff1744" : "#0d2035", paddingRight: isPass ? 40 : 14 }}
                    type={isPass ? (show ? "text" : "password") : type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
                {isPass && (
                    <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#3a6080", cursor: "pointer", fontSize: 13, outline: "none" }}>
                        {show ? "👁️" : "👁️‍🗨️"}
                    </button>
                )}
            </div>
            {error && <div style={S.err}>{error}</div>}
        </div>
    );
}

// ── LOGIN ──────────────────────────────────────────────────────
const SS = {
    socialBtn: {
        width: "100%", padding: "12px", background: "transparent",
        border: "1px solid #3e3e3e", borderRadius: "24px", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        fontSize: "14px", fontFamily: "sans-serif", cursor: "pointer", marginBottom: "10px",
        transition: "background 0.2s"
    },
    divider: {
        display: "flex", alignItems: "center", color: "#8e8e8e", fontSize: "12px",
        margin: "24px 0", gap: "15px"
    },
    hr: { flex: 1, height: "1px", background: "#3e3e3e", border: "none" },
    pillInput: {
        width: "100%", padding: "14px 20px", background: "transparent",
        border: "1px solid #5e5e5e", borderRadius: "24px", color: "#fff",
        fontSize: "15px", outline: "none", marginBottom: "16px", boxSizing: "border-box"
    },
    continueBtn: {
        width: "100%", padding: "14px", background: "#fff", color: "#000",
        border: "none", borderRadius: "24px", fontSize: "15px", fontWeight: "600",
        cursor: "pointer", transition: "opacity 0.2s"
    }
};

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailStep, setEmailStep] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, setUser } = useAuth();
    const navigate = useNavigate();

    const handleSocial = (provider) => {
        if (provider === "phone") {
            // Mock phone login for now since backend needs setup
            setError("Mobile authentication module initializing. User standard login or Google/GitHub for now.");
            return;
        }
        // Redirect to backend OAuth
        window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/login/${provider}`;
    };

    const submit = async e => {
        e.preventDefault();
        if (!emailStep) {
            setEmailStep(true);
            return;
        }
        setError(""); setLoading(true);
        try {
            const user = await login(email, password);
            navigate(user.role === "admin" ? "/admin" : "/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
            if (!err.response) {
                setError("SERVER CONNECTION ERROR (Check if Backend is running)");
            } else {
                setError(err.response.data?.detail || "Invalid credentials");
            }
        } finally { setLoading(false); }
    };

    return (
        <div style={S.page}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        .social-btn:hover { background: #2c2c2c !important; }
        .continue-btn:hover { opacity: 0.9; }
      `}</style>
            <div style={{ ...S.box, width: 440, padding: "48px 40px", borderRadius: "14px", background: "var(--panel, #171717)", border: "1px solid var(--border, #0d2035)" }}>

                <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,#00e5ff,#0044ff)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 16, color: "#000", boxShadow: "0 0 20px rgba(0, 229, 255, 0.4)" }}>NQ</div>
                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "24px", fontWeight: "700", color: "#fff", marginBottom: "8px", letterSpacing: "-0.5px" }}>Welcome to NEXUS</h2>
                    <p style={{ fontSize: "13px", color: "rgba(192, 216, 240, 0.6)", lineHeight: "1.5", maxWidth: "300px", margin: "0 auto" }}>
                        Access the most advanced autonomous QA & intelligence suite.
                    </p>
                </div>

                <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
                    <button className="social-btn" style={{ ...SS.socialBtn, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }} onClick={() => handleSocial("google")}>
                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" /><path fill="#34A853" d="M16.04 18.013c-1.09.696-2.47 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.035 3.116A11.982 11.982 0 0 0 12 24c3.055 0 5.782-1.026 7.91-2.782l-3.87-3.205Z" /><path fill="#4A90E2" d="M19.91 21.218C22.408 19.145 24 16.145 24 12c0-.764-.065-1.5-.184-2.218H12v4.582h6.724a5.746 5.746 0 0 1-2.492 3.765l3.678 3.091Z" /><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.127-1.536.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.35l4.04-3.082Z" /></svg>
                        <span style={{ fontWeight: 500 }}>Continue with Google</span>
                    </button>
                    <button className="social-btn" style={{ ...SS.socialBtn, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }} onClick={() => handleSocial("github")}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                        <span style={{ fontWeight: 500 }}>Continue with GitHub</span>
                    </button>
                    <button className="social-btn" style={{ ...SS.socialBtn, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }} onClick={() => handleSocial("phone")}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b388ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        <span style={{ fontWeight: 500 }}>Continue with Phone</span>
                    </button>
                </div>

                <div style={SS.divider}>
                    <div style={SS.hr} /> OR <div style={SS.hr} />
                </div>

                <form onSubmit={submit}>
                    {!emailStep ? (
                        <input
                            style={SS.pillInput}
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    ) : (
                        <div style={{ animation: "slideIn 0.3s ease" }}>
                            <div style={{ fontSize: "12px", color: "#8e8e8e", marginBottom: "12px", textAlign: "center" }}>Enter password for {email}</div>
                            <div style={{ position: "relative" }}>
                                <input
                                    style={{ ...SS.pillInput, paddingRight: 50 }}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoFocus
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 18, top: "27%", transform: "translateY(-50%)", background: "none", border: "none", color: "#fff", opacity: 0.5, cursor: "pointer", fontSize: 16 }}>
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                            <div style={{ textAlign: "right", marginBottom: "12px" }}>
                                <Link to="/forgot-password" style={{ ...S.link, color: "#8e8e8e" }}>Forgot password?</Link>
                            </div>
                        </div>
                    )}

                    {error && <div style={{ ...S.err, textAlign: "center", marginBottom: 12 }}>{error}</div>}

                    <button className="continue-btn" style={{ ...SS.continueBtn, background: "linear-gradient(135deg,#00e5ff,#0044ff)", color: "#000", fontWeight: "900", letterSpacing: "0.5px", fontFamily: "'Orbitron', sans-serif" }} disabled={loading}>
                        {loading ? "AUTHENTICATING..." : (emailStep ? "SIGN IN →" : "CONTINUE")}
                    </button>
                </form>

                <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "#fff" }}>
                    Don't have an account? <Link to="/register" style={{ ...S.link, fontWeight: "600" }}>Sign up</Link>
                </div>
            </div>
        </div>
    );
}

// ── REGISTER ───────────────────────────────────────────────────
export function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const set = k => v => setForm(f => ({ ...f, [k]: v }));

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.email.includes("@")) e.email = "Valid email required";
        if (form.password.length < 6) e.password = "Min 6 characters";
        if (form.password !== form.confirm) e.confirm = "Passwords do not match";
        return e;
    };

    const submit = async e => {
        e.preventDefault();
        const err = validate();
        if (Object.keys(err).length) { setError(err); return; }
        setError({}); setLoading(true);
        try {
            const { auth: authApi } = await import("../api/client");
            await authApi.register({ full_name: form.name, email: form.email, password: form.password });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError({ email: err.response?.data?.detail || "Registration failed" });
        } finally { setLoading(false); }
    };

    if (success) return (
        <div style={S.page}>
            <div style={{ ...S.box, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ color: "#00e676", fontFamily: "'Orbitron',monospace", fontSize: 14 }}>Account Created!</div>
                <div style={{ color: "#3a6080", fontSize: 10, marginTop: 8 }}>Redirecting to login...</div>
            </div>
        </div>
    );

    return (
        <div style={S.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@400;600&display=swap');`}</style>
            <div style={S.box}>
                <div style={S.logo}>
                    <h1 style={S.h1}>CREATE ACCOUNT</h1>
                    <div style={{ ...S.sub, marginTop: 8 }}>Join NEXUS QA Platform</div>
                </div>
                <form onSubmit={submit}>
                    <Field label="FULL NAME" value={form.name} onChange={set("name")} placeholder="Your Name" error={error.name} />
                    <Field label="EMAIL ADDRESS" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" error={error.email} />
                    <Field label="PASSWORD" type="password" value={form.password} onChange={set("password")} placeholder="Min 6 characters" error={error.password} />
                    <Field label="CONFIRM PASSWORD" type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat password" error={error.confirm} />
                    <button style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                        {loading ? "CREATING..." : "CREATE ACCOUNT →"}
                    </button>
                </form>
                <div style={{ ...S.row, justifyContent: "center" }}>
                    <Link to="/login" style={S.link}>← Already have an account? Sign in</Link>
                </div>
            </div>
        </div>
    );
}

// ── FORGOT PASSWORD ────────────────────────────────────────────
export function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async e => {
        e.preventDefault(); setError(""); setLoading(true);
        try {
            const { auth: authApi } = await import("../api/client");
            await authApi.forgotPassword({ email });
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to send reset email");
        } finally { setLoading(false); }
    };

    if (sent) return (
        <div style={S.page}>
            <div style={{ ...S.box, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
                <div style={{ color: "#ffd600", fontFamily: "'Orbitron',monospace", fontSize: 14 }}>Reset Email Sent</div>
                <div style={{ color: "#3a6080", fontSize: 10, marginTop: 8 }}>Check your inbox for the reset link.</div>
                <Link to="/login" style={{ ...S.link, display: "block", marginTop: 20 }}>← Back to Login</Link>
            </div>
        </div>
    );

    return (
        <div style={S.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@400;600&display=swap');`}</style>
            <div style={S.box}>
                <div style={S.logo}>
                    <h1 style={S.h1}>RESET PASSWORD</h1>
                    <div style={{ ...S.sub, marginTop: 8 }}>Enter your email to receive a reset link</div>
                </div>
                <form onSubmit={submit}>
                    <Field label="EMAIL ADDRESS" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
                    {error && <div style={{ ...S.err, marginBottom: 10 }}>{error}</div>}
                    <button style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                        {loading ? "SENDING..." : "SEND RESET LINK →"}
                    </button>
                </form>
                <div style={{ ...S.row, justifyContent: "center" }}>
                    <Link to="/login" style={S.link}>← Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
