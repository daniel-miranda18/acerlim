import { Request, Response } from "express";
import { loteService } from "./lote.service";
import {
  ok,
  created,
  notFound,
  badRequest,
  serverError,
} from "../../shared/utils/response";

export const loteController = {
  listar: async (_req: Request, res: Response) => {
    try {
      const data = await loteService.getLotes();
      ok(res, data);
    } catch (e) {
      serverError(res);
    }
  },

  obtener: async (req: Request, res: Response) => {
    try {
      const data = await loteService.getLoteById(Number(req.params.id));
      if (!data) return notFound(res, "Lote no encontrado");
      ok(res, data);
    } catch (e: any) {
      serverError(res);
    }
  },

  crear: async (req: Request, res: Response) => {
    try {
      const usuarioId = (req as any).user?.id_usuario || 1;
      const data = await loteService.crearLote(req.body, usuarioId);
      created(res, data);
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  actualizar: async (req: Request, res: Response) => {
    try {
      const usuarioId = (req as any).user?.id_usuario || 1;
      const data = await loteService.actualizarLote(
        Number(req.params.id),
        req.body,
        usuarioId
      );
      ok(res, data, "Lote actualizado");
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  eliminar: async (req: Request, res: Response) => {
    try {
      await loteService.eliminarLote(Number(req.params.id));
      ok(res, null, "Lote eliminado");
    } catch (e: any) {
      notFound(res, e.message);
    }
  },
};
