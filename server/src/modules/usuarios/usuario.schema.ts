import { z } from "zod";

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo debe contener letras y espacios").max(100, "Máximo 100 caracteres"),
  correo: z.string().min(1, "El correo es requerido").email("Correo electrónico inválido").max(120, "Máximo 120 caracteres"),
  clave: z.string().min(6, "La clave debe tener mínimo 6 caracteres").max(255, "Máximo 255 caracteres"),
  id_rol: z.coerce.number().int().optional().nullable(),
  telefono: z.string().regex(/^$|^(\+?591[\s-]?)?([67]\d{7}|[2-4]\d{6})$/, "Debe ser un número válido de Bolivia (ej. 71234567)").max(20, "Máximo 20 caracteres").optional().nullable(),
  estado: z.number().int().min(0).max(1).default(1),
});

export const actualizarUsuarioSchema = crearUsuarioSchema
  .omit({ clave: true })
  .partial();

export type CrearUsuarioDTO = z.infer<typeof crearUsuarioSchema>;
export type ActualizarUsuarioDTO = z.infer<typeof actualizarUsuarioSchema>;
