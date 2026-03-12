import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001";

const client = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } });

// Attach JWT token
client.interceptors.request.use(cfg => {
    const token = localStorage.getItem("nexusqa_token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

// Auto-logout on 401
client.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export const auth = {
    login: (d) => client.post("/auth/login", d),
    register: (d) => client.post("/auth/register", d),
    forgotPassword: (d) => client.post("/auth/forgot-password", d),
    resetPassword: (d) => client.post("/auth/reset-password", d),
    me: () => client.get("/auth/me"),
    logout: () => client.post("/auth/logout"),
    updateProfile: (d) => client.put("/auth/profile", d),
    changePassword: (d) => client.post("/auth/change-password", d),
};

export const scans = {
    start: (d) => client.post("/scans/", d),
    list: () => client.get("/scans/"),
    get: (id) => client.get(`/scans/${id}`),
    delete: (id) => client.delete(`/scans/${id}`),
};

export const seo = {
    audit: (url) => client.post(`/seo/audit?url=${url}`),
    status: (id) => client.get(`/seo/status/${id}`),
};

export const debug = {
    run: (log, path) => client.post("/debug/run", { error_log: log, codebase_path: path }),
    status: (id) => client.get(`/debug/status/${id}`),
};

export const jira = {
    list: () => client.get("/jira/tickets"),
    sync: () => client.post("/jira/sync"),
    update: (id, d) => client.put(`/jira/tickets/${id}`, d),
    delete: (id) => client.delete(`/jira/tickets/${id}`),
};

export const reports = {
    list: () => client.get("/reports/"),
    updateStatus: (id, status) => client.patch(`/reports/${id}/status`, { status }),
    delete: (id) => client.delete(`/reports/${id}`),
    downloadPDF: (id) => client.get(`/reports/${id}/pdf`, { responseType: "blob" }),
    downloadCSV: (id) => client.get(`/reports/${id}/csv`, { responseType: "blob" }),
};

export const users = {
    list: () => client.get("/users/"),
    create: (d) => client.post("/users/", d),
    update: (id, d) => client.put(`/users/${id}`, d),
    delete: (id) => client.delete(`/users/${id}`),
    updateRole: (id, r) => client.patch(`/users/${id}/role`, { role: r }),
    toggleStatus: (id) => client.patch(`/users/${id}/status`),
};

export const settings = {
    get: () => client.get("/settings/"),
    update: (d) => client.put("/settings/", d),
};

export const automation = {
    runDaily: () => client.post("/automation/run-daily"),
    getStatus: () => client.get("/automation/status"),
};

export const search = {
    global: (q) => client.get(`/search/?q=${q}`),
};

export default client;
