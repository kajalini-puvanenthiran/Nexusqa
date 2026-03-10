import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, isAdmin } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotify } from "../context/NotificationContext";
import { reports, scans, users, settings, search } from "../api/client";
// ─────────── Global Search Bar ───────────────────────────────────
function GlobalSearch({ setActive }) {
    const [q, setQ] = useState("");
    const [results, setResults] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setShow(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const performSearch = async (val) => {
        setQ(val);
        if (val.length < 2) { setResults([]); return; }
        setLoading(true);
        try {
            const r = await search.global(val);
            setResults(r.data);
            setShow(true);
        } catch (e) { console.error("Search failed", e); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ position: "relative", flex: 1, maxWidth: 400, margin: "0 40px" }} ref={searchRef}>
            <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12 }}>🔍</span>
                <input
                    value={q}
                    onChange={(e) => performSearch(e.target.value)}
                    onFocus={() => q.length >= 2 && setShow(true)}
                    placeholder="Search intelligence archives (URLs, users, reports...)"
                    style={{
                        width: "100%", padding: "10px 16px 10px 36px", background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${C.border}`, borderRadius: 20, color: C.text, fontSize: 11,
                        fontFamily: C.font, outline: "none", transition: "all 0.3s"
                    }}
                />
                {loading && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 10 }}>⟳</div>}
            </div>

            {show && results.length > 0 && (
                <div style={{ position: "absolute", top: 44, left: 0, right: 0, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.4)", zIndex: 1000, overflow: "hidden" }}>
                    <div style={{ padding: "10px 16px", background: "rgba(0,0,0,0.1)", fontSize: 8, fontWeight: 800, color: C.muted, letterSpacing: "1px" }}>FOUND {results.length} INTEL MATCHES</div>
                    <div style={{ maxHeight: 300, overflowY: "auto" }}>
                        {results.map((r, i) => (
                            <div key={i} onClick={() => { setActive(r.link); setShow(false); setQ(""); }} style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}33`, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }} className="user-menu-item">
                                <div style={{ fontSize: 14 }}>{r.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 11, color: C.heading, fontWeight: 700 }}>{r.title}</div>
                                    <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{r.type} · {r.subtitle}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function SidebarItem({ item, active, setActive, expanded, toggleExpand, depth = 0, user }) {
    const isExpanded = expanded[item.id];
    const hasSub = item.sub && item.sub.length > 0;
    const isActive = active === item.id || (hasSub && item.sub.some(s => active === s.id));

    return (
        <div style={{ marginBottom: 2 }}>
            <button
                onClick={() => {
                    if (hasSub) toggleExpand(item.id);
                    else setActive(item.id);
                }}
                style={{
                    display: "flex", alignItems: "center", gap: 12, width: "100%",
                    padding: `10px 20px 10px ${20 + depth * 16}px`,
                    background: active === item.id ? `${C.cyan}11` : "none",
                    border: "none",
                    borderLeft: active === item.id ? `3px solid ${C.cyan}` : "3px solid transparent",
                    color: active === item.id ? C.cyan : (isActive ? C.heading : C.muted),
                    cursor: "pointer", fontSize: 11, fontWeight: isActive ? 700 : 500,
                    textAlign: "left", transition: "all 0.2s", position: "relative"
                }}
            >
                <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                <span style={{ flex: 1, letterSpacing: depth === 0 ? "0.3px" : "0" }}>{item.label}</span>
                {hasSub && (
                    <span style={{ fontSize: 8, transition: "transform 0.3s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.5 }}>▼</span>
                )}
            </button>

            {hasSub && isExpanded && (
                <div style={{ background: "rgba(0,0,0,0.02)", borderLeft: `1px solid ${C.border}44`, marginLeft: 26 }}>
                    {item.sub.filter(s => !s.adminOnly || isAdmin(user)).map(subItem => (
                        <SidebarItem key={subItem.id} item={subItem} active={active} setActive={setActive} expanded={expanded} toggleExpand={toggleExpand} depth={depth + 1} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Shared sidebar layout ──────────────────────────────────────
function Layout({ active, setActive, children, user, logout }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    const { theme, toggleTheme } = useTheme();
    const { notifications, clearNotifications, markAsRead } = useNotify();
    const menuRef = useRef(null);
    const noteRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
            if (noteRef.current && !noteRef.current.contains(e.target)) setShowNotes(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div style={{ fontFamily: C.font, background: C.bg, color: C.text, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <style>{`* { transition: background 0.15s ease, border 0.15s ease, color 0.1s ease; box-sizing: border-box; } ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#00e5ff33} .user-menu-item:hover{background:${C.border}} .user-menu-item{transition: all 0.2s}`}</style>

            {/* Top bar */}
            <div style={{ borderBottom: `1px solid ${C.border}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.panel, position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: "linear-gradient(135deg,#00e5ff,#0044ff)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 13, color: "#000" }}>NQ</div>
                    <div>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 16, color: C.heading, letterSpacing: "1.5px" }}>NEXUS<span style={{ color: C.cyan }}>QA</span></div>
                        <div style={{ fontSize: 9, color: C.muted, fontWeight: 500 }}>Autonomous Intelligence</div>
                    </div>
                </div>

                <GlobalSearch setActive={setActive} />

                <div style={{ display: "flex", gap: 16, alignItems: "center", position: "relative" }} ref={menuRef}>
                    <button onClick={toggleTheme} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", color: C.cyan }}>
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <div style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }} ref={noteRef}>
                        <span style={{ fontSize: 16, cursor: "pointer" }} onClick={() => setShowNotes(!showNotes)}>🔔</span>
                        {notifications.length > 0 && <div style={{ position: "absolute", top: -2, right: -2, background: C.red, color: "#fff", fontSize: 8, padding: "1px 4px", borderRadius: "10px", fontWeight: 800 }}>{notifications.length}</div>}

                        {showNotes && (
                            <div style={{ position: "absolute", top: 40, right: 0, width: 300, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 15px 45px rgba(0,0,0,0.4)", zIndex: 1000, overflow: "hidden" }}>
                                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.1)" }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: C.heading }}>EVENT LOG</div>
                                    <button onClick={clearNotifications} style={{ background: "none", border: "none", color: C.muted, fontSize: 9, cursor: "pointer", fontWeight: 600 }}>CLEAR ALL</button>
                                </div>
                                <div style={{ maxHeight: 400, overflowY: "auto" }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: "40px 20px", textAlign: "center", color: C.muted, fontSize: 11 }}>Agent log is currently empty.</div>
                                    ) : notifications.map(n => (
                                        <div key={n.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}33`, display: "flex", gap: 12, alignItems: "flex-start", background: n.read ? "transparent" : `${C.cyan}05`, cursor: "pointer" }} onClick={() => markAsRead(n.id)}>
                                            <div style={{ fontSize: 14 }}>{n.type === "error" ? "🛑" : (n.type === "success" ? "🎯" : "⚡")}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                    <div style={{ fontSize: 11, color: C.text, fontWeight: 600, lineHeight: 1.4 }}>{n.text}</div>
                                                    {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, marginTop: 4 }} />}
                                                </div>
                                                <div style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>{n.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
                                    <button onClick={() => { setActive("notifications"); setShowNotes(false); }} style={{ background: "none", border: "none", color: C.cyan, fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: "1px" }}>VIEW FULL NOTIFICATION HUB →</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <GlowBadge color={user?.role === "admin" ? C.gold : C.cyan}>{user?.role?.toUpperCase() || "USER"}</GlowBadge>
                    <div
                        onClick={() => setShowMenu(!showMenu)}
                        style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${C.cyan}`, background: "#0d2035", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>

                    {showMenu && (
                        <div style={{ position: "absolute", top: 44, right: 0, width: 170, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 0", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: 200 }}>
                            <div className="user-menu-item" onClick={() => { setActive("profile"); setShowMenu(false); }} style={{ padding: "10px 16px", fontSize: 11, color: C.text, cursor: "pointer", fontWeight: 500 }}>👤 View Profile</div>
                            <div className="user-menu-item" onClick={() => { setActive("edit_profile"); setShowMenu(false); }} style={{ padding: "10px 16px", fontSize: 11, color: C.text, cursor: "pointer", fontWeight: 500 }}>⚙️ Profile Settings</div>
                            <div style={{ height: 1, background: C.border, margin: "6px 0" }} />
                            <div className="user-menu-item" onClick={logout} style={{ padding: "10px 16px", fontSize: 11, color: C.red, cursor: "pointer", fontWeight: 600 }}>🚪 Secure Logout</div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: "flex", flex: 1 }}>
                <div style={{ width: 230, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: theme === 'dark' ? "#04090f" : "#f5f7f9", position: "sticky", top: 57, height: "calc(100vh - 57px)", overflowY: "auto", padding: "16px 0", scrollbarWidth: "none" }}>
                    {NAV.filter(item => !item.adminOnly || isAdmin(user)).map(item => (
                        <SidebarItem key={item.id} item={item} active={active} setActive={setActive} expanded={expanded} toggleExpand={toggleExpand} depth={0} user={user} />
                    ))}

                    <div style={{ padding: "16px 20px" }}>
                        <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
                        <button onClick={() => setActive("scans")} style={{ width: "100%", padding: "10px", background: active === "scans" ? `${C.cyan}15` : "rgba(0,0,0,0.05)", border: active === "scans" ? `1px solid ${C.cyan}` : `1px solid ${C.border}`, color: active === "scans" ? C.cyan : C.text, borderRadius: 8, fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: "1px", marginBottom: 8 }}>RUN NEW SCAN</button>
                        <button onClick={() => setActive("reports")} style={{ width: "100%", padding: "10px", background: active === "reports" ? `${C.gold}15` : "rgba(0,0,0,0.05)", border: active === "reports" ? `1px solid ${C.gold}` : `1px solid ${C.border}`, color: active === "reports" ? C.gold : C.text, borderRadius: 8, fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: "1px" }}>REPORTS HUB</button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxWidth: "calc(100% - 230px)" }}>
                    <div style={{ maxWidth: 1000 }}>{children}</div>
                </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, padding: "8px 24px", display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted, background: "#04090f", fontFamily: "monospace" }}>
                <span>NEXUS QA v2.0 · Python + React + PostgreSQL + Docker</span>
                <span>Logged as {user?.email}</span>
            </div>
        </div>
    );
}

// ─── Scan Runner ────────────────────────────────────────────────
function ScanRunner() {
    const { notify } = useNotify();
    const [url, setUrl] = useState("");
    const [targetType, setTargetType] = useState("website");
    const [mode, setMode] = useState("full");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const run = async () => {
        if (!url) return;
        setRunning(true); setError(""); setResult(null);
        try {
            const r = await scans.start({ url, mode, target_type: targetType, credentials: username ? { username, password } : null });
            setResult(r.data);
            notify("Scan completed successfully", "success");
        } catch (e) {
            const msg = e.response?.data?.detail || "Scan failed";
            setError(msg);
            notify(msg, "error");
        } finally { setRunning(false); }
    };

    return (
        <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900, color: C.heading, marginBottom: 24 }}>
                RUN <span style={{ color: C.cyan }}>NEW SCAN</span>
            </div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderLeft: `2px solid ${C.cyan}`, borderRadius: 6, padding: 24, marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 10, color: C.muted, letterSpacing: "1px", marginBottom: 8 }}>TARGET TYPE</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    {[{ id: "website", label: "🌐 WEBSITE" }, { id: "software", label: "💿 SOFTWARE" }, { id: "mobile", label: "📱 MOBILE APP" }, { id: "pos", label: "🏧 POS SYSTEM" }].map(t => (
                        <button key={t.id} onClick={() => setTargetType(t.id)} style={{
                            padding: "8px 16px", borderRadius: 4, fontFamily: "monospace", fontSize: 10, cursor: "pointer",
                            background: targetType === t.id ? `${C.cyan}22` : "transparent",
                            border: `1px solid ${targetType === t.id ? C.cyan : C.border}`,
                            color: targetType === t.id ? C.cyan : C.muted, fontWeight: 700,
                        }}>{t.label}</button>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 10, color: C.muted, letterSpacing: "1px", marginBottom: 8 }}>TARGET URL / SYSTEM ID</label>
                        <input value={url} onChange={e => setUrl(e.target.value)} placeholder={targetType === "website" ? "https://yourapp.com" : "System Identifier"}
                            style={{ width: "100%", padding: "11px 14px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, fontFamily: C.font, outline: "none" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 10, color: C.muted, letterSpacing: "1px", marginBottom: 8 }}>AUTH USERNAME (OPTIONAL)</label>
                        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username"
                            style={{ width: "100%", padding: "11px 14px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, fontFamily: C.font, outline: "none" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 10, color: C.muted, letterSpacing: "1px", marginBottom: 8 }}>AUTH PASSWORD</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                            style={{ width: "100%", padding: "11px 14px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, fontFamily: C.font, outline: "none" }} />
                    </div>
                </div>

                <label style={{ display: "block", fontSize: 10, color: C.muted, letterSpacing: "1px", marginBottom: 8 }}>SCAN MODE</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    {["full", "seo", "security", "performance", "ui", "accessibility", "qa", "bug_tracker"].map(m => (
                        <button key={m} onClick={() => setMode(m)} style={{
                            padding: "6px 14px", borderRadius: 4, fontFamily: "monospace", fontSize: 10, cursor: "pointer",
                            background: mode === m ? C.cyan : "transparent",
                            border: `1px solid ${mode === m ? C.cyan : C.border}`,
                            color: mode === m ? "#000" : C.muted, fontWeight: mode === m ? 700 : 400,
                        }}>{m.toUpperCase()}</button>
                    ))}
                </div>
                <button onClick={run} disabled={running || !url} style={{
                    padding: "12px 28px", background: `linear-gradient(135deg,${C.cyan},#0044ff)`,
                    border: "none", borderRadius: 8, color: "#000", fontFamily: "'Orbitron', sans-serif",
                    fontSize: 11, fontWeight: 900, cursor: running ? "not-allowed" : "pointer", letterSpacing: "1.5px",
                    opacity: running ? 0.7 : 1, transition: "transform 0.2s"
                }}>{running ? "⟳ SCANNING..." : "▶ LAUNCH SCAN"}</button>
            </div>
            {error && <div style={{ color: C.red, fontFamily: "monospace", fontSize: 11, padding: 12, background: `${C.red}10`, borderRadius: 6, border: `1px solid ${C.red}33` }}>{error}</div>}
            {result && <ScanResult data={result} />}
        </div>
    );
}

function ScanResult({ data }) {
    const findings = data.findings || {};
    const dl = async (type) => {
        try {
            const fn = type === "pdf" ? reports.downloadPDF : reports.downloadCSV;
            const r = await fn(data.id);
            const url = URL.createObjectURL(new Blob([r.data]));
            const a = document.createElement("a"); a.href = url;
            a.download = `nexusqa-report-${data.id}.${type}`; a.click();
        } catch (e) { alert("Download failed — run backend first"); }
    };

    return (
        <div style={{ background: C.panel, border: `1px solid ${C.green}33`, borderLeft: `2px solid ${C.green}`, borderRadius: 6, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 13, color: C.green }}>
                    ✅ {data.mode === 'full' ? 'FULL QA SCAN' : data.mode?.toUpperCase() + ' SCAN'} COMPLETE — NEXUS REPORT
                </div>
                <div style={{ fontSize: 9, color: C.cyan, background: `${C.cyan}11`, padding: "4px 10px", borderRadius: 4, fontFamily: "monospace", letterSpacing: "1px" }}>TARGET: {data.target_type?.toUpperCase()}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                {[["Critical", findings.critical || 0, C.red], ["High", findings.high || 0, C.orange], ["Medium", findings.medium || 0, C.gold], ["Low", findings.low || 0, C.green]].map(([l, v, c]) => (
                    <div key={l} style={{ background: C.inputBg, border: `1px solid ${c}33`, borderRadius: 8, padding: 14, textAlign: "center" }}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 900, color: c }}>{v}</div>
                        <div style={{ fontSize: 9, color: C.muted, fontWeight: 600, marginTop: 4 }}>{l.toUpperCase()}</div>
                    </div>
                ))}
            </div>

            {/* Special Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                {findings.target_metrics && (
                    <div style={{ flex: 1, minWidth: 200, padding: "10px 16px", background: `${C.cyan}08`, border: `1px solid ${C.cyan}22`, borderRadius: 6 }}>
                        <div style={{ fontSize: 8, color: C.cyan, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>SURFACE DIAGNOSTICS ({data.target_type?.toUpperCase()})</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {Object.entries(findings.target_metrics).map(([k, v]) => (
                                <div key={k} style={{ fontSize: 10 }}>
                                    <span style={{ color: C.muted }}>{k.replace(/_/g, ' ').toUpperCase()}: </span>
                                    <span style={{ color: C.text, fontFamily: "monospace", fontWeight: 700 }}>{String(v)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {findings.qa_stats && (
                    <div style={{ flex: 1, minWidth: 200, padding: "10px 16px", background: `${C.violet}08`, border: `1px solid ${C.violet}22`, borderRadius: 6 }}>
                        <div style={{ fontSize: 8, color: C.violet, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>QA TEST SUITE</div>
                        <div style={{ fontSize: 11, color: C.text, fontWeight: 600 }}>
                            {findings.qa_stats.passed}/{findings.qa_stats.total_tests} PASSED · {findings.qa_stats.coverage_pct}% COVERAGE
                        </div>
                    </div>
                )}
                {findings.bt_stats && (
                    <div style={{ flex: 1, minWidth: 200, padding: "10px 16px", background: `${C.pink}08`, border: `1px solid ${C.pink}22`, borderRadius: 6 }}>
                        <div style={{ fontSize: 8, color: C.pink, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 6 }}>BUG ANALYSIS</div>
                        <div style={{ fontSize: 11, color: C.text, fontWeight: 600 }}>
                            {findings.bt_stats.logs_parsed} LOGS PARSED · {findings.bt_stats.bugs_isolated} BUGS FOUND
                        </div>
                    </div>
                )}
            </div>
            <div style={{ fontSize: 12, color: C.text, fontWeight: 400, lineHeight: 1.8, marginBottom: 16 }}>
                {data.summary || "Scan completed. All agents executed successfully."}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => dl("pdf")} style={{ padding: "9px 20px", background: `${C.red}11`, border: `1px solid ${C.red}44`, borderRadius: 6, color: C.red, fontWeight: 700, fontSize: 10, cursor: "pointer", letterSpacing: "1px" }}>⬇ DOWNLOAD PDF</button>
                <button onClick={() => dl("csv")} style={{ padding: "9px 20px", background: `${C.green}11`, border: `1px solid ${C.green}44`, borderRadius: 6, color: C.green, fontWeight: 700, fontSize: 10, cursor: "pointer", letterSpacing: "1px" }}>⬇ DOWNLOAD CSV</button>
            </div>
        </div>
    );
}

// ─── Reports Hub (Categorized) ───────────────────────────────────
function ReportsList() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCats, setOpenCats] = useState({ website: true, software: false, mobile: false });

    const toggleCat = (id) => setOpenCats(prev => ({ ...prev, [id]: !prev[id] }));

    useEffect(() => {
        reports.list().then(r => setList(r.data)).catch(() => setList([])).finally(() => setLoading(false));
    }, []);

    const dl = async (id, type, preview = false) => {
        try {
            const fn = type === "pdf" ? reports.downloadPDF : reports.downloadCSV;
            const r = await fn(id);
            const blob = new Blob([r.data], { type: type === 'pdf' ? 'application/pdf' : 'text/csv' });
            const url = URL.createObjectURL(blob);
            if (preview) {
                window.open(url, '_blank');
            } else {
                const a = document.createElement("a"); a.href = url;
                a.download = `nexusqa-report-${id}.${type}`; a.click();
            }
        } catch (e) { alert("Action failed. Ensure backend API is running."); }
    };

    const categories = [
        { id: "website", title: "WEBSITE INTELLIGENCE", tracks: ["SEO", "QA", "DEV"], color: C.green, icon: "🌐" },
        { id: "software", title: "SOFTWARE SYSTEMS", tracks: ["QA", "DEV"], color: C.violet, icon: "🖥️" },
        { id: "mobile", title: "MOBILE APPLICATIONS", tracks: ["QA", "DEV"], color: C.pink, icon: "📱" },
    ];

    const getTrackColor = (mode) => {
        const m = mode?.toLowerCase();
        if (m === "seo") return C.green;
        if (m === "qa") return C.cyan;
        if (m === "dev" || m === "development") return C.violet;
        return C.muted;
    };

    return (
        <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 900, color: C.heading, marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>📊</span> REPORT <span style={{ color: C.gold }}>HUB</span>
            </div>

            {loading ? (
                <div style={{ padding: 40, color: C.muted, fontFamily: "monospace", fontSize: 11, textAlign: "center" }}>⟳ INITIALIZING REPORT DATA...</div>
            ) : (
                <div style={{ display: "grid", gap: 30 }}>
                    {categories.map(cat => {
                        const filtered = list.filter(r => (r.target_type || "website") === cat.id);
                        return (
                            <div key={cat.id}>
                                <div onClick={() => toggleCat(cat.id)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
                                    <span style={{ fontSize: 14 }}>{cat.icon}</span>
                                    <div style={{ fontSize: 12, fontWeight: 900, color: cat.color, letterSpacing: "1px" }}>{cat.title}</div>
                                    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${cat.color}44, transparent)` }} />
                                    <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, marginRight: 10 }}>{filtered.length} ARCHIVED</div>
                                    <span style={{ fontSize: 10, color: cat.color, transition: "transform 0.3s", transform: openCats[cat.id] ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                                </div>

                                {openCats[cat.id] && (
                                    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", animation: "fadeIn 0.3s forwards" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 140px 180px 180px", background: "rgba(0,0,0,0.15)", padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                                            {["INTEL TARGET", "TRACK / MODE", "STATUS", "GENERATED", "ACTIONS"].map(h => <div key={h} style={{ fontSize: 9, color: C.muted, fontWeight: 800, letterSpacing: "1px" }}>{h}</div>)}
                                        </div>
                                        {filtered.length === 0 ? (
                                            <div style={{ padding: 30, textAlign: "center", color: `${cat.color}44`, fontSize: 10, fontWeight: 700 }}>NO {cat.id.toUpperCase()} REPORTS CAPTURED</div>
                                        ) : (
                                            filtered.map(rep => (
                                                <div key={rep.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 140px 180px 180px", padding: "14px 16px", borderBottom: `1px solid ${C.border}22`, alignItems: "center" }}>
                                                    <div>
                                                        <div style={{ fontSize: 13, color: C.heading, fontWeight: 700 }}>{rep.url}</div>
                                                        <div style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>ID: {rep.id.slice(0, 8)}...</div>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: 9, background: `${getTrackColor(rep.mode)}15`, color: getTrackColor(rep.mode), padding: "4px 8px", borderRadius: 4, fontWeight: 900, border: `1px solid ${getTrackColor(rep.mode)}33` }}>
                                                            {rep.mode?.toUpperCase() || "FULL SCAN"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: 9, color: rep.status === 'purchased' ? C.gold : (rep.status === 'deleted' ? C.red : C.green), fontWeight: 900 }}>
                                                            ● {rep.status?.toUpperCase() || 'ACTIVE'}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>{new Date(rep.created_at).toLocaleString()}</div>
                                                    <div style={{ display: "flex", gap: 6 }}>
                                                        <select onChange={async (e) => {
                                                            const val = e.target.value;
                                                            if (val === 'preview') dl(rep.id, 'pdf', true);
                                                            if (val === 'pdf') dl(rep.id, 'pdf');
                                                            if (val === 'csv') dl(rep.id, 'csv');
                                                            if (val === 'status_deleted') {
                                                                await reports.updateStatus(rep.id, 'deleted');
                                                                setList(prev => prev.map(r => r.id === rep.id ? { ...r, status: 'deleted' } : r));
                                                                notify("Report status set to DELETED", "info");
                                                            }
                                                            if (val === 'status_purchased') {
                                                                await reports.updateStatus(rep.id, 'purchased');
                                                                setList(prev => prev.map(r => r.id === rep.id ? { ...r, status: 'purchased' } : r));
                                                                notify("Report status set to PURCHASED", "success");
                                                            }
                                                            if (val === 'status_active') {
                                                                await reports.updateStatus(rep.id, 'active');
                                                                setList(prev => prev.map(r => r.id === rep.id ? { ...r, status: 'active' } : r));
                                                                notify("Report status set to ACTIVE", "success");
                                                            }
                                                            if (val === 'delete') {
                                                                if (confirm("Permanently delete this report?")) {
                                                                    await reports.delete(rep.id);
                                                                    setList(list.filter(item => item.id !== rep.id));
                                                                    notify("Report purged from database", "success");
                                                                }
                                                            }
                                                            e.target.value = '';
                                                        }} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, color: C.text, padding: "8px 12px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", outline: "none" }}>
                                                            <option value="" style={{ background: C.panel }}>CONFIGURE REPORT</option>
                                                            <option value="preview" style={{ background: C.panel }}>👁️ LIVE PREVIEW</option>
                                                            <option value="pdf" style={{ background: C.panel }}>⬇ DOWNLOAD PDF</option>
                                                            <option value="csv" style={{ background: C.panel }}>⬇ DOWNLOAD CSV</option>
                                                            <option value="status_active" style={{ background: C.panel }}>✅ MARK ACTIVE</option>
                                                            <option value="status_deleted" style={{ background: C.panel }}>🗑️ DELETE STATUS</option>
                                                            <option value="status_purchased" style={{ background: C.panel }}>💰 PURCHASED STATUS</option>
                                                            <option value="delete" style={{ background: C.panel }}>💀 PURGE REPORT</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Notification Hub ──────────────────────────────────────────
function NotificationHub() {
    const { notifications, clearNotifications, markAsRead } = useNotify();

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 900, color: C.heading }}>
                    <span style={{ fontSize: 24, marginRight: 12 }}>🔔</span> EVENT <span style={{ color: C.cyan }}>LOG ARCHIVE</span>
                </div>
                <button onClick={clearNotifications} style={{ padding: "10px 20px", background: `${C.red}11`, border: `1px solid ${C.red}44`, color: C.red, borderRadius: 8, fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: "1px" }}>PURGE ALL EVENT DATA</button>
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 180px 120px", background: "rgba(0,0,0,0.15)", padding: "16px 24px", borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 10, fontWeight: 800, letterSpacing: "1px" }}>
                    <span>TYPE</span>
                    <span>DIAGNOSTIC MESSAGE</span>
                    <span>TIMESTAMP</span>
                    <span>STATUS</span>
                </div>
                {notifications.length === 0 ? (
                    <div style={{ padding: 80, textAlign: "center" }}>
                        <div style={{ fontSize: 32, marginBottom: 16 }}>📡</div>
                        <div style={{ color: C.muted, fontSize: 13, fontWeight: 500 }}>Operational archives are currently empty.</div>
                    </div>
                ) : notifications.map(n => (
                    <div key={n.id} onClick={() => markAsRead(n.id)} style={{ display: "grid", gridTemplateColumns: "60px 1fr 180px 120px", padding: "20px 24px", borderBottom: `1px solid ${C.border}22`, alignItems: "center", cursor: "pointer", background: n.read ? "transparent" : `${C.cyan}03`, transition: "all 0.2s" }}>
                        <div style={{ fontSize: 18 }}>{n.type === "error" ? "🛑" : (n.type === "success" ? "🎯" : "⚡")}</div>
                        <div>
                            <div style={{ fontSize: 13, color: n.read ? C.text : C.heading, fontWeight: n.read ? 500 : 700 }}>{n.text}</div>
                            <div style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>EVENT ID: {n.id}</div>
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>{n.time.toUpperCase()}</div>
                        <div>
                            <span style={{ fontSize: 9, padding: "4px 10px", borderRadius: 4, fontWeight: 900, background: n.read ? "rgba(255,255,255,0.05)" : `${C.cyan}15`, color: n.read ? C.muted : C.cyan, border: `1px solid ${n.read ? C.border : `${C.cyan}33`}` }}>
                                {n.read ? "ACKNOWLEDGED" : "UNVERIFIED"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── User Management (Admin only) ──────────────────────────────
function UserManagement() {
    const { notify } = useNotify();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", role: "user" });

    useState(() => {
        users.list().then(r => setList(r.data)).catch(() => setList([])).finally(() => setLoading(false));
    }, []);

    const changeRole = async (id, role) => {
        try {
            await users.updateRole(id, role);
            setList(l => l.map(u => u.id === id ? { ...u, role } : u));
            notify(`Role updated to ${role}`, "success");
        }
        catch (e) { notify("Role update failed", "error"); }
    };

    const toggleStatus = async (id) => {
        try {
            const r = await users.toggleStatus(id);
            setList(l => l.map(u => u.id === id ? r.data : u));
            notify("User status updated", "success");
        }
        catch (e) { notify("Status toggle failed", "error"); }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const res = await users.update(editId, {
                    full_name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password || undefined,
                    role: formData.role
                });
                setList(list.map(u => u.id === editId ? res.data : u));
                notify("User updated successfully", "success");
            } else {
                const res = await users.create({
                    full_name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: formData.role,
                    is_active: true
                });
                setList([res.data, ...list]);
                notify("New user initialized successfully", "success");
            }
            setShowModal(false);
            resetForm();
        } catch (err) {
            notify(err.response?.data?.detail || "Operation failed", "error");
        }
    };

    const [showPass, setShowPass] = useState(false);

    const resetForm = () => {
        setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "", role: "user" });
        setIsEditing(false);
        setEditId(null);
        setShowPass(false);
    };

    const openEdit = (u) => {
        const names = u.full_name.split(" ");
        setFormData({
            firstName: names[0],
            lastName: names.slice(1).join(" "),
            email: u.email,
            phone: u.phone || "",
            password: "",
            role: u.role
        });
        setIsEditing(true);
        setEditId(u.id);
        setShowModal(true);
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 900, color: C.heading }}>USER <span style={{ color: C.gold }}>MANAGEMENT</span></div>
                <button onClick={() => { resetForm(); setShowModal(true); }} style={{ padding: "10px 24px", background: C.cyan, color: "#000", border: "none", borderRadius: 8, fontWeight: 900, fontSize: 11, cursor: "pointer", letterSpacing: "0.5px" }}>+ NEW USER</button>
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 100px 120px 160px", gap: 0, background: "rgba(0,0,0,0.05)", padding: "14px 16px", borderBottom: `2px solid ${C.border}` }}>
                    {["NAME", "EMAIL", "ROLE", "STATUS", "JOINED", "ACTION"].map(h => <div key={h} style={{ fontSize: 10, color: C.muted, fontWeight: 800, letterSpacing: "1px" }}>{h}</div>)}
                </div>
                {loading ? (
                    <div style={{ padding: 24, color: C.muted, fontSize: 11 }}>Accessing mainframe records...</div>
                ) : list.map(u => (
                    <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 100px 120px 160px", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}33`, alignItems: "center" }}>
                        <div style={{ fontSize: 13, color: C.heading, fontWeight: 600 }}>{u.full_name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{u.email}</div>
                        <div style={{ fontSize: 10, color: u.role === "admin" ? C.gold : C.cyan, fontWeight: 700 }}>{u.role?.toUpperCase()}</div>
                        <div onClick={() => toggleStatus(u.id)} style={{ fontSize: 10, color: !u.is_active ? C.red : C.green, cursor: "pointer", fontWeight: 600 }}>● {u.is_active ? "ACTIVE" : "INACTIVE"}</div>
                        <div style={{ fontSize: 10, color: C.muted }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</div>
                        <div style={{ display: "flex", gap: 6 }}>
                            <select onChange={async (e) => {
                                if (e.target.value === 'delete') {
                                    if (confirm("Permanently purge this user from the system records?")) {
                                        await users.delete(u.id);
                                        setList(list.filter(item => item.id !== u.id));
                                        notify("User purged successfully", "success");
                                    }
                                }
                                if (e.target.value === 'status') toggleStatus(u.id);
                                if (e.target.value === 'edit') openEdit(u);
                                e.target.value = '';
                            }} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.text, padding: "6px 12px", borderRadius: 6, fontSize: 10, cursor: "pointer", fontWeight: 600, outline: "none" }}>
                                <option value="" style={{ background: C.panel }}>ACTION</option>
                                <option value="edit" style={{ background: C.panel }}>EDIT RECORD</option>
                                <option value="status" style={{ background: C.panel }}>{!u.is_active ? 'RESTORE ACCESS' : 'REVOKE ACCESS'}</option>
                                <option value="delete" style={{ background: C.panel }}>PURGE RECORD</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: 36, width: 480, boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, color: C.heading, fontWeight: 900, letterSpacing: "1px" }}>{isEditing ? 'RECONFIGURE OPERATIVE' : 'ENLIST NEW OPERATIVE'}</div>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>×</button>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                                <input placeholder="First Name" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} style={{ padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 13, fontFamily: C.font, outline: "none" }} />
                                <input placeholder="Last Name" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} style={{ padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 13, fontFamily: C.font, outline: "none" }} />
                            </div>
                            <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, marginBottom: 14, fontSize: 13, fontFamily: C.font, outline: "none", boxSizing: "border-box" }} />
                            <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, marginBottom: 14, fontSize: 13, fontFamily: C.font, outline: "none", boxSizing: "border-box" }} />
                            <div style={{ position: "relative", marginBottom: 20 }}>
                                <input type={showPass ? "text" : "password"} placeholder={isEditing ? "New Access Key (Blank to retain)" : "Access Key (Password)"} required={!isEditing} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={{ width: "100%", padding: "12px 40px 12px 16px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 13, fontFamily: C.font, outline: "none", boxSizing: "border-box" }} />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>
                                    {showPass ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>

                            <label style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 8, display: "block", letterSpacing: "1px" }}>CLEARANCE LEVEL</label>
                            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, marginBottom: 28, fontSize: 13, fontFamily: C.font, outline: "none" }}>
                                <option value="user" style={{ background: C.panel }}>STANDARD OPERATIVE</option>
                                <option value="admin" style={{ background: C.panel }}>SYSTEM ADMINISTRATOR</option>
                            </select>

                            <div style={{ display: "flex", gap: 12 }}>
                                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} style={{ flex: 1, padding: "12px", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>CANCEL</button>
                                <button type="submit" style={{ flex: 1, padding: "12px", background: C.cyan, color: "#000", border: "none", borderRadius: 8, fontWeight: 900, cursor: "pointer", letterSpacing: "1px" }}>{isEditing ? 'UPDATE RECORD' : 'ENLIST OPERATIVE'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Profile ────────────────────────────────────────────────────
function Profile({ user }) {
    return (
        <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900, color: C.heading, marginBottom: 24 }}>MY <span style={{ color: C.cyan }}>PROFILE</span></div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderLeft: `2px solid ${C.cyan}`, borderRadius: 12, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", border: `3px solid ${C.cyan}`, background: C.inputBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: C.heading, fontFamily: "'Orbitron', sans-serif" }}>{user?.full_name}</div>
                        <div style={{ fontSize: 11, color: C.cyan, fontWeight: 700, letterSpacing: "1px", marginTop: 4 }}>{user?.role?.toUpperCase()} — VERIFIED AGENT</div>
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 12 }}>
                    {[["Email Address", user?.email], ["Operative ID", user?.id], ["System Status", "🟢 OPERATIONAL"], ["Enlisted At", "MARCH 2026"]].map(([k, v]) => (
                        <div key={k} style={{ display: "contents" }}>
                            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "0.5px", paddingTop: 10 }}>{k.toUpperCase()}</div>
                            <div style={{ fontSize: 13, color: C.text, paddingTop: 10, borderBottom: `1px solid ${C.border}44`, paddingBottom: 10, fontWeight: 500 }}>{v || "—"}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EditProfile({ user }) {
    const { setUser } = useAuth();
    const [firstName, setFirstName] = useState(user?.full_name?.split(" ")[0] || "");
    const [lastName, setLastName] = useState(user?.full_name?.split(" ").slice(1).join(" ") || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showRep, setShowRep] = useState(false);

    const [msg, setMsg] = useState({ type: "", text: "" });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setMsg({ type: "info", text: "Updating profile..." });
        try {
            const res = await auth.updateProfile({
                full_name: `${firstName} ${lastName}`.trim(),
                email,
                phone
            });
            setUser(res.data);
            setMsg({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            setMsg({ type: "error", text: err.response?.data?.detail || "Update failed" });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== repeatPassword) {
            return setMsg({ type: "error", text: "New passwords do not match" });
        }
        setMsg({ type: "info", text: "Changing password..." });
        try {
            await auth.changePassword({ old_password: oldPassword, new_password: newPassword });
            setOldPassword(""); setNewPassword(""); setRepeatPassword("");
            setMsg({ type: "success", text: "Password changed successfully!" });
        } catch (err) {
            setMsg({ type: "error", text: err.response?.data?.detail || "Password change failed" });
        }
    };

    const inputStyle = {
        width: "100%", padding: "12px 16px", background: C.inputBg,
        border: `1px solid ${C.border}`, color: C.text, borderRadius: 8,
        fontFamily: C.font, outline: "none", fontSize: 13, transition: "all 0.2s"
    };

    const labelStyle = {
        display: "block", fontSize: 10, color: C.muted, marginBottom: 8,
        fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px"
    };

    const req = <span style={{ color: C.red }}> *</span>;

    return (
        <div style={{ paddingBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 900, color: C.heading }}>{firstName} {lastName}</div>
                {msg.text && (
                    <div style={{
                        fontSize: 10, padding: "10px 18px", borderRadius: 8, fontWeight: 800,
                        background: msg.type === "error" ? `${C.red}15` : (msg.type === "success" ? `${C.green}15` : `${C.cyan}15`),
                        color: msg.type === "error" ? C.red : (msg.type === "success" ? C.green : C.cyan),
                        border: `1px solid ${msg.type === "error" ? C.red : (msg.type === "success" ? C.green : C.cyan)}44`,
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                    }}>
                        {msg.text.toUpperCase()}
                    </div>
                )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "start" }}>
                {/* Left: Basic Info */}
                <form onSubmit={handleProfileSubmit} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 32 }}>
                    <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Profile Image Source</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                            {['LOCAL PC', 'GOOGLE DRIVE', 'LIVE CAMERA'].map(src => (
                                <button key={src} type="button"
                                    onClick={() => {
                                        if (src === 'GOOGLE DRIVE') notify("Connecting to Google Intelligence Drive...", "info");
                                        if (src === 'LIVE CAMERA') notify("Initializing biometric camera feed...", "info");
                                        if (src === 'LOCAL PC') document.getElementById('profile-upload').click();
                                    }}
                                    style={{ padding: "10px", background: "rgba(0,0,0,0.03)", border: `1px solid ${C.border}`, color: C.cyan, fontSize: 10, borderRadius: 8, cursor: "pointer", fontWeight: 800, letterSpacing: "0.5px" }}>{src}</button>
                            ))}
                        </div>
                        <div style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 10 }}>
                            <button type="button" onClick={() => document.getElementById('profile-upload').click()} style={{ padding: "8px 16px", background: C.cyan, color: "#000", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 900 }}>CHOOSE FILE</button>
                            <input id="profile-upload" type="file" style={{ display: "none" }} onChange={(e) => {
                                if (e.target.files?.[0]) notify(`Selected: ${e.target.files[0].name}`, "success");
                            }} />
                            <span style={{ color: C.muted, fontSize: 11, fontWeight: 600 }}>{user?.profile_image || "operative_avatar.png"}</span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                        <div>
                            <label style={labelStyle}>{req}First Name</label>
                            <input required value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>{req}Last Name</label>
                            <input required value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>{req}Email</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Phone</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                    </div>

                    <button type="submit" style={{ padding: "10px 24px", background: C.cyan, color: "#000", border: "none", borderRadius: 4, fontFamily: "monospace", fontWeight: 700, fontSize: 11, cursor: "pointer", width: "100%" }}>SAVE PROFILE</button>
                </form>

                {/* Right: Security */}
                <div>
                    <form onSubmit={handlePasswordSubmit} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 32, marginBottom: 24 }}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: C.heading, fontWeight: 700, marginBottom: 24 }}>CHANGE PIN/PASSWORD</div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>{req}Old password</label>
                            <div style={{ position: "relative" }}>
                                <input required type={showOld ? "text" : "password"} value={oldPassword} onChange={e => setOldPassword(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} />
                                <button type="button" onClick={() => setShowOld(!showOld)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>{showOld ? "👁️" : "👁️‍🗨️"}</button>
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>{req}New password</label>
                            <div style={{ position: "relative" }}>
                                <input required type={showNew ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} />
                                <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>{showNew ? "👁️" : "👁️‍🗨️"}</button>
                            </div>
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label style={labelStyle}>Repeat new password</label>
                            <div style={{ position: "relative" }}>
                                <input required type={showRep ? "text" : "password"} value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} />
                                <button type="button" onClick={() => setShowRep(!showRep)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>{showRep ? "👁️" : "👁️‍🗨️"}</button>
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button type="submit" style={{ padding: "10px 24px", background: "#3f4682", color: "#fff", border: "none", borderRadius: 4, fontFamily: "monospace", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>Submit</button>
                        </div>
                    </form>


                </div>
            </div>
        </div>
    );
}

// ─── Settings Components ──────────────────────────────────────
function SettingsGeneral() {
    const { notify } = useNotify();
    const [config, setConfig] = useState({ name: '', site: '', hq: '', tz: '' });

    useEffect(() => {
        settings.get().then(r => setConfig({
            name: r.data.site_name,
            site: r.data.site_url,
            hq: r.data.hq_location,
            tz: r.data.timezone
        })).catch(e => console.error("Config fetch failed", e));
    }, []);

    const save = async () => {
        try {
            await settings.update({ site_name: config.name, site_url: config.site, hq_location: config.hq, timezone: config.tz });
            notify("Global configuration synchronized across all nodes", "success");
        } catch (e) { notify("Sync failed", "error"); }
    };

    return (
        <div>
            <SectionTitle icon="🏢" title="GENERAL SETTINGS" sub="Corporate intelligence & platform identity" color={C.cyan} />
            <Card style={{ marginBottom: 20 }}>
                <div style={{ display: "grid", gap: 16 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 10, color: C.muted, fontWeight: 800, marginBottom: 6 }}>COMPANY NAME</label>
                        <input value={config.name} onChange={e => setConfig({ ...config, name: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 13, outline: "none" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 10, color: C.muted, fontWeight: 800, marginBottom: 6 }}>OPERATIONAL SITE</label>
                        <input value={config.site} onChange={e => setConfig({ ...config, site: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 13, outline: "none" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 10, color: C.muted, fontWeight: 800, marginBottom: 6 }}>HQ LOCATION</label>
                        <input value={config.hq} onChange={e => setConfig({ ...config, hq: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 13, outline: "none" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 10, color: C.muted, fontWeight: 800, marginBottom: 6 }}>TIMEZONE</label>
                        <select value={config.tz} onChange={e => setConfig({ ...config, tz: e.target.value })} style={{ width: "100%", padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 13, outline: "none" }}>
                            <option value="UTC / GMT+5:30">UTC / GMT+5:30</option>
                            <option value="UTC / GMT+0:00">UTC / GMT+0:00</option>
                            <option value="EST / GMT-5:00">EST / GMT-5:00</option>
                        </select>
                    </div>
                    <button onClick={save} style={{ background: C.cyan, color: "#000", border: "none", padding: "12px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginTop: 8 }}>SAVE CONFIGURATION</button>
                </div>
            </Card>
        </div>
    );
}

function SettingsTheme() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <SectionTitle icon="🎨" title="THEME STYLE" sub="Visual interface customization & aesthetic overrides" color={C.violet} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <Card onClick={toggleTheme} style={{ cursor: "pointer", border: theme === 'dark' ? `2px solid ${C.cyan}` : `1px solid ${C.border}`, textAlign: "center", padding: 40 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
                    <div style={{ fontWeight: 800, color: C.heading }}>DEEP SPACE (DARK)</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>Standard operative mode</div>
                </Card>
                <Card onClick={toggleTheme} style={{ cursor: "pointer", border: theme === 'light' ? `2px solid ${C.cyan}` : `1px solid ${C.border}`, textAlign: "center", padding: 40 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>☀️</div>
                    <div style={{ fontWeight: 800, color: C.heading }}>STARK LIGHT (LIGHT)</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>High-visibility diagnostic mode</div>
                </Card>
            </div>
        </div>
    );
}

function SettingsMenu() {
    const { notify } = useNotify();
    const [menu, setMenu] = useState([...NAV]);

    useEffect(() => {
        settings.get().then(r => {
            const labels = r.data.menu_labels || {};
            setMenu(prev => prev.map(m => labels[m.id] ? { ...m, label: labels[m.id] } : m));
        }).catch(e => console.error("Menu fetch failed", e));
    }, []);

    const updateLabel = (id, label) => {
        setMenu(prev => prev.map(m => m.id === id ? { ...m, label } : m));
    };

    const save = async () => {
        try {
            const labels = {};
            menu.forEach(m => labels[m.id] = m.label);
            await settings.update({ menu_labels: labels });
            notify("Global navigation hierarchy recalibrated successfully", "success");
        } catch (e) { notify("Sync failed", "error"); }
    };

    return (
        <div>
            <SectionTitle icon="☰" title="MENU SETUP" sub="Navigation hierarchy & operational flow" color={C.gold} />
            <Card style={{ marginBottom: 20 }}>
                <div style={{ display: "grid", gap: 12 }}>
                    {menu.map(m => (
                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 16px", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 8 }}>
                            <span style={{ fontSize: 18, color: C.gold }}>{m.icon}</span>
                            <input value={m.label} onChange={e => updateLabel(m.id, e.target.value)} style={{ flex: 1, background: "transparent", border: "none", color: C.heading, fontSize: 13, fontWeight: 600, outline: "none" }} />
                            <div style={{ fontSize: 9, color: C.muted, fontWeight: 800 }}>{m.id.toUpperCase()}</div>
                        </div>
                    ))}
                    <button onClick={save} style={{ background: C.gold, color: "#000", border: "none", padding: "12px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginTop: 8 }}>SYNC NAVIGATION LOGIC</button>
                </div>
            </Card>
        </div>
    );
}

function SettingsRoles() {
    const { notify } = useNotify();
    const [roles, setRoles] = useState([
        { id: 1, role: "System Administrator", access: "Full Root Access", clearance: "Level 10", color: C.gold },
        { id: 2, role: "Lead Dev Agent", access: "Repository + Auto-Fix", clearance: "Level 8", color: C.violet },
        { id: 3, role: "QA Engineering Agent", access: "Scans + Reports Hub", clearance: "Level 6", color: C.cyan },
        { id: 4, role: "Standard Operative", access: "View Only / Reports", clearance: "Level 2", color: C.muted },
    ]);

    const updateLevel = (id, val) => {
        setRoles(prev => prev.map(r => r.id === id ? { ...r, clearance: `Level ${val}` } : r));
        notify(`Clearance escalated for ${roles.find(r => r.id === id).role}`, "info");
    };

    return (
        <div>
            <SectionTitle icon="🛡" title="ROLES & PERMISSIONS" sub="Clearance levels & security protocols" color={C.red} />
            <div style={{ display: "grid", gap: 14 }}>
                {roles.map(r => (
                    <Card key={r.role} style={{ borderLeft: `4px solid ${r.color}`, position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: C.heading }}>{r.role}</div>
                                <div style={{ fontSize: 11, color: C.text, marginTop: 4 }}>Access: {r.access}</div>
                            </div>
                            <div style={{ textAlign: "right", display: "flex", flexDirecton: "column", alignItems: "flex-end", gap: 4 }}>
                                <div style={{ fontSize: 10, color: r.color, fontWeight: 900 }}>{r.clearance}</div>
                                <select
                                    onChange={(e) => updateLevel(r.id, e.target.value)}
                                    style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: 8, padding: "2px 4px", borderRadius: 4, cursor: "pointer", outline: "none" }}
                                >
                                    <option value="">CHANGE LEVEL</option>
                                    {[1, 2, 6, 8, 10].map(v => <option key={v} value={v}>Level {v}</option>)}
                                </select>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function SettingsModules() {
    const { notify } = useNotify();
    const [mods, setMods] = useState({
        'SEO Engine': true, 'QA Automation': true, 'Self-Healing Loop': true,
        'JIRA Sync': true, 'LLM Vision': false, 'Mobile UAT': true, 'Software Audit': true
    });

    useEffect(() => {
        settings.get().then(r => {
            if (r.data.active_modules && Object.keys(r.data.active_modules).length > 0) {
                setMods(r.data.active_modules);
            }
        }).catch(e => console.error("Mods fetch failed", e));
    }, []);

    const toggle = async (m) => {
        const val = !mods[m];
        const newMods = { ...mods, [m]: val };
        setMods(newMods);
        try {
            await settings.update({ active_modules: newMods });
            notify(`${m} status updated to ${val ? 'ACTIVE' : 'DECOMMISSIONED'}`, val ? 'success' : 'info');
        } catch (e) { notify("Sync failed", "error"); }
    };

    return (
        <div>
            <SectionTitle icon="🧩" title="MODULE MANAGEMENT" sub="Toggle platform capabilities & intelligence tracks" color={C.orange} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
                {Object.keys(mods).map(m => (
                    <Card key={m} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", opacity: mods[m] ? 1 : 0.6, border: mods[m] ? `1px solid ${C.green}33` : `1px solid ${C.border}` }}>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: C.heading }}>{m.toUpperCase()}</div>
                            <div style={{ fontSize: 9, color: mods[m] ? C.green : C.muted, fontWeight: 700, marginTop: 4 }}>{mods[m] ? 'OPERATIONAL' : 'OFFLINE'}</div>
                        </div>
                        <div onClick={() => toggle(m)} style={{ width: 44, height: 22, background: mods[m] ? C.green : C.muted, borderRadius: 20, position: "relative", cursor: "pointer", transition: "all 0.3s" }}>
                            <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", left: mods[m] ? 24 : 4, top: 3, transition: "all 0.3s" }} />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// ─── Main Dashboard ─────────────────────────────────────────────
export default function DashboardPage() {
    const [active, setActive] = useState("home");
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate("/login"); };

    // Lazy-import sections to keep bundle lean
    const renderContent = () => {
        if (active === "scans") return <ScanRunner />;
        if (active === "reports") return <ReportsList />;
        if (active === "users") return isAdmin(user) ? <UserManagement /> : null;
        if (active === "profile") return <Profile user={user} />;
        if (active === "edit_profile") return <EditProfile user={user} />;
        if (active === "notifications") return <NotificationHub />;

        // All doc sections — lazy loaded
        const sections = {
            home: () => import("../sections/HomeSection").then(m => m.default),
            architecture: () => import("../sections/ArchitectureSection").then(m => m.default),
            agents: () => import("../sections/AgentsSection").then(m => m.default),
            autodebug: () => import("../sections/AutoDebugSection").then(m => m.default),
            seo: () => import("../sections/SEOSection").then(m => m.default),
            jira: () => import("../sections/JIRASection").then(m => m.default),
            issuetracker: () => import("../sections/IssueTrackerSection").then(m => m.default),
            llms: () => import("../sections/LLMSection").then(m => m.default),
            techstack: () => import("../sections/TechStackSection").then(m => m.default),
            roadmap: () => import("../sections/RoadmapSection").then(m => m.default),
            code: () => import("../sections/CodeSection").then(m => m.default),
        };

        // Simple sync render for doc sections (already imported in App)
        return <DocSection sectionId={active} setActive={setActive} />;
    };

    return (
        <Layout active={active} setActive={setActive} user={user} logout={handleLogout}>
            {renderContent()}
        </Layout>
    );
}

// Inline doc section renderer
import HomeSection from "../sections/HomeSection";
import ArchitectureSection from "../sections/ArchitectureSection";
import AgentsSection from "../sections/AgentsSection";
import AutoDebugSection from "../sections/AutoDebugSection";
import SEOSection from "../sections/SEOSection";
import JIRASection from "../sections/JIRASection";
import IssueTrackerSection from "../sections/IssueTrackerSection";
import LLMSection from "../sections/LLMSection";
import TechStackSection from "../sections/TechStackSection";
import RoadmapSection from "../sections/RoadmapSection";
import CodeSection from "../sections/CodeSection";
import MobileSection from "../sections/MobileSection";

import IntelligenceSection from "../sections/IntelligenceSection";

const DOC_MAP = {
    home: HomeSection, architecture: ArchitectureSection, agents: AgentsSection,
    autodebug: AutoDebugSection, jira: JIRASection,
    issuetracker: IssueTrackerSection, llms: LLMSection,
    techstack: TechStackSection, roadmap: RoadmapSection, code: CodeSection,
    mobile: MobileSection,
    websites_seo: SEOSection,
    websites_qa: (props) => <IntelligenceSection {...props} type="WEBSITE QA" title="WEBSITE QUALITY ASSURANCE" subtitle="Autonomous testing & automated regression for web ecosystems" icon="🛡" color={C.green} />,
    websites_dev: (props) => <IntelligenceSection {...props} type="WEBSITE DEVELOPMENT" title="WEBSITE INTELLIGENCE DEV" subtitle="Real-time codebase optimization & predictive development" icon="🚧" color={C.cyan} />,
    software_qa: (props) => <IntelligenceSection {...props} type="SOFTWARE QA" title="SOFTWARE QUALITY ASSURANCE" subtitle="Multi-threaded system verification & performance auditing" icon="💻" color={C.violet} />,
    software_dev: (props) => <IntelligenceSection {...props} type="SOFTWARE DEVELOPMENT" title="SOFTWARE ARCHITECTURE DEV" subtitle="Legacy migration & modern system refactoring automation" icon="🏗" color={C.gold} />,
    mobile_qa: (props) => <IntelligenceSection {...props} type="MOBILE QA" title="MOBILE APP QUALITY ASSURANCE" subtitle="Cross-platform stability & device cloud testing tracks" icon="📱" color={C.green} />,
    mobile_dev: (props) => <IntelligenceSection {...props} type="MOBILE DEVELOPMENT" title="MOBILE APP ARCHITECTURE DEV" subtitle="Native performance & ecosystem synchronization automation" icon="📱" color={C.violet} />,
    settings_general: SettingsGeneral,
    settings_theme: SettingsTheme,
    settings_menu: SettingsMenu,
    settings_roles: SettingsRoles,
    settings_modules: SettingsModules,
};

function DocSection({ sectionId, setActive }) {
    const Comp = DOC_MAP[sectionId];
    return Comp ? <Comp setActive={setActive} /> : <HomeSection setActive={setActive} />;
}
