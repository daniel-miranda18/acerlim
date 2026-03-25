import { z } from "zod";

export const crearPermisoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").regex(/.*[a-zA-Z].*/, "Debe contener al menos una letra").max(80, "Máximo 80 caracteres"),
  descripcion: z.string().regex(/^$|.*[a-zA-Z].*/, "Debe contener al menos una letra").max(150, "Máximo 150 caracteres").optional().nullable(),
  estado: z.number().int().min(0).max(1).default(1),
});

export const actualizarPermisoSchema = crearPermisoSchema.partial();

export type CrearPermisoDTO = z.infer<typeof crearPermisoSchema>;
export type ActualizarPermisoDTO = z.infer<typeof actualizarPermisoSchema>;
