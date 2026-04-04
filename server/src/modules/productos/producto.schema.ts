import { z } from "zod";

export const crearProductoSchema = z.object({
  id_tipo_producto: z.coerce.number().positive("Seleccione un tipo de producto"),
  descripcion: z.string().optional().nullable(),
  medida_largo: z.coerce.number().positive("Debe ser mayor a 0"),
  medida_ancho: z.coerce.number().positive("Debe ser mayor a 0"),
});

export const actualizarProductoSchema = crearProductoSchema.partial();

export type CrearProductoDTO = z.infer<typeof crearProductoSchema>;
export type ActualizarProductoDTO = z.infer<typeof actualizarProductoSchema>;
