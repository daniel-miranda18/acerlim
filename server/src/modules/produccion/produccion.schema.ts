import { z } from "zod";

export const crearProduccionSchema = z.object({
  id_pedido: z.coerce.number().int().positive("El pedido es requerido"),
  id_bobina: z.coerce.number().int().positive("La bobina es requerida"),
  metros_consumidos: z.coerce.number().positive("Los metros deben ser mayores a 0"),
  observaciones: z.string().optional().nullable(),
});

export type CrearProduccionDTO = z.infer<typeof crearProduccionSchema>;
