import { loteRepository } from "./lote.repository";
import { CrearLoteDTO, ActualizarLoteDTO } from "./lote.schema";

export const loteService = {
  getLotes: async () => {
    return await loteRepository.findAll();
  },

  getLoteById: async (id: number) => {
    return await loteRepository.findById(id);
  },

  crearLote: async (data: CrearLoteDTO, usuarioCreacion: number) => {
    return await loteRepository.create(data, usuarioCreacion);
  },

  actualizarLote: async (id: number, data: ActualizarLoteDTO, usuarioActualizacion: number) => {
    return await loteRepository.update(id, data, usuarioActualizacion);
  },

  eliminarLote: async (id: number) => {
    return await loteRepository.delete(id);
  },
};
