import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UsuariosPage from "../pages/usuarios/UsuariosPage";
import RolesPage from "../pages/roles/RolesPage";
import PermisosPage from "../pages/permisos/PermisosPage";
import BobinasPage from "../pages/bobinas/BobinasPage";
import ProductosPage from "../pages/productos/ProductosPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../pages/login/LoginPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";
import ModeladoPage from "../pages/modelado/ModeladoPage";
import ProveedoresPage from "../pages/proveedores/ProveedoresPage";
import LotesPage from "../pages/bobinas/LotesPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute allowedRoles={["gerente"]} />,
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
          { path: "bobinas", element: <BobinasPage /> },
          { path: "productos", element: <ProductosPage /> },
          { path: "modelado", element: <ModeladoPage /> },
          { path: "proveedores", element: <ProveedoresPage /> },
          { path: "lotes", element: <LotesPage /> },
        ],
      },
    ],
  },
]);
