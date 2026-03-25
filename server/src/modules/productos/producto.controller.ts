import { Request, Response } from "express";
import { productoService } from "./producto.service";
import {
  ok,
  created,
  notFound,
  badRequest,
  serverError,
} from "../../shared/utils/response";

export const productoController = {
  listar: async (_req: Request, res: Response) => {
    try {
      const data = await productoService.listar();
      ok(res, data);
    } catch (e) {
      serverError(res);
    }
  },

  obtener: async (req: Request, res: Response) => {
    try {
      const data = await productoService.obtener(Number(req.params.id));
      ok(res, data);
    } catch (e: any) {
      notFound(res, e.message);
    }
  },

  crear: async (req: Request, res: Response) => {
    try {
      const data = await productoService.crear(req.body);
      created(res, data);
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  actualizar: async (req: Request, res: Response) => {
    try {
      const data = await productoService.actualizar(
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
      await productoService.eliminar(Number(req.params.id));
      ok(res, null, "Eliminado correctamente");
    } catch (e: any) {
      notFound(res, e.message);
    }
  },
};
