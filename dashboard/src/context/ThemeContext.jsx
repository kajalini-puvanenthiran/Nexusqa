import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(localStorage.getItem("nexus_theme") || "dark");

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        localStorage.setItem("nexus_theme", next);
    };

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "light") {
            root.style.setProperty("--bg", "#f4f7fa");
            root.style.setProperty("--panel", "#ffffff");
            root.style.setProperty("--border", "#e1e8f0");
            root.style.setProperty("--text", "#0f172a");
            root.style.setProperty("--muted", "#64748b");
            root.style.setProperty("--heading", "#1e293b");
            root.style.setProperty("--input-bg", "rgba(0,0,0,0.05)");
            
            // Sync Nexus Defaults for Light Mode
            root.style.setProperty("--nexus-text-color", "#0f172a");
            root.style.setProperty("--nexus-sidebar-bg", "#ffffff");
            root.style.setProperty("--nexus-button-color", "var(--nexus-primary-color, #00e5ff)");
        } else {
            root.style.setProperty("--bg", "#03070d");
            root.style.setProperty("--panel", "#070f1a");
            root.style.setProperty("--border", "#0d2035");
            root.style.setProperty("--text", "#c0d8f0");
            root.style.setProperty("--muted", "#3a6080");
            root.style.setProperty("--heading", "#ffffff");
            root.style.setProperty("--input-bg", "rgba(255,255,255,0.03)");

            // Sync Nexus Defaults for Dark Mode
            root.style.setProperty("--nexus-text-color", "#ffffff");
            root.style.setProperty("--nexus-sidebar-bg", "#070f1a");
            root.style.setProperty("--nexus-button-color", "var(--nexus-primary-color, #00e5ff)");
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
