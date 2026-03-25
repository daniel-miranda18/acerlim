import { z } from "zod";

export const crearProductoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  descripcion: z.string().optional().nullable(),
  color: z.string().min(1, "El color es requerido").max(50, "Máximo 50 caracteres"),
  medida_largo: z.coerce.number().positive("Debe ser mayor a 0"),
  medida_ancho: z.coerce.number().positive("Debe ser mayor a 0"),
});

export const actualizarProductoSchema = crearProductoSchema.partial();

export type CrearProductoDTO = z.infer<typeof crearProductoSchema>;
export type ActualizarProductoDTO = z.infer<typeof actualizarProductoSchema>;
