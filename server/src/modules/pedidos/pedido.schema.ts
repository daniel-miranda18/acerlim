import { z } from "zod";

export const pedidoDetalleSchema = z.object({
  id_producto: z.number(),
  cantidad: z.number().int().positive(),
  precio_unitario: z.number().positive(),
  subtotal: z.number().optional(),
});

export const crearPedidoSchema = z.object({
  nombre_cliente: z.string().min(1).max(150),
  fecha: z.string(),
  id_dibujo: z.number().optional(),
  subtotal: z.number().optional(),
  total: z.number().optional(),
  observaciones: z.string().optional(),
  detalles: z.array(pedidoDetalleSchema).min(1),
});

export const actualizarPedidoSchema = crearPedidoSchema.partial();

export type CrearPedidoDTO = z.infer<typeof crearPedidoSchema>;
export type ActualizarPedidoDTO = z.infer<typeof actualizarPedidoSchema>;
export type PedidoDetalleDTO = z.infer<typeof pedidoDetalleSchema>;
