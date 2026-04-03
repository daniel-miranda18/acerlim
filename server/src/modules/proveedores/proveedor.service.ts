import { proveedorRepository } from "./proveedor.repository";
import { CrearProveedorDTO, ActualizarProveedorDTO } from "./proveedor.schema";

export const proveedorService = {
  getProveedores: async () => {
    return await proveedorRepository.findAll();
  },

  getProveedorById: async (id: number) => {
    return await proveedorRepository.findById(id);
  },

  crearProveedor: async (data: CrearProveedorDTO, usuarioCreacion: number) => {
    return await proveedorRepository.create(data, usuarioCreacion);
  },

  actualizarProveedor: async (id: number, data: ActualizarProveedorDTO, usuarioActualizacion: number) => {
    return await proveedorRepository.update(id, data, usuarioActualizacion);
  },

  eliminarProveedor: async (id: number) => {
    return await proveedorRepository.delete(id);
  },
};
