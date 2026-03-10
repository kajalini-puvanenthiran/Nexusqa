import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("nexusqa_token");
        if (token) {
            auth.me()
                .then(r => setUser(r.data))
                .catch(() => { localStorage.clear(); setUser(null); })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const r = await auth.login({ email, password });
        localStorage.setItem("nexusqa_token", r.data.access_token);
        const me = await auth.me();
        setUser(me.data);
        return me.data;
    };

    const logout = () => {
        auth.logout().catch(() => { });
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
export const isAdmin = (u) => u?.role === "admin";
export const isNormal = (u) => u?.role === "user";
