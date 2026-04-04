import {
  CSidebar,
  CSidebarNav,
  CSidebarToggler,
  CNavItem,
  CNavTitle,
} from "@coreui/react";
import {
  cilSpeedometer,
  cilPeople,
  cilShieldAlt,
  cilLockLocked,
  cilLayers,
  cilHouse,
  cilTags,
  cilTruck,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

interface SidebarProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onToggle: () => void;
}

export default function Sidebar({ visible, onVisibleChange, onToggle }: SidebarProps) {
  const { theme } = useTheme();

  return (
    <CSidebar
      className="border-end"
      colorScheme={theme}
      position="fixed"
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <div
        className="d-flex align-items-center gap-3 px-4"
        style={{
          height: 64,
          borderBottom: "1px solid var(--cui-border-color)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: "#fff",
            fontSize: 16,
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
          }}
        >
          A
        </div>
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "-0.4px",
              lineHeight: 1.1,
            }}
          >
            Acerlim
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--cui-secondary-color)",
              letterSpacing: "0.3px",
            }}
          >
            Sistema de gestión
          </div>
        </div>
      </div>

      <CSidebarNav>
        <CNavTitle>Principal</CNavTitle>

        <CNavItem>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <CIcon icon={cilSpeedometer} customClassName="nav-icon" />
            Dashboard
          </NavLink>
        </CNavItem>

        <CNavTitle>Almacén e Inventario</CNavTitle>

        <CNavItem>
          <NavLink
            to="/bobinas"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <CIcon icon={cilLayers} customClassName="nav-icon" />
            Bobinas
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink
            to="/productos"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <CIcon icon={cilTags} customClassName="nav-icon" />
            Tipos de Calamina
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink
            to="/proveedores"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <CIcon icon={cilTruck} customClassName="nav-icon" />
            Proveedores
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink
            to="/lotes"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <CIcon icon={cilLayers} customClassName="nav-icon" />
            Lotes
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink
            to="/cotizacion"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <CIcon icon={cilHouse} customClassName="nav-icon" />
            Cotización Techo
          </NavLink>
        </CNavItem>
        
        <CNavTitle>Administración</CNavTitle>

        <CNavItem>
          <NavLink
            to="/usuarios"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <CIcon icon={cilPeople} customClassName="nav-icon" />
            Usuarios
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink
            to="/roles"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <CIcon icon={cilShieldAlt} customClassName="nav-icon" />
            Roles
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink
            to="/permisos"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <CIcon icon={cilLockLocked} customClassName="nav-icon" />
            Permisos
          </NavLink>
        </CNavItem>
      </CSidebarNav>

      <CSidebarToggler onClick={onToggle} />
    </CSidebar>
  );
}
