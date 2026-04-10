import { Request, Response, NextFunction } from "express";
import { dibujoService } from "./dibujo.service";

export const dibujoController = {
  listarPorProducto: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idProducto = parseInt(req.params.idProducto as string);
      const dibujos = await dibujoService.listarPorProducto(idProducto);
      res.json({ success: true, data: dibujos });
    } catch (e) {
      next(e);
    }
  },

  obtener: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const dibujo = await dibujoService.obtener(id);
      res.json({ success: true, data: dibujo });
    } catch (e) {
      next(e);
    }
  },

  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        req.body.imagen_generada = `/uploads/dibujos/${req.file.filename}`;
      }
      const dibujo = await dibujoService.crear(req.body);
      res.status(201).json({ success: true, data: dibujo });
    } catch (e) {
      next(e);
    }
  },

  actualizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        req.body.imagen_generada = `/uploads/dibujos/${req.file.filename}`;
      }
      const id = parseInt(req.params.id as string);
      const dibujo = await dibujoService.actualizar(id, req.body);
      res.json({ success: true, data: dibujo });
    } catch (e) {
      next(e);
    }
  },

  eliminar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      await dibujoService.eliminar(id);
      res.json({ success: true, message: "Dibujo eliminado correctamente" });
    } catch (e) {
      next(e);
    }
  },
};
