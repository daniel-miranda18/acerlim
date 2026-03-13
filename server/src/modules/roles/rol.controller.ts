import { Request, Response } from "express";
import { rolService } from "./rol.service";
import {
  ok,
  created,
  notFound,
  serverError,
} from "../../shared/utils/response";

export const rolController = {
  listar: async (_req: Request, res: Response) => {
    try {
      const data = await rolService.listar();
      ok(res, data);
    } catch (e) {
      serverError(res);
    }
  },

  obtener: async (req: Request, res: Response) => {
    try {
      const data = await rolService.obtener(Number(req.params.id));
      ok(res, data);
    } catch (e: any) {
      notFound(res, e.message);
    }
  },

  crear: async (req: Request, res: Response) => {
    try {
      const data = await rolService.crear(req.body);
      created(res, data);
    } catch (e) {
      serverError(res);
    }
  },

  actualizar: async (req: Request, res: Response) => {
    try {
      const data = await rolService.actualizar(Number(req.params.id), req.body);
      ok(res, data, "Actualizado correctamente");
    } catch (e: any) {
      notFound(res, e.message);
    }
  },

  eliminar: async (req: Request, res: Response) => {
    try {
      await rolService.eliminar(Number(req.params.id));
      ok(res, null, "Eliminado correctamente");
    } catch (e: any) {
      notFound(res, e.message);
    }
  },
};
