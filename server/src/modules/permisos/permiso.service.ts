import { permisoRepository } from "./permiso.repository";
import { CrearPermisoDTO, ActualizarPermisoDTO } from "./permiso.schema";

export const permisoService = {
  listar: () => permisoRepository.findAll(),

  obtener: async (id: number) => {
    const permiso = await permisoRepository.findById(id);
    if (!permiso) throw new Error("Permiso no encontrado");
    return permiso;
  },

  crear: (data: CrearPermisoDTO) => permisoRepository.create(data, 1),

  actualizar: async (id: number, data: ActualizarPermisoDTO) => {
    await permisoService.obtener(id);
    return permisoRepository.update(id, data, 1);
  },

  eliminar: async (id: number) => {
    await permisoService.obtener(id);
    return permisoRepository.delete(id);
  },
};
