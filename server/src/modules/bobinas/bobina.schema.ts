import { z } from "zod";

export const crearBobinaSchema = z.object({
  id_lote: z.coerce.number().int().positive("El lote es requerido"),
  id_color: z.coerce.number().int().positive().optional().nullable(),
  espesor: z.coerce.number().positive("Debe ser mayor a 0"),
  ancho: z.coerce.number().positive("Debe ser mayor a 0"),
  peso_inicial: z.coerce.number().positive("Debe ser mayor a 0"),
  peso_actual: z.coerce.number().positive("Debe ser mayor a 0").optional().nullable(),
  metros_lineales_inicial: z.coerce.number().positive("Debe ser mayor a 0").optional().nullable(),
  metros_lineales_actual: z.coerce.number().positive("Debe ser mayor a 0").optional().nullable(),
  estado_bobina: z.enum(["En Inventario", "En Producción", "Agotado"]).optional().nullable(),
});

export const actualizarBobinaSchema = crearBobinaSchema.partial();

export type CrearBobinaDTO = z.infer<typeof crearBobinaSchema>;
export type ActualizarBobinaDTO = z.infer<typeof actualizarBobinaSchema>;
