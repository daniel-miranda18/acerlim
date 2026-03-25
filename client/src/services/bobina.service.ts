import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type { Bobina, StockBobina, CrearBobinaDTO, ActualizarBobinaDTO } from "../types/bobina.types";

export const bobinaService = {
  listar: () => api.get<ApiResponse<Bobina[]>>("/bobinas"),
  getStock: () => api.get<ApiResponse<StockBobina[]>>("/bobinas/stock"),
  obtener: (id: number) => api.get<ApiResponse<Bobina>>(`/bobinas/${id}`),
  crear: (data: CrearBobinaDTO) => api.post<ApiResponse<Bobina>>("/bobinas", data),
  actualizar: (id: number, data: ActualizarBobinaDTO) =>
    api.put<ApiResponse<Bobina>>(`/bobinas/${id}`, data),
  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/bobinas/${id}`),
};

