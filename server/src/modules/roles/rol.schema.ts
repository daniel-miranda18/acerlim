import { z } from "zod";

export const crearRolSchema = z.object({
  nombre: z.string().min(1).max(50),
  descripcion: z.string().max(150).optional(),
  estado: z.number().int().min(0).max(1).default(1),
});

export const actualizarRolSchema = crearRolSchema.partial();

export type CrearRolDTO = z.infer<typeof crearRolSchema>;
export type ActualizarRolDTO = z.infer<typeof actualizarRolSchema>;
