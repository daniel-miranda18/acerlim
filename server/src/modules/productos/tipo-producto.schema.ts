import { z } from "zod";

export const tipoProductoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
  estado: z.number().int().default(1),
});

export type TipoProductoInput = z.infer<typeof tipoProductoSchema>;
