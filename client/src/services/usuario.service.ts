import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type {
  Usuario,
  CrearUsuarioDTO,
  ActualizarUsuarioDTO,
} from "../types/usuario.types";

export const usuarioService = {
  listar: () => api.get<ApiResponse<Usuario[]>>("/usuarios"),
  obtener: (id: number) => api.get<ApiResponse<Usuario>>(`/usuarios/${id}`),
  crear: (data: CrearUsuarioDTO) =>
    api.post<ApiResponse<Usuario>>("/usuarios", data),
  actualizar: (id: number, data: ActualizarUsuarioDTO) =>
    api.put<ApiResponse<Usuario>>(`/usuarios/${id}`, data),
  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/usuarios/${id}`),
};
