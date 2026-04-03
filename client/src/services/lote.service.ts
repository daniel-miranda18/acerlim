import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type { Lote, CrearLoteDTO, ActualizarLoteDTO } from "../types/lote.types";

export const loteService = {
  getLotes: () => api.get<ApiResponse<Lote[]>>("/lotes"),

  getLoteById: (id: number) => api.get<ApiResponse<Lote>>(`/lotes/${id}`),

  crearLote: (data: CrearLoteDTO) => api.post<ApiResponse<Lote>>("/lotes", data),

  actualizarLote: (id: number, data: ActualizarLoteDTO) =>
    api.put<ApiResponse<Lote>>(`/lotes/${id}`, data),

  eliminarLote: (id: number) => api.delete<ApiResponse<null>>(`/lotes/${id}`),
};
