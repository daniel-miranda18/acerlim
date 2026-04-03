import { Request, Response } from "express";
import { proveedorService } from "./proveedor.service";
import {
  ok,
  created,
  notFound,
  badRequest,
  serverError,
} from "../../shared/utils/response";

export const proveedorController = {
  listar: async (_req: Request, res: Response) => {
    try {
      const data = await proveedorService.getProveedores();
      ok(res, data);
    } catch (e) {
      serverError(res);
    }
  },

  obtener: async (req: Request, res: Response) => {
    try {
      const data = await proveedorService.getProveedorById(Number(req.params.id));
      if (!data) return notFound(res, "Proveedor no encontrado");
      ok(res, data);
    } catch (e: any) {
      serverError(res);
    }
  },

  crear: async (req: Request, res: Response) => {
    try {
      const usuarioId = (req as any).user?.id_usuario || 1;
      const data = await proveedorService.crearProveedor(req.body, usuarioId);
      created(res, data);
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  actualizar: async (req: Request, res: Response) => {
    try {
      const usuarioId = (req as any).user?.id_usuario || 1;
      const data = await proveedorService.actualizarProveedor(
        Number(req.params.id),
        req.body,
        usuarioId
      );
      ok(res, data, "Proveedor actualizado");
    } catch (e: any) {
      badRequest(res, e.message);
    }
  },

  eliminar: async (req: Request, res: Response) => {
    try {
      await proveedorService.eliminarProveedor(Number(req.params.id));
      ok(res, null, "Proveedor eliminado");
    } catch (e: any) {
      notFound(res, e.message);
    }
  },
};
