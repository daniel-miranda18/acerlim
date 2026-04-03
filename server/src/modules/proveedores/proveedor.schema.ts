import { z } from "zod";

export const crearProveedorSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  contacto: z.string().max(100, "Máximo 100 caracteres").optional().nullable(),
  telefono: z.string().max(20, "Máximo 20 caracteres").optional().nullable(),
  correo: z.string().email("Correo inválido").max(120, "Máximo 120 caracteres").optional().nullable(),
  direccion: z.string().optional().nullable(),
});

export const actualizarProveedorSchema = crearProveedorSchema.partial();

export type CrearProveedorDTO = z.infer<typeof crearProveedorSchema>;
export type ActualizarProveedorDTO = z.infer<typeof actualizarProveedorSchema>;
