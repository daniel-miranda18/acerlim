import { z } from "zod";

export const crearPrecioSchema = z.object({
  nombre: z.string().min(1).max(100),
  precio_por_metro: z.number().positive(),
  moneda: z.string().max(10).optional(),
});

export const actualizarPrecioSchema = crearPrecioSchema.partial();

export type CrearPrecioDTO = z.infer<typeof crearPrecioSchema>;
export type ActualizarPrecioDTO = z.infer<typeof actualizarPrecioSchema>;
