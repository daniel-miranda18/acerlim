import { Request, Response, NextFunction } from "express";
import { pedidoService } from "./pedido.service";

export const pedidoController = {
  listar: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const pedidos = await pedidoService.listar();
      res.json({ success: true, data: pedidos });
    } catch (e) {
      next(e);
    }
  },

  obtener: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const pedido = await pedidoService.obtener(id);
      res.json({ success: true, data: pedido });
    } catch (e) {
      next(e);
    }
  },

  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pedido = await pedidoService.crear(req.body);
      res.status(201).json({ success: true, data: pedido });
    } catch (e) {
      next(e);
    }
  },

  actualizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const pedido = await pedidoService.actualizar(id, req.body);
      res.json({ success: true, data: pedido });
    } catch (e) {
      next(e);
    }
  },

  eliminar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      await pedidoService.eliminar(id);
      res.json({ success: true, message: "Pedido eliminado correctamente" });
    } catch (e) {
      next(e);
    }
  },

  cambiarEstado: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const { estado_pedido } = req.body;
      const pedido = await pedidoService.cambiarEstado(id, estado_pedido);
      res.json({ success: true, data: pedido });
    } catch (e) {
      next(e);
    }
  },
};
