import {
  CHeader,
  CHeaderToggler,
  CHeaderNav,
  CNavItem,
  CButton,
  CAvatar,
  CTooltip,
} from "@coreui/react";
import { cilMenu, cilBell, cilSun, cilMoon, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useTheme } from "../../context/ThemeContext";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <CHeader position="sticky" className="p-0 border-bottom mb-4">
      <div
        className="d-flex align-items-center px-3 w-100"
        style={{ height: 56 }}
      >
        <CHeaderToggler onClick={onToggleSidebar}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <div className="flex-grow-1" />

        <CHeaderNav className="d-flex align-items-center gap-1">
          <CTooltip content={theme === "dark" ? "Modo claro" : "Modo oscuro"}>
            <CButton
              color="secondary"
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="d-flex align-items-center justify-content-center"
              style={{ width: 34, height: 34, borderRadius: 8 }}
            >
              <CIcon icon={theme === "dark" ? cilSun : cilMoon} />
            </CButton>
          </CTooltip>

          <CTooltip content="Notificaciones">
            <CNavItem>
              <CButton
                color="secondary"
                variant="ghost"
                size="sm"
                className="d-flex align-items-center justify-content-center"
                style={{ width: 34, height: 34, borderRadius: 8 }}
              >
                <CIcon icon={cilBell} />
              </CButton>
            </CNavItem>
          </CTooltip>

          <div
            className="mx-1"
            style={{
              width: 1,
              height: 24,
              background: "var(--cui-border-color)",
            }}
          />

          <div
            className="d-flex align-items-center gap-2"
            style={{ cursor: "pointer" }}
          >
            <CAvatar
              color="primary"
              textColor="white"
              size="sm"
              style={{ fontWeight: 700 }}
            >
              <CIcon icon={cilUser} size="sm" />
            </CAvatar>
            <div
              className="d-none d-md-flex flex-column"
              style={{ lineHeight: 1.2 }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                Administrador
              </span>
              <span
                style={{ fontSize: 11, color: "var(--cui-secondary-color)" }}
              >
                Administrador
              </span>
            </div>
          </div>
        </CHeaderNav>
      </div>
    </CHeader>
  );
}
