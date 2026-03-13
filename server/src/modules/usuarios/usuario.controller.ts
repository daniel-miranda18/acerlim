import { Request, Response } from "express";
import { usuarioService } from "./usuario.service";
import {
  ok,
  created,
  notFound,
  badRequest,
  serverError,
} from "../../shared/utils/response";

export const usuarioController = {
  listar: async (_req: Request, res: Response) => {
    try {
      const data = await usuarioService.listar();
      ok(res, data);
    } catch (e) {
      serverError(res);
    }
  },

  obtener: async (req: Request, res: Response) => {
    try {
      const data = await usuarioService.obtener(Number(req.params.id));
      ok(res, data);
    } catch (e: any) {
      notFound(res, e.message);
    }
  },

  crear: async (req: Request, res: Response) => {
    try {
      const data = await usuarioService.crear(req.body);
      created(res, data);
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  actualizar: async (req: Request, res: Response) => {
    try {
      const data = await usuarioService.actualizar(
        Number(req.params.id),
        req.body,
      );
      ok(res, data, "Actualizado correctamente");
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  eliminar: async (req: Request, res: Response) => {
    try {
      await usuarioService.eliminar(Number(req.params.id));
      ok(res, null, "Eliminado correctamente");
    } catch (e: any) {
      notFound(res, e.message);
    }
  },
};
