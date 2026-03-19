import { useState, useRef, useEffect } from "react";
import { CHeader, CHeaderToggler } from "@coreui/react";
import { cilMenu, cilSun, cilMoon } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../shared/ConfirmModal";
import "./Header.css";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = user?.nombre || "Usuario";
  const userRole = user?.rol?.nombre || "Administrador";

  return (
    <>
      <CHeader position="sticky" className="p-0 border-bottom mb-4">
        <div
          className="d-flex align-items-center px-3 w-100"
          style={{ height: 56 }}
        >
          <CHeaderToggler onClick={onToggleSidebar}>
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <div className="flex-grow-1" />
          <div className="d-flex align-items-center gap-2">
            <button
              className="header-btn-glass"
              onClick={toggleTheme}
              title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            >
              <CIcon icon={theme === "dark" ? cilSun : cilMoon} size="sm" />
            </button>
            <button className="header-btn-glass" title="Notificaciones">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <div
                className="header-user-toggle"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="header-user-toggle__avatar">
                  {getInitials(userName)}
                </div>
                <div className="d-none d-md-flex flex-column">
                  <span className="header-user-toggle__name">{userName}</span>
                  <span className="header-user-toggle__role">{userRole}</span>
                </div>
                <svg
                  className={`header-user-toggle__chevron${dropdownOpen ? " header-user-toggle__chevron--open" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div
                className={`header-dropdown${dropdownOpen ? " header-dropdown--open" : ""}`}
              >
                <div
                  className="d-md-none"
                  style={{ padding: "0.5rem 0.75rem 0.25rem" }}
                >
                  <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                    {userName}
                  </div>
                  <div style={{ fontSize: "0.72rem", opacity: 0.6 }}>
                    {userRole}
                  </div>
                </div>
                <div className="header-dropdown__separator d-md-none" />

                <button
                  className="header-dropdown__item header-dropdown__item--danger"
                  onClick={handleLogoutClick}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </CHeader>

      <ConfirmModal
        visible={showLogoutModal}
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
        confirmText="Cerrar sesión"
        confirmColor="danger"
      />
    </>
  );
}
