import { z } from "zod";

export const asignarPermisosSchema = z.object({
  permisos: z
    .array(z.number().int().positive())
    .min(1, "Debe enviar al menos un permiso"),
});

export type AsignarPermisosDTO = z.infer<typeof asignarPermisosSchema>;
