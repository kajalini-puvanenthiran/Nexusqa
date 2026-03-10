import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LoginPage, RegisterPage, ForgotPasswordPage } from "./pages/AuthPages";
import DashboardPage from "./pages/DashboardPage";
import { useEffect } from "react";

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", background: "#03070d", display: "flex", alignItems: "center", justifyContent: "center", color: "#00e5ff", fontFamily: "monospace", fontSize: 12 }}>⟳ Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function SocialCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const role = params.get("role");
    const name = params.get("name");

    if (token) {
      localStorage.setItem("nexusqa_token", token);
      setUser({ full_name: name || "Social User", role: role || "user" });
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [location, navigate, setUser]);

  return <div style={{ color: "#fff", padding: 40, background: "#03070d", minHeight: "100vh" }}>Finishing login...</div>;
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
              <Route path="/auth/callback" element={<SocialCallback />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><DashboardPage /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
