import { pedidoRepository } from "./pedido.repository";
import { CrearPedidoDTO, ActualizarPedidoDTO } from "./pedido.schema";

export const pedidoService = {
  listar: () => pedidoRepository.findAll(),

  obtener: async (id: number) => {
    const pedido = await pedidoRepository.findById(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    return pedido;
  },

  crear: async (data: CrearPedidoDTO) => {
    return pedidoRepository.create(data, 1);
  },

  actualizar: async (id: number, data: ActualizarPedidoDTO) => {
    await pedidoService.obtener(id);
    return pedidoRepository.update(id, data, 1);
  },

  eliminar: async (id: number) => {
    await pedidoService.obtener(id);
    return pedidoRepository.delete(id);
  },

  cambiarEstado: async (id: number, estado_pedido: string) => {
    const estados_validos = ["pendiente", "produccion", "entregado"];
    if (!estados_validos.includes(estado_pedido)) {
      throw new Error(`Estado inválido. Debe ser: ${estados_validos.join(", ")}`);
    }
    await pedidoService.obtener(id);
    return pedidoRepository.updateEstado(id, estado_pedido);
  },
};
