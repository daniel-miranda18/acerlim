import { z } from "zod";

export const crearLoteSchema = z.object({
  codigo_lote: z.string().min(1, "El código de lote es requerido").max(50, "Máximo 50 caracteres"),
  id_proveedor: z.coerce.number().int().positive().optional().nullable(),
  fecha_ingreso: z.string().optional().nullable(),
});

export const actualizarLoteSchema = crearLoteSchema.partial();

export type CrearLoteDTO = z.infer<typeof crearLoteSchema>;
export type ActualizarLoteDTO = z.infer<typeof actualizarLoteSchema>;
