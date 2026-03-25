import { Request, Response } from "express";
import { bobinaService } from "./bobina.service";
import {
  ok,
  created,
  notFound,
  badRequest,
  serverError,
} from "../../shared/utils/response";

export const bobinaController = {
  listar: async (_req: Request, res: Response) => {
    try {
      const data = await bobinaService.listar();
      ok(res, data);
    } catch (e) {
      serverError(res);
    }
  },

  obtener: async (req: Request, res: Response) => {
    try {
      const data = await bobinaService.obtener(Number(req.params.id));
      ok(res, data);
    } catch (e: any) {
      notFound(res, e.message);
    }
  },

  getStockPorTipo: async (_req: Request, res: Response) => {
    try {
      const data = await bobinaService.getStockPorTipo();
      ok(res, data);
    } catch (e) {
      serverError(res);
    }
  },

  crear: async (req: Request, res: Response) => {
    try {
      const usuarioId = (req as any).user?.id_usuario || 1;
      const data = await bobinaService.crear(req.body, usuarioId);
      created(res, data);
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  actualizar: async (req: Request, res: Response) => {
    try {
      const usuarioId = (req as any).user?.id_usuario || 1;
      const data = await bobinaService.actualizar(
        Number(req.params.id),
        req.body,
        usuarioId
      );
      ok(res, data, "Actualizado correctamente");
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  eliminar: async (req: Request, res: Response) => {
    try {
      await bobinaService.eliminar(Number(req.params.id));
      ok(res, null, "Eliminado correctamente");
    } catch (e: any) {
      notFound(res, e.message);
    }
  },
};
