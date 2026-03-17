import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UsuariosPage from "../pages/usuarios/UsuariosPage";
import RolesPage from "../pages/roles/RolesPage";
import PermisosPage from "../pages/permisos/PermisosPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../pages/login/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "usuarios", element: <UsuariosPage /> },
          { path: "roles", element: <RolesPage /> },
          { path: "permisos", element: <PermisosPage /> },
        ],
      },
    ],
  },
]);
