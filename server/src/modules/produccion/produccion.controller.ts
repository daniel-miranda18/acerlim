import { Request, Response, NextFunction } from "express";
import { produccionService } from "./produccion.service";

export const produccionController = {
  obtenerPorPedido: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id_pedido = parseInt(req.params.id_pedido as string);
      const producciones = await produccionService.obtenerPorPedido(id_pedido);
      res.json({ success: true, data: producciones });
    } catch (e) {
      next(e);
    }
  },

  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const produccion = await produccionService.crear(req.body);
      res.status(201).json({ success: true, data: produccion });
    } catch (e) {
      next(e);
    }
  },
};
