import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, verify2FA, resend2FA, cancel2FA, user, pending2FA } =
    useAuth();

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (pending2FA) {
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
    }
  }, [pending2FA]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c: number) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (pending2FA && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [pending2FA]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo || !clave) return;
    setLoading(true);
    try {
      await login(correo, clave);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newOtp.every((d) => d !== "")) {
      submitOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
      submitOtp(pasted);
    }
  };

  const submitOtp = async (code: string) => {
    setOtpLoading(true);
    try {
      await verify2FA(code);
    } catch {
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resend2FA();
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {}
  };

  const handleBack = () => {
    cancel2FA();
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="login-page">
      <div className="orb orb--1" />
      <div className="orb orb--2" />
      <div className="orb orb--3" />
      <div className="ring" />
      <div
        className={`login-glass ${pending2FA ? "login-glass--pending" : ""}`}
      >
        <div className="login-brand">
          <div className="login-brand__icon">A</div>
          <h1 className="login-brand__title">Acerlim</h1>
          <p className="login-brand__subtitle">Sistema de Gestión Integral</p>
        </div>

        <div className="login-steps">
          <div
            className={`login-step${!pending2FA ? " login-step--active" : " login-step--left"}`}
          >
            <form onSubmit={handleLogin} autoComplete="on">
              <div className="login-field" style={{ marginBottom: "1rem" }}>
                <label className="login-field__label" htmlFor="login-email">
                  Correo electrónico
                </label>
                <div className="login-field__input-wrap">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 1 0-16 0" />
                  </svg>
                  <input
                    id="login-email"
                    className="login-field__input"
                    type="email"
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <div className="login-field" style={{ marginBottom: "1.5rem" }}>
                <label className="login-field__label" htmlFor="login-password">
                  Contraseña
                </label>
                <div className="login-field__input-wrap">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="login-password"
                    className="login-field__input"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <div className="login-field">
                <button
                  type="submit"
                  className={`login-submit${loading ? " login-submit--loading" : ""}`}
                  disabled={loading}
                >
                  {loading && <span className="login-spinner" />}
                  {loading ? "Verificando…" : "Entrar"}
                </button>
              </div>
            </form>
            <div className="login-footer">
              Diseñado para optimizar tus procesos
            </div>
          </div>
          <div
            className={`login-step${pending2FA ? " login-step--active" : " login-step--right"}`}
          >
            <div className="otp-section">
              <div className="otp-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <h2 className="otp-title">Verifica tu identidad</h2>
              <p className="otp-subtitle">
                Ingresa el código de 6 dígitos enviado a
              </p>
              <p className="otp-email">{pending2FA?.correo}</p>

              <div className="otp-inputs" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    className={`otp-input${digit ? " otp-input--filled" : ""}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    disabled={otpLoading}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              {otpLoading && (
                <div className="otp-verifying">
                  <span className="login-spinner" />
                  Verificando…
                </div>
              )}

              <div className="otp-actions">
                <button
                  type="button"
                  className="otp-resend"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Reenviar en ${resendCooldown}s`
                    : "Reenviar código"}
                </button>
                <button type="button" className="otp-back" onClick={handleBack}>
                  ← Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
