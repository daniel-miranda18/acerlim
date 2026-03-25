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
    if (data.codigo_lote) {
      const existe = await bobinaRepository.findByCodigoLote(data.codigo_lote);
      if (existe) throw new Error("El código de lote ya existe en el inventario");
    }
    return bobinaRepository.create(data, usuarioId);
  },

  actualizar: async (id: number, data: ActualizarBobinaDTO, usuarioId: number) => {
    await bobinaService.obtener(id);
    if (data.codigo_lote) {
      const existe = await bobinaRepository.findByCodigoLote(data.codigo_lote, id);
      if (existe) throw new Error("El código de lote ya existe en otro registro");
    }
    return bobinaRepository.update(id, data, usuarioId);
  },

  eliminar: async (id: number) => {
    await bobinaService.obtener(id);
    return bobinaRepository.delete(id);
  },
};
