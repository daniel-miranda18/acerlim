import { z } from "zod";

export const crearRolSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").regex(/.*[a-zA-Z].*/, "Debe contener al menos una letra").max(50, "Máximo 50 caracteres"),
  descripcion: z.string().regex(/^$|.*[a-zA-Z].*/, "Debe contener al menos una letra").max(150, "Máximo 150 caracteres").optional().nullable(),
  estado: z.number().int().min(0).max(1).default(1),
});

export const actualizarRolSchema = crearRolSchema.partial();

export type CrearRolDTO = z.infer<typeof crearRolSchema>;
export type ActualizarRolDTO = z.infer<typeof actualizarRolSchema>;
