import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo || !clave) return;

    setLoading(true);
    try {
      await login(correo, clave);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 login-card border-0 shadow-lg">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1 className="text-primary fw-bold">Iniciar Sesión</h1>
                    <p className="text-body-secondary">Accede a tu cuenta de Acerlim</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText className="bg-light border-0">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Correo electrónico"
                        autoComplete="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        disabled={loading}
                        required
                        className="bg-light border-0 py-2 shadow-none"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText className="bg-light border-0">
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                        disabled={loading}
                        required
                        className="bg-light border-0 py-2 shadow-none"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12}>
                        <CButton
                          color="primary"
                          className="px-4 w-100 py-2 fw-semibold"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Iniciando..." : "Entrar"}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 brand-card border-0 shadow-lg d-none d-md-block" style={{ width: '44%' }}>
                <CCardBody className="text-center d-flex align-items-center justify-content-center">
                  <div>
                    <h2 className="fw-bold mb-3">Acerlim</h2>
                    <p>
                        Sistema de Gestión Integral.
                        Diseñado para optimizar tus procesos y mejorar la productividad de tu negocio.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}
