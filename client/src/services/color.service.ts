import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type { Color, CrearColorDTO, ActualizarColorDTO } from "../types/color.types";

export const colorService = {
  listar: () => api.get<ApiResponse<Color[]>>("/colores"),
  obtener: (id: number) => api.get<ApiResponse<Color>>(`/colores/${id}`),
  crear: (data: CrearColorDTO) => api.post<ApiResponse<Color>>("/colores", data),
  actualizar: (id: number, data: ActualizarColorDTO) =>
    api.put<ApiResponse<Color>>(`/colores/${id}`, data),
  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/colores/${id}`),
};
