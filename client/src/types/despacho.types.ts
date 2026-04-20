export interface DespachoDetalle {
  id_despacho_detalle: number;
  id_despacho: number;
  id_pedido: number;
  id_pedido_detalle: number;
  cantidad_entregada: number;
  pedido_detalle?: {
    id_detalle: number;
    id_pedido: number;
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    producto: {
      id_producto: number;
      descripcion: string;
    };
  };
}

export interface Despacho {
  id_despacho: number;
  fecha_despacho: string;
  receptor: string | null;
  observaciones: string | null;
  estado: number;
  fecha_creacion: string;
  detalles: DespachoDetalle[];
}

export interface CrearDespachoDTO {
  receptor?: string | null;
  observaciones?: string | null;
  detalles: {
    id_pedido: number;
    id_pedido_detalle: number;
    cantidad_entregada: number;
  }[];
}
