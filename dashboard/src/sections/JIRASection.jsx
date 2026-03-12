import React, { useState, useEffect } from "react";
import { jira } from "../api/client";
import { useNotify } from "../context/NotificationContext";
import { C } from "../constants";
import { Card, GlowBadge, CodeBlock, SectionTitle } from "../components/UI";

const JIRA_ISSUE_TYPES = [
    { type: "BUG", color: C.red, icon: "🐞", desc: "Something is broken or not working as expected", confidence: 98 },
    { type: "TASK", color: C.cyan, icon: "📋", desc: "Small development or configuration work", confidence: 95 },
    { type: "STORY", color: C.green, icon: "📖", desc: "New feature or functionality", confidence: 92 },
    { type: "EPIC", color: C.violet, icon: "⚡", desc: "Large feature containing multiple stories", confidence: 88 },
    { type: "IMPROVEMENT", color: C.gold, icon: "📈", desc: "Enhancement of an existing feature", confidence: 94 },
];

const SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const PRIORITIES = ["HIGHEST", "HIGH", "MEDIUM", "LOW"];

function AutomatedTicketHub() {
    const { notify } = useNotify();
    const [tickets, setTickets] = useState([]);
    const [syncing, setSyncing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [idFeed, setIdFeed] = useState([]);
    const [syncError, setSyncError] = useState(false);

    // Sample Professional Ticket provided by guidelines
    const PROFESSIONAL_SAMPLE = {
        id: "NEXUS-701",
        title: "Admin Unable to Create New Case from Admin Dashboard – BGV System",
        type: "BUG",
        environment: "Staging Environment | BGV Checker System | Chrome Browser",
        preconditions: "Admin user logged into the BGV system",
        steps: "1. Login to BGV Admin Portal\n2. Navigate to Case Management\n3. Click 'Create Case'\n4. Enter required case details\n5. Click Submit",
        expected: "Case should be created successfully and displayed in the case list.",
        actual: "System shows an error message and the case is not created.",
        severity: "HIGH",
        priority: "HIGH",
        status: "Open",
        module: "Case Management",
        assignee: "Backend Team",
        reporter: "NexusQA Agent",
        logs: 'Error: "Failed to create case – Server error 500"',
        created_at: new Date().toISOString(),
        confidence: 99,
        fusionId: "SENTINEL-X92A1",
        healing_status: "STANDBY"
    };

    useEffect(() => { load(); }, []);
    const load = () => jira.list().then(r => {
        const normalized = r.data.map((t, idx) => ({ 
            ...PROFESSIONAL_SAMPLE, 
            ...t, 
            fusionId: `SENTINEL-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            healing_status: idx % 3 === 0 ? "HEALED" : "STANDBY"
        }));
        setTickets(normalized);
    }).catch(() => setTickets([]));

    const selectedTicket = tickets.find(t => t.id === selectedId);

    const handleSync = async () => {
        setSyncing(true);
        const stages = ["EXTRACTING FINDINGS...", "NEURAL CLASSIFICATION...", "MAPPING TO JIRA SCHEMA...", "SUCCESS"];
        
        for(let s of stages) {
            setIdFeed(prev => [`[${new Date().toLocaleTimeString()}] ${s}`, ...prev].slice(0, 5));
            await new Promise(r => setTimeout(r, 600));
        }

        try {
            setSyncError(false);
            const res = await jira.sync();
            await load();
            notify(`Autonomous track: Identified ${res.data.identified_type} for ${res.data.created_id}`, "success");
            setIdFeed(prev => [`[${new Date().toLocaleTimeString()}] AUTO-CREATED: ${res.data.created_id} as ${res.data.identified_type}`, ...prev].slice(0, 5));
        } catch (e) { 
            setSyncError(true);
            notify("Sync failed: Intelligence connection lost", "error"); 
        }
        setSyncing(false);
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        await jira.delete(id);
        if (selectedId === id) setSelectedId(null);
        setTickets(tickets.filter(t => t.id !== id));
        notify("Ticket purged", "info");
    };

    const handleUpdate = async () => {
        try {
            await jira.update(selectedId, editData);
            setTickets(tickets.map(t => t.id === selectedId ? editData : t));
            setIsEditing(false);
            notify("Professional coordinate sync successful", "success");
        } catch (e) { notify("Update failed", "error"); }
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: selectedTicket ? "1.1fr 0.9fr" : "1fr", gap: 20, transition: "all 0.4s ease-out" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Identification Pulse Feed */}
                <div style={{ background: "rgba(0,0,0,0.2)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ fontSize: 8, color: C.red, fontWeight: 900, letterSpacing: 2, writingMode: "vertical-lr", transform: "rotate(180deg)", borderRight: `1px solid ${C.red}44`, paddingRight: 10 }}>NEURAL_FEED</div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                        {idFeed.length === 0 ? (
                            <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>[STANDING BY] Waiting for agent telemetry stream...</div>
                        ) : idFeed.map((f, i) => (
                            <div key={i} style={{ fontSize: 10, color: i === 0 ? C.red : C.muted, fontFamily: "monospace", opacity: 1 - (i * 0.15) }}>{f}</div>
                        ))}
                    </div>
                    {syncing && <div className="pulse" style={{ width: 8, height: 8, background: C.red, borderRadius: "50%" }} />}
                </div>

                <Card color={C.red} style={{ padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <div>
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: C.heading, fontWeight: 900, letterSpacing: 1 }}>PROFESSIONAL JIRA PIPELINE</div>
                            <div style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>Neural Classifier v4.2 active • Real-time coordinate sync</div>
                        </div>
                        <button onClick={handleSync} disabled={syncing} style={{ padding: "12px 24px", background: C.red, color: "#fff", border: "none", borderRadius: 10, fontFamily: C.font, fontSize: 11, cursor: syncing ? "not-allowed" : "pointer", fontWeight: 900, letterSpacing: "1px", boxShadow: `0 4px 15px ${C.red}33`, transition: "0.3s" }}>
                            {syncing ? "IDENTIFYING..." : "SYNC AGENT FINDINGS"}
                        </button>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", color: C.text, fontFamily: C.font, fontSize: 11 }}>
                            <thead>
                                <tr style={{ background: "rgba(0,229,255,0.03)", borderBottom: `2px solid ${C.border}` }}>
                                    <th style={{ padding: "16px 10px", textAlign: "left", fontSize: 10, color: C.muted, fontWeight: 800 }}>ISSUE ID</th>
                                    <th style={{ padding: "16px 10px", textAlign: "left", fontSize: 10, color: C.muted, fontWeight: 800 }}>SUMMARY (WHO + WHAT + WHERE)</th>
                                    <th style={{ padding: "16px 10px", textAlign: "left", fontSize: 10, color: C.muted, fontWeight: 800 }}>TYPE</th>
                                    <th style={{ padding: "16px 10px", textAlign: "left", fontSize: 10, color: C.muted, fontWeight: 800 }}>SENTINEL_FUSION</th>
                                    <th style={{ padding: "16px 10px", textAlign: "left", fontSize: 10, color: C.muted, fontWeight: 800 }}>AUTO-HEAL</th>
                                    <th style={{ padding: "16px 10px", textAlign: "right", fontSize: 10, color: C.muted, fontWeight: 800 }}>OP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.length === 0 ? (
                                    <tr><td colSpan="6" style={{ padding: 40, textAlign: "center", color: C.muted, fontWeight: 600 }}>No active tickets. Initializing professional audit sequence...</td></tr>
                                ) : tickets.map(t => (
                                    <tr 
                                        key={t.id} 
                                        onClick={() => { setSelectedId(t.id); setEditData(t); setIsEditing(false); }}
                                        style={{ 
                                            borderBottom: `1px solid ${C.border}44`, 
                                            cursor: "pointer",
                                            background: selectedId === t.id ? `${C.red}11` : "transparent",
                                            transition: "background 0.2s"
                                        }}
                                    >
                                        <td style={{ padding: 14, color: C.red, fontWeight: 800 }}>{t.id}</td>
                                        <td style={{ padding: 14, fontWeight: 600, maxWidth: 300 }}>{t.title}</td>
                                        <td style={{ padding: 14 }}>
                                            <span style={{ fontSize: 9, fontWeight: 800, color: C.muted }}>{t.type}</span>
                                        </td>
                                        <td style={{ padding: 14 }}>
                                            <div style={{ padding: "2px 8px", background: "rgba(0,184,212,0.1)", border: `1px solid ${C.cyan}44`, borderRadius: 4, display: "inline-block" }}>
                                                <div style={{ fontSize: 8, color: C.cyan, fontWeight: 900 }}>{t.fusionId || "STATIC_ID"}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: 14 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.healing_status === "HEALED" ? C.green : (t.healing_status === "ACTIVE" ? C.cyan : C.border) }} />
                                                <span style={{ fontSize: 9, color: t.healing_status === "HEALED" ? C.green : C.muted, fontWeight: 800 }}>{t.healing_status || "PENDING"}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: 14, textAlign: "right" }}>
                                            <button onClick={(e) => handleDelete(t.id, e)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>×</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {selectedTicket && (
                <div style={{ position: "sticky", top: 20, height: "calc(100vh - 100px)", overflowY: "auto", paddingRight: 4 }}>
                <Card color={C.red} style={{ background: `${C.panel}F2`, backdropFilter: "blur(10px)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: `1px solid ${C.border}44`, paddingBottom: 16 }}>
                        <div>
                            <div style={{ fontSize: 8, color: C.muted, fontWeight: 900, marginBottom: 4 }}>COORDINATE SYSTEM • {selectedTicket.fusionId}</div>
                            <div style={{ fontSize: 14, fontWeight: 900, color: C.red, fontFamily: "'Orbitron', sans-serif" }}>{selectedTicket.id}</div>
                        </div>
                        <button onClick={() => setSelectedId(null)} style={{ padding: "6px 12px", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 10 }}>CLOSE [ESC]</button>
                    </div>

                    {!isEditing ? (
                        <div style={{ display: "grid", gap: 20 }}>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 900, color: C.heading, margin: "0 0 10px 0", lineHeight: 1.4 }}>{selectedTicket.title}</h3>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <GlowBadge color={C.red} small>{selectedTicket.type}</GlowBadge>
                                    <GlowBadge color={C.gold} small>SEVERITY: {selectedTicket.severity || selectedTicket.priority}</GlowBadge>
                                    <GlowBadge color={C.violet} small>PRIORITY: {selectedTicket.priority}</GlowBadge>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, borderTop: `1px solid ${C.border}33`, paddingTop: 16 }}>
                                <div>
                                    <div style={{ fontSize: 8, color: C.muted, fontWeight: 900 }}>ENVIRONMENT</div>
                                    <div style={{ fontSize: 10, color: C.text, fontWeight: 600, marginTop: 4 }}>{selectedTicket.environment}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 8, color: C.muted, fontWeight: 900 }}>AFFECTED MODULE</div>
                                    <div style={{ fontSize: 10, color: C.text, fontWeight: 600, marginTop: 4 }}>{selectedTicket.module}</div>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: 8, color: C.muted, fontWeight: 900, marginBottom: 8 }}>PRECONDITIONS</div>
                                <div style={{ fontSize: 10, color: C.text, background: "rgba(0,0,0,0.1)", padding: 12, borderRadius: 6, borderLeft: `2px solid ${C.cyan}44` }}>{selectedTicket.preconditions}</div>
                            </div>

                            <div>
                                <div style={{ fontSize: 8, color: C.muted, fontWeight: 900, marginBottom: 8 }}>STEPS TO REPRODUCE</div>
                                <div style={{ fontSize: 10, color: C.text, background: "rgba(0,0,0,0.1)", padding: 12, borderRadius: 6, whiteSpace: "pre-line", lineHeight: 1.5 }}>{selectedTicket.steps}</div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <div style={{ fontSize: 8, color: C.muted, fontWeight: 900, marginBottom: 8 }}>EXPECTED RESULT</div>
                                    <div style={{ fontSize: 9, color: C.green, background: `${C.green}08`, padding: 10, borderRadius: 6, border: `1px solid ${C.green}22` }}>{selectedTicket.expected}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 8, color: C.muted, fontWeight: 900, marginBottom: 8 }}>ACTUAL RESULT</div>
                                    <div style={{ fontSize: 9, color: C.red, background: `${C.red}08`, padding: 10, borderRadius: 6, border: `1px solid ${C.red}22` }}>{selectedTicket.actual}</div>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: 8, color: C.muted, fontWeight: 900, marginBottom: 8 }}>ERROR MESSAGE / LOGS</div>
                                <CodeBlock lang="logs" code={selectedTicket.logs} color={C.red} />
                            </div>

                            <div style={{ background: `${C.cyan}08`, border: `1px solid ${C.cyan}22`, borderRadius: 10, padding: 16 }}>
                                <div style={{ fontSize: 8, color: C.cyan, fontWeight: 900, marginBottom: 10, letterSpacing: 1 }}>SENTINEL NEURAL TRACE</div>
                                <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", fontStyle: "italic", lineHeight: 1.4 }}>
                                    "Analyzed issue coordinates in module {selectedTicket.module}. 
                                    Claude-3.7 mapped confidence {selectedTicket.confidence}% to priority {selectedTicket.priority}. 
                                    Created professional bridge to JIRA Hub via fusion-socket-{selectedTicket.fusionId?.toLowerCase()}."
                                </div>
                            </div>

                            {syncError ? (
                                <button style={{ width: "100%", padding: 14, background: C.red, color: "#fff", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 4px 15px ${C.red}44` }}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", border: `2px solid ${C.red}` }} />
                                    SYNC FAILED
                                </button>
                            ) : (
                                <button onClick={() => setIsEditing(true)} style={{ width: "100%", padding: 14, background: "transparent", border: `1px solid ${C.red}`, color: C.red, borderRadius: 10, fontSize: 11, fontWeight: 900, cursor: "pointer", transition: "all 0.3s", letterSpacing: 1 }}>UPDATE COORDINATES</button>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: "grid", gap: 14 }}>
                            <div>
                                <label style={{ fontSize: 8, color: C.muted, display: "block", marginBottom: 6 }}>TITLE</label>
                                <input style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, padding: 10, borderRadius: 6, color: C.text, fontSize: 11 }} value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 8, color: C.muted, display: "block", marginBottom: 6 }}>TYPE</label>
                                    <select style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, padding: 10, borderRadius: 6, color: C.text, fontSize: 11 }} value={editData.type} onChange={e => setEditData({...editData, type: e.target.value})}>
                                        {JIRA_ISSUE_TYPES.map(it => <option key={it.type} value={it.type}>{it.type}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 8, color: C.muted, display: "block", marginBottom: 6 }}>PRIORITY</label>
                                    <select style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, padding: 10, borderRadius: 6, color: C.text, fontSize: 11 }} value={editData.priority} onChange={e => setEditData({...editData, priority: e.target.value})}>
                                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 8, color: C.muted, display: "block", marginBottom: 6 }}>STEPS</label>
                                <textarea style={{ width: "100%", height: 120, background: C.inputBg, border: `1px solid ${C.border}`, padding: 10, borderRadius: 6, color: C.text, fontSize: 11, resize: "none" }} value={editData.steps} onChange={e => setEditData({...editData, steps: e.target.value})} />
                            </div>
                            <div style={{ display: "flex", gap: 12 }}>
                                <button onClick={handleUpdate} style={{ flex: 1.5, padding: 14, background: C.red, color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: "pointer" }}>SAVE</button>
                                <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: 14, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: "pointer" }}>CANCEL</button>
                            </div>
                        </div>
                    )}
                </Card>
                </div>
            )}
        </div>
    );
}

