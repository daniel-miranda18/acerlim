import api from "./api";
import type { ApiResponse } from "../types/api.types";

export interface PedidoDetalle {
  id_detalle: number;
  id_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number | null;
  producto?: any;
}

export interface Pedido {
  id_pedido: number;
  nombre_cliente: string;
  fecha: string;
  id_dibujo: number | null;
  subtotal: number | null;
  total: number | null;
  observaciones: string | null;
  estado_pedido: string;
  estado: number;
  detalles: PedidoDetalle[];
  dibujo?: any;
}

export interface CrearPedidoDTO {
  nombre_cliente: string;
  fecha: string;
  id_dibujo?: number;
  subtotal?: number;
  total?: number;
  observaciones?: string;
  detalles: {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export const pedidoService = {
  listar: () => api.get<ApiResponse<Pedido[]>>("/pedidos"),
  obtener: (id: number) => api.get<ApiResponse<Pedido>>(`/pedidos/${id}`),
  crear: (data: CrearPedidoDTO) => api.post<ApiResponse<Pedido>>("/pedidos", data),
  actualizar: (id: number, data: Partial<CrearPedidoDTO>) =>
    api.put<ApiResponse<Pedido>>(`/pedidos/${id}`, data),
  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/pedidos/${id}`),
};
