import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type { Pedido, CrearPedidoDTO } from "../types/pedido.types";

export const pedidoService = {
  listar: () => api.get<ApiResponse<Pedido[]>>("/pedidos"),
  obtener: (id: number) => api.get<ApiResponse<Pedido>>(`/pedidos/${id}`),
  crear: (data: CrearPedidoDTO) => api.post<ApiResponse<Pedido>>("/pedidos", data),
  actualizar: (id: number, data: Partial<CrearPedidoDTO>) =>
    api.put<ApiResponse<Pedido>>(`/pedidos/${id}`, data),
  cambiarEstado: (id: number, estado_pedido: string) =>
    api.patch<ApiResponse<Pedido>>(`/pedidos/${id}/estado`, { estado_pedido }),
  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/pedidos/${id}`),
};
