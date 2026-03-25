import { productoRepository } from "./producto.repository";
import { CrearProductoDTO, ActualizarProductoDTO } from "./producto.schema";

export const productoService = {
  listar: () => productoRepository.findAll(),

  obtener: async (id: number) => {
    const producto = await productoRepository.findById(id);
    if (!producto) throw new Error("Producto no encontrado");
    return producto;
  },

  crear: async (data: CrearProductoDTO) => {
    return productoRepository.create(data, 1);
  },

  actualizar: async (id: number, data: ActualizarProductoDTO) => {
    await productoService.obtener(id);
    return productoRepository.update(id, data, 1);
  },

  eliminar: async (id: number) => {
    await productoService.obtener(id);
    return productoRepository.delete(id);
  },
};
