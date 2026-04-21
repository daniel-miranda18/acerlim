import type { Producto } from "./producto.types";

export interface PedidoDetalle {
  id_detalle: number;
  id_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number | null;
  cantidad_entregada: number;
  producto?: Producto;
}

export interface PedidoProduccion {
  id_produccion: number;
  bobina: {
    color_rel?: {
      codigo_hex: string;
      nombre: string;
    } | null;
  };
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
  producciones?: PedidoProduccion[];
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
