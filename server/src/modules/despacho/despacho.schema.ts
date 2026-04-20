import { z } from "zod";

export const crearDespachoSchema = z.object({
  receptor: z.string().max(150, "El receptor no puede exceder 150 caracteres").optional().nullable(),
  observaciones: z.string().optional().nullable(),
  detalles: z.array(z.object({
    id_pedido: z.number().int().positive("El ID del pedido es requerido"),
    id_pedido_detalle: z.number().int().positive("El ID del detalle del pedido es requerido"),
    cantidad_entregada: z.number().positive("La cantidad debe ser mayor a 0"),
  })).nonempty("Al menos un detalle es requerido"),
});

export type CrearDespachoDTO = z.infer<typeof crearDespachoSchema>;
