import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: 8,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 14,
        },
        success: { iconTheme: { primary: "#22C55E", secondary: "#fff" } },
        error: { iconTheme: { primary: "#F43F5E", secondary: "#fff" } },
      }}
    />
  );
}
