import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type {
  Despacho,
  DespachoQrData,
  CrearDespachoDTO,
} from "../types/despacho.types";

export const despachoService = {
  listar: () => api.get<ApiResponse<Despacho[]>>("/despachos"),
  generarQr: (codigo: string) =>
    api.get<ApiResponse<DespachoQrData>>(`/despachos/qr/${codigo}`),
  buscarPorCodigoQr: (codigo: string) =>
    api.get<ApiResponse<Despacho>>(`/despachos/buscar/${codigo}`),
  crear: (data: CrearDespachoDTO) =>
    api.post<ApiResponse<Despacho>>("/despachos", data),
};
