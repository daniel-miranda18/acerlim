import { z } from "zod";

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(1).max(100),
  correo: z.string().email().max(120),
  clave: z.string().min(6).max(255),
  id_rol: z.number().int().optional(),
  telefono: z.string().max(20).optional(),
  estado: z.number().int().min(0).max(1).default(1),
});

export const actualizarUsuarioSchema = crearUsuarioSchema
  .omit({ clave: true })
  .partial();

export type CrearUsuarioDTO = z.infer<typeof crearUsuarioSchema>;
export type ActualizarUsuarioDTO = z.infer<typeof actualizarUsuarioSchema>;
