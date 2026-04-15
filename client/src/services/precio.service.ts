import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type { PrecioMetro, CrearPrecioDTO, ActualizarPrecioDTO } from "../types/precio.types";

export const precioService = {
  listar: () => api.get<ApiResponse<PrecioMetro[]>>("/precios"),
  obtener: (id: number) => api.get<ApiResponse<PrecioMetro>>(`/precios/${id}`),
  crear: (data: CrearPrecioDTO) => api.post<ApiResponse<PrecioMetro>>("/precios", data),
  actualizar: (id: number, data: ActualizarPrecioDTO) =>
    api.put<ApiResponse<PrecioMetro>>(`/precios/${id}`, data),
  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/precios/${id}`),
};
