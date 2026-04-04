import { Request, Response } from "express";
import { TipoProductoService } from "./tipo-producto.service";

export class TipoProductoController {
  private service: TipoProductoService;

  constructor() {
    this.service = new TipoProductoService();
  }

  obtenerTodos = async (req: Request, res: Response) => {
    try {
      const tipos = await this.service.obtenerTiposActivos();
      res.json(tipos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener tipos de productos" });
    }
  };
}
