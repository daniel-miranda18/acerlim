import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type { Produccion, CrearProduccionDTO } from "../types/produccion.types";

export const produccionService = {
  obtenerPorPedido: (id_pedido: number) =>
    api.get<ApiResponse<Produccion[]>>(`/produccion/pedido/${id_pedido}`),
  crear: (data: CrearProduccionDTO) =>
    api.post<ApiResponse<Produccion>>(`/produccion`, data),
};
