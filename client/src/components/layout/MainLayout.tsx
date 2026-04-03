import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CContainer } from "@coreui/react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarVisible, setSidebarVisible] = useState(
    window.innerWidth >= 768,
  );
  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isNowMobile = e.matches;
      setIsMobile(isNowMobile);
      setSidebarVisible(!isNowMobile);
    };

    // Initial check
    handleMediaChange(mediaQuery);

    // Listener for changes (like opening/closing F12)
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // En móvil cierra el sidebar al navegar
  useEffect(() => {
    if (isMobile && sidebarVisible) {
      setSidebarVisible(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);
  const handleVisibleChange = (visible: boolean) => setSidebarVisible(visible);

  return (
    <div>
      <Sidebar 
        visible={sidebarVisible} 
        onVisibleChange={handleVisibleChange}
        onToggle={toggleSidebar} 
      />

      {isMobile && sidebarVisible && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1028,
          }}
        />
      )}

      <div
        className="wrapper d-flex flex-column min-vh-100"
        style={{
          marginLeft: !isMobile && sidebarVisible ? 256 : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header onToggleSidebar={toggleSidebar} />
        <div className="body flex-grow-1">
          <CContainer fluid className="px-3 px-md-4 py-3">
            <Outlet />
          </CContainer>
        </div>
        <footer className="footer border-top px-4 py-2 d-flex align-items-center">
          <small className="text-secondary">© 2026 Acerlim</small>
        </footer>
      </div>
    </div>
  );
}
