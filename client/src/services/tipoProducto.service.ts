import api from "./api";
import type { TipoProducto } from "../types/producto.types";

export const tipoProductoService = {
  obtenerTodos: async (): Promise<TipoProducto[]> => {
    const response = await api.get("/tipos-productos");
    return response.data;
  },
};
