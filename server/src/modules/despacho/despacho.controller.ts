import { Request, Response } from "express";
import { despachoService } from "./despacho.service";
import { crearDespachoSchema } from "./despacho.schema";
import { ok, created, badRequest, serverError } from "../../shared/utils/response";

export const despachoController = {
  listar: async (req: Request, res: Response) => {
    try {
      const despachos = await despachoService.listar();
      return ok(res, despachos);
    } catch (error: any) {
      return serverError(res, error);
    }
  },

  crear: async (req: Request, res: Response) => {
    try {
      const body = crearDespachoSchema.parse(req.body);
      const despacho = await despachoService.crear(body, 1);
      return created(res, despacho, "Despacho creado correctamente");
    } catch (error: any) {
      if (error.name === "ZodError") {
        return badRequest(res, "Datos de entrada inválidos");
      }
      return badRequest(res, error.message);
    }
  },
};
