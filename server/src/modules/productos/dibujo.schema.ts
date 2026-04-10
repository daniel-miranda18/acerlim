import { z } from "zod";

export const dibujoCalaminaSchema = z.object({
  id_producto: z.coerce.number(),
  largo: z.coerce.number().positive(),
  ancho: z.coerce.number().positive(),
  area_plana: z.coerce.number().optional(),
  area_proyectada: z.coerce.number().optional(),
  configuracion_calculo: z.any().optional(),
  datos_json: z.string().optional(),
  imagen_generada: z.string().optional(),
});

export type CrearDibujoDTO = z.infer<typeof dibujoCalaminaSchema>;
export type ActualizarDibujoDTO = Partial<CrearDibujoDTO>;
