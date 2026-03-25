import { z } from "zod";

export const crearBobinaSchema = z.object({
  codigo_lote: z.string().min(1, "El código de lote es requerido").max(50, "Máximo 50 caracteres"),
  color: z.string().min(1, "El color es requerido").max(50, "Máximo 50 caracteres"),
  espesor: z.coerce.number().positive("Debe ser mayor a 0"),
  ancho: z.coerce.number().positive("Debe ser mayor a 0"),
  peso_inicial: z.coerce.number().positive("Debe ser mayor a 0"),
  peso_actual: z.coerce.number().positive("Debe ser mayor a 0"),
  fecha_ingreso: z.string().optional().nullable(),
  proveedor: z.string().max(100, "Máximo 100 caracteres").optional().nullable(),
  estado_bobina: z.string().max(50, "Máximo 50 caracteres").optional().nullable(),
});

export const actualizarBobinaSchema = crearBobinaSchema.partial();

export type CrearBobinaDTO = z.infer<typeof crearBobinaSchema>;
export type ActualizarBobinaDTO = z.infer<typeof actualizarBobinaSchema>;
