import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type { Producto, CrearProductoDTO, ActualizarProductoDTO } from "../types/producto.types";

export const productoService = {
  listar: () => api.get<ApiResponse<Producto[]>>("/productos"),
  obtener: (id: number) => api.get<ApiResponse<Producto>>(`/productos/${id}`),
  crear: (data: CrearProductoDTO) => api.post<ApiResponse<Producto>>("/productos", data),
  actualizar: (id: number, data: ActualizarProductoDTO) =>
    api.put<ApiResponse<Producto>>(`/productos/${id}`, data),
  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/productos/${id}`),
};

