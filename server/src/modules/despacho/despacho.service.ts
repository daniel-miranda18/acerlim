import { despachoRepository } from "./despacho.repository";
import { CrearDespachoDTO } from "./despacho.schema";

export const despachoService = {
  listar: () => despachoRepository.findAll(),

  crear: async (data: CrearDespachoDTO, usuarioCreacion: number) => {
    // Basic validation could be added here if needed
    return despachoRepository.create(data, usuarioCreacion);
  },
};
