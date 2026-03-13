import { Request, Response } from "express";
import { rolPermisoService } from "./rol_permiso.service";
import {
  ok,
  notFound,
  badRequest,
  serverError,
} from "../../shared/utils/response";

export const rolPermisoController = {
  listarPermisos: async (req: Request, res: Response) => {
    try {
      const data = await rolPermisoService.listarPermisos(
        Number(req.params.id),
      );
      ok(res, data);
    } catch (e: any) {
      notFound(res, e.message);
    }
  },

  asignarPermisos: async (req: Request, res: Response) => {
    try {
      const data = await rolPermisoService.asignarPermisos(
        Number(req.params.id),
        req.body.permisos,
      );
      ok(res, data, "Permisos asignados correctamente");
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  sincronizar: async (req: Request, res: Response) => {
    try {
      const data = await rolPermisoService.sincronizar(
        Number(req.params.id),
        req.body.permisos,
      );
      ok(res, data, "Permisos sincronizados correctamente");
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  quitarPermiso: async (req: Request, res: Response) => {
    try {
      const data = await rolPermisoService.quitarPermiso(
        Number(req.params.id),
        Number(req.params.id_permiso),
      );
      ok(res, data, "Permiso removido correctamente");
    } catch (e: any) {
      notFound(res, e.message);
    }
  },
};
