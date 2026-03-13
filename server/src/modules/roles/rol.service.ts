import { rolRepository } from "./rol.repository";
import { CrearRolDTO, ActualizarRolDTO } from "./rol.schema";

export const rolService = {
  listar: async () => {
    const result = await rolRepository.findAll();
    return result;
  },

  obtener: async (id: number) => {
    const rol = await rolRepository.findById(id);
    if (!rol) throw new Error("Rol no encontrado");
    return rol;
  },

  crear: (data: CrearRolDTO) => rolRepository.create(data, 1),

  actualizar: async (id: number, data: ActualizarRolDTO) => {
    await rolService.obtener(id);
    return rolRepository.update(id, data, 1);
  },

  eliminar: async (id: number) => {
    await rolService.obtener(id);
    return rolRepository.delete(id);
  },
};
