import { z } from "zod";

export const crearPermisoSchema = z.object({
  nombre: z.string().min(1).max(80),
  descripcion: z.string().max(150).optional(),
  estado: z.number().int().min(0).max(1).default(1),
});

export const actualizarPermisoSchema = crearPermisoSchema.partial();

export type CrearPermisoDTO = z.infer<typeof crearPermisoSchema>;
export type ActualizarPermisoDTO = z.infer<typeof actualizarPermisoSchema>;
