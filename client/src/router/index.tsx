import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UsuariosPage from "../pages/usuarios/UsuariosPage";
import RolesPage from "../pages/roles/RolesPage";
import PermisosPage from "../pages/permisos/PermisosPage";

export const router = createBrowserRouter([
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
]);
