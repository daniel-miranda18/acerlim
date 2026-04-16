import { z } from "zod";

export const crearColorSchema = z.object({
  nombre: z.string().min(1).max(100),
  codigo_hex: z
    .string()
    .min(4)
    .max(7)
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Código hexadecimal inválido"),
});

export const actualizarColorSchema = crearColorSchema.partial();

export type CrearColorDTO = z.infer<typeof crearColorSchema>;
export type ActualizarColorDTO = z.infer<typeof actualizarColorSchema>;
