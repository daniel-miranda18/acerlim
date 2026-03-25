import { dibujoRepository } from "./dibujo.repository";
import { CrearDibujoDTO, ActualizarDibujoDTO } from "./dibujo.schema";

export const dibujoService = {
  listarPorProducto: (idProducto: number) => dibujoRepository.findAllByProducto(idProducto),

  obtener: async (id: number) => {
    const dibujo = await dibujoRepository.findById(id);
    if (!dibujo) throw new Error("Dibujo no encontrado");
    return dibujo;
  },

  crear: async (data: CrearDibujoDTO) => {
    return dibujoRepository.create(data, 1); // Usuario 1 por defecto
  },

  actualizar: async (id: number, data: ActualizarDibujoDTO) => {
    await dibujoService.obtener(id);
    return dibujoRepository.update(id, data, 1);
  },

  eliminar: async (id: number) => {
    await dibujoService.obtener(id);
    return dibujoRepository.delete(id);
  },
};
