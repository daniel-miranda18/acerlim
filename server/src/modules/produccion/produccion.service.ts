import { produccionRepository } from "./produccion.repository";
import { CrearProduccionDTO } from "./produccion.schema";

export const produccionService = {
  obtenerPorPedido: (id_pedido: number) =>
    produccionRepository.findByPedido(id_pedido),

  crear: async (data: CrearProduccionDTO) => {
    return produccionRepository.create(data, 1);
  },
};
