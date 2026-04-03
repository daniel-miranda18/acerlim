import api from "./api";
import type { Proveedor } from "../types/proveedor.types";

export const proveedorService = {
  listar: () => api.get("/proveedores"),
  obtener: (id: number) => api.get(`/proveedores/${id}`),
  crear: (data: Partial<Proveedor>) => api.post("/proveedores", data),
  actualizar: (id: number, data: Partial<Proveedor>) => api.put(`/proveedores/${id}`, data),
  eliminar: (id: number) => api.delete(`/proveedores/${id}`),
};
