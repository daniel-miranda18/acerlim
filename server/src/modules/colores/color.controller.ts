import { Request, Response, NextFunction } from "express";
import { colorService } from "./color.service";

export const colorController = {
  listar: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const colores = await colorService.listar();
      res.json({ success: true, data: colores });
    } catch (e) {
      next(e);
    }
  },

  obtener: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const color = await colorService.obtener(id);
      res.json({ success: true, data: color });
    } catch (e) {
      next(e);
    }
  },

  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const color = await colorService.crear(req.body);
      res.status(201).json({ success: true, data: color });
    } catch (e) {
      next(e);
    }
  },

  actualizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const color = await colorService.actualizar(id, req.body);
      res.json({ success: true, data: color });
    } catch (e) {
      next(e);
    }
  },

  eliminar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      await colorService.eliminar(id);
      res.json({ success: true, message: "Color eliminado correctamente" });
    } catch (e) {
      next(e);
    }
  },
};
