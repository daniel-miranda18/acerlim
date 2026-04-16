import { colorRepository } from "./color.repository";
import { CrearColorDTO, ActualizarColorDTO } from "./color.schema";

export const colorService = {
  listar: () => colorRepository.findAll(),

  obtener: async (id: number) => {
    const color = await colorRepository.findById(id);
    if (!color) throw new Error("Color no encontrado");
    return color;
  },

  crear: async (data: CrearColorDTO) => {
    return colorRepository.create(data);
  },

  actualizar: async (id: number, data: ActualizarColorDTO) => {
    await colorService.obtener(id);
    return colorRepository.update(id, data);
  },

  eliminar: async (id: number) => {
    await colorService.obtener(id);
    return colorRepository.delete(id);
  },
};
