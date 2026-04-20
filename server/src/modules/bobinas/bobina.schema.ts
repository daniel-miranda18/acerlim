import { z } from "zod";

export const crearBobinaSchema = z.object({
  id_lote: z.coerce.number().int().positive("El lote es requerido"),
  id_color: z.coerce.number().int().positive().optional().nullable(),
  espesor: z.coerce.number().positive("Debe ser mayor a 0").max(999.99, "El espesor no puede exceder 999.99"),
  ancho: z.coerce.number().positive("Debe ser mayor a 0").max(999999.99, "El ancho no puede exceder 999,999.99"),
  peso_inicial: z.coerce.number().positive("Debe ser mayor a 0").max(99999999.99, "El peso no puede exceder 99,999,999.99"),
  peso_actual: z.coerce.number().positive("Debe ser mayor a 0").max(99999999.99, "El peso no puede exceder 99,999,999.99").optional().nullable(),
  metros_lineales_inicial: z.coerce.number().positive("Debe ser mayor a 0").max(99999999.99, "Los metros no pueden exceder 99,999,999.99").optional().nullable(),
  metros_lineales_actual: z.coerce.number().positive("Debe ser mayor a 0").max(99999999.99, "Los metros no pueden exceder 99,999,999.99").optional().nullable(),
  estado_bobina: z.enum(["En Inventario", "En Producción", "Agotado"]).optional().nullable(),
});

export const actualizarBobinaSchema = crearBobinaSchema.partial();

export type CrearBobinaDTO = z.infer<typeof crearBobinaSchema>;
export type ActualizarBobinaDTO = z.infer<typeof actualizarBobinaSchema>;
