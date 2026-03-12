import { createContext, useContext, useState, useCallback } from "react";
import { C } from "../constants";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [activeToasts, setActiveToasts] = useState([]);

    const notify = useCallback((text, type = "info", detail = "") => {
        const id = Date.now().toString();
        const newNote = { id, text, type, detail, time: new Date().toLocaleTimeString(), read: false };

        // Add to persistent list
        setNotifications(prev => [newNote, ...prev]);

        // Add to active toasts
        setActiveToasts(prev => [...prev, newNote]);

        // Remove toast after delay
        setTimeout(() => {
            setActiveToasts(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    const clearNotifications = () => setNotifications([]);
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            (id === undefined || n.id === id) ? { ...n, read: true } : n
        ));
    };

    return (
        <NotificationContext.Provider value={{ notify, notifications, activeToasts, clearNotifications, markAsRead }}>
            {children}

            {/* Toast Layer */}
            <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
                {activeToasts.map(n => (
                    <div key={n.id} style={{
                        padding: "14px 24px",
                        background: n.type === "error" ? "#ff1744" : (n.type === "success" ? "#00e676" : "#00e5ff"),
                        color: "#000",
                        borderRadius: 8,
                        fontFamily: "sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                        animation: "slideInNote 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        minWidth: 280,
                        border: "1px solid rgba(255,255,255,0.2)"
                    }}>
                        <style>{`
                            @keyframes slideInNote { 
                                from { transform: translateX(120%); opacity: 0 } 
                                to { transform: translateX(0); opacity: 1 } 
                            }
                            @keyframes fadeOutNote {
                                from { opacity: 1 }
                                to { opacity: 0 }
                            }
                        `}</style>
                        <span style={{ fontSize: 16 }}>
                            {n.type === "error" ? "🛑" : (n.type === "success" ? "🎯" : "⚡")}
                        </span>
                        <span>{n.text.toUpperCase()}</span>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export const useNotify = () => useContext(NotificationContext);
