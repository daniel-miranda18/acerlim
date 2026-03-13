import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@coreui/coreui/dist/css/coreui.min.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "./styles/theme.css";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import ToastProvider from "./components/shared/ToastProvider";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <ToastProvider />
    </ThemeProvider>
  </StrictMode>,
);
