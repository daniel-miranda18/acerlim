import { bobinaRepository } from "./bobina.repository";
import { CrearBobinaDTO, ActualizarBobinaDTO } from "./bobina.schema";

export const bobinaService = {
  listar: () => bobinaRepository.findAll(),

  obtener: async (id: number) => {
    const bobina = await bobinaRepository.findById(id);
    if (!bobina) throw new Error("Bobina no encontrada");
    return bobina;
  },

  getStockPorTipo: () => bobinaRepository.getStockPorTipo(),

  crear: async (data: CrearBobinaDTO, usuarioId: number) => {
    return bobinaRepository.create(data, usuarioId);
  },

  actualizar: async (id: number, data: ActualizarBobinaDTO, usuarioId: number) => {
    await bobinaService.obtener(id);
    return bobinaRepository.update(id, data, usuarioId);
  },

  eliminar: async (id: number) => {
    await bobinaService.obtener(id);
    return bobinaRepository.delete(id);
  },
};
