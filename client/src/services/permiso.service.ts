import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type {
  Permiso,
  CrearPermisoDTO,
  ActualizarPermisoDTO,
} from "../types/permiso.types";

export const permisoService = {
  listar: () => api.get<ApiResponse<Permiso[]>>("/permisos"),
  obtener: (id: number) => api.get<ApiResponse<Permiso>>(`/permisos/${id}`),
  crear: (data: CrearPermisoDTO) =>
    api.post<ApiResponse<Permiso>>("/permisos", data),
  actualizar: (id: number, data: ActualizarPermisoDTO) =>
    api.put<ApiResponse<Permiso>>(`/permisos/${id}`, data),
  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/permisos/${id}`),
};
