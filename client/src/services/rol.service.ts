import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type {
  Rol,
  RolConPermisos,
  CrearRolDTO,
  ActualizarRolDTO,
} from "../types/rol.types";

export const rolService = {
  listar: () => api.get<ApiResponse<Rol[]>>("/roles"),
  obtener: (id: number) => api.get<ApiResponse<Rol>>(`/roles/${id}`),
  crear: (data: CrearRolDTO) => api.post<ApiResponse<Rol>>("/roles", data),
  actualizar: (id: number, data: ActualizarRolDTO) =>
    api.put<ApiResponse<Rol>>(`/roles/${id}`, data),
  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/roles/${id}`),
  listarPermisos: (id: number) =>
    api.get<ApiResponse<RolConPermisos>>(`/roles/${id}/permisos`),
  sincronizarPermisos: (id: number, permisos: number[]) =>
    api.put<ApiResponse<RolConPermisos>>(`/roles/${id}/permisos`, { permisos }),
};
