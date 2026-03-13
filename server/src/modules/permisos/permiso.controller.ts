import { Request, Response } from "express";
import { permisoService } from "./permiso.service";
import {
  ok,
  created,
  notFound,
  serverError,
} from "../../shared/utils/response";

export const permisoController = {
  listar: async (_req: Request, res: Response) => {
    try {
      const data = await permisoService.listar();
      ok(res, data);
    } catch (e) {
      serverError(res);
    }
  },

  obtener: async (req: Request, res: Response) => {
    try {
      const data = await permisoService.obtener(Number(req.params.id));
      ok(res, data);
    } catch (e: any) {
      notFound(res, e.message);
    }
  },

  crear: async (req: Request, res: Response) => {
    try {
      const data = await permisoService.crear(req.body);
      created(res, data);
    } catch (e) {
      serverError(res);
    }
  },

  actualizar: async (req: Request, res: Response) => {
    try {
      const data = await permisoService.actualizar(
        Number(req.params.id),
        req.body,
      );
      ok(res, data, "Actualizado correctamente");
    } catch (e: any) {
      notFound(res, e.message);
    }
  },

  eliminar: async (req: Request, res: Response) => {
    try {
      await permisoService.eliminar(Number(req.params.id));
      ok(res, null, "Eliminado correctamente");
    } catch (e: any) {
      notFound(res, e.message);
    }
  },
};
