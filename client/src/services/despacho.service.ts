import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type { Despacho, CrearDespachoDTO } from "../types/despacho.types";

export const despachoService = {
  listar: () => api.get<ApiResponse<Despacho[]>>("/despachos"),
  crear: (data: CrearDespachoDTO) => api.post<ApiResponse<Despacho>>("/despachos", data),
};
