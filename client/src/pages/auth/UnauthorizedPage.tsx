import { useAuth } from "../../context/AuthContext";
import "../login/LoginPage.css";

export default function UnauthorizedPage() {
  const { logout } = useAuth();

  return (
    <div className="login-page">
      <div className="orb orb--1" />
      <div className="orb orb--2" />
      <div className="orb orb--3" />
      <div className="ring" />

      <div className="login-glass" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <div className="login-brand" style={{ marginBottom: "1.5rem" }}>
          <div
            className="login-brand__icon"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              boxShadow: "0 4px 14px rgba(239, 68, 68, 0.2)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "28px", height: "28px" }}
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="login-brand__title" style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>403</h1>
          <p className="login-brand__subtitle" style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ef4444" }}>
            Acceso Denegado
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <p className="login-brand__subtitle" style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
            No tienes los permisos necesarios para acceder a esta página.
            <br />
            Si crees que es un error, contacta al administrador.
          </p>
        </div>

        <button 
          className="login-submit" 
          type="button" 
          style={{ maxWidth: "250px", margin: "0 auto" }}
          onClick={logout}
        >
          Cerrar Sesión y Volver
        </button>
      </div>
    </div>
  );
}