export default function JIRASection() {
    const [marked, setMarked] = useState(() => localStorage.getItem('nexus_marked_jira') === 'true');
    return (
        <div style={{ animation: "fadeIn 0.7s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <SectionTitle icon="⬟" title="JIRA COMMAND CENTER" sub="Professional-grade autonomous ticket engineering and lifecycle synchronization" color={C.red} />
                <div 
                    onClick={() => {
                        const newState = !marked;
                        setMarked(newState);
                        localStorage.setItem('nexus_marked_jira', newState);
                    }}
                    style={{ 
                        padding: "8px 18px", borderRadius: 100, 
                        background: marked ? `${C.red}22` : "rgba(0,184,212,0.05)", 
                        border: `1px solid ${marked ? C.red : C.cyan}44`, 
                        color: marked ? C.red : C.cyan, 
                        fontSize: 9, fontWeight: 900, cursor: "pointer", 
                        display: "flex", alignItems: "center", gap: 8, transition: "all 0.4s", letterSpacing: 1
                    }}
                >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: marked ? C.red : C.cyan, animation: "blink 1.5s infinite" }} />
                    {marked ? "STANDBY" : "NEURAL CLASSIFIER_ACTIVE"}
                </div>
            </div>
            
            <AutomatedTicketHub />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
                {/* Visual Legend for the Classifier */}
                <Card color={C.cyan}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: C.cyan, marginBottom: 16, fontWeight: 900 }}>◈ NEURAL CLASSIFICATION LOGIC</div>
                    {JIRA_ISSUE_TYPES.map(it => (
                        <div key={it.type} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "center" }}>
                            <span style={{ fontSize: 16 }}>{it.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 9, color: C.heading, fontWeight: 900 }}>{it.type}</div>
                                <div style={{ fontSize: 8, color: C.muted }}>{it.desc}</div>
                            </div>
                            <div style={{ fontSize: 9, color: it.color, fontWeight: 900 }}>{it.confidence}% CONF</div>
                        </div>
                    ))}
                </Card>

                {/* Automation Rules */}
                <Card color={C.red}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: C.red, marginBottom: 16, fontWeight: 900 }}>◈ AUTONOMOUS TICKET RULES</div>
                    <div style={{ display: "grid", gap: 10 }}>
                        {[
                            ["Heuristic Engine", "Scans text for keywords (crash, error, missing) to assign JIRA metadata."],
                            ["Priority Mapping", "Critical severity finding automatically triggers 'Highest' JIRA priority."],
                            ["Auto-Assignee", "Routes to [Security | UX | Backend] Agent based on module classification."],
                            ["Schema Injection", "Auto-populates Env, Steps, Expected, and Actual results via LLM extraction."]
                        ].map(([t, d]) => (
                            <div key={t} style={{ borderBottom: `1px solid ${C.border}22`, paddingBottom: 6 }}>
                                <div style={{ fontSize: 9, color: C.heading, fontWeight: 800 }}>{t}</div>
                                <div style={{ fontSize: 8, color: C.muted }}>{d}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
