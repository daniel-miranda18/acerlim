import { z } from "zod";

export const dibujoCalaminaSchema = z.object({
  id_producto: z.number(),
  largo: z.number().positive(),
  ancho: z.number().positive(),
  area_plana: z.number().optional(),
  area_proyectada: z.number().optional(),
  configuracion_calculo: z.any().optional(),
  datos_json: z.string().optional(),
  imagen_generada: z.string().optional(),
});

export type CrearDibujoDTO = z.infer<typeof dibujoCalaminaSchema>;
export type ActualizarDibujoDTO = Partial<CrearDibujoDTO>;
