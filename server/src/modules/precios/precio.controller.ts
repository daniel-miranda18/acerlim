import { Request, Response, NextFunction } from "express";
import { precioService } from "./precio.service";

export const precioController = {
  listar: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const precios = await precioService.listar();
      res.json({ success: true, data: precios });
    } catch (e) {
      next(e);
    }
  },

  obtener: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const precio = await precioService.obtener(id);
      res.json({ success: true, data: precio });
    } catch (e) {
      next(e);
    }
  },

  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const precio = await precioService.crear(req.body);
      res.status(201).json({ success: true, data: precio });
    } catch (e) {
      next(e);
    }
  },

  actualizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const precio = await precioService.actualizar(id, req.body);
      res.json({ success: true, data: precio });
    } catch (e) {
      next(e);
    }
  },

  eliminar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      await precioService.eliminar(id);
      res.json({ success: true, message: "Precio eliminado correctamente" });
    } catch (e) {
      next(e);
    }
  },
};
