import { precioRepository } from "./precio.repository";
import { CrearPrecioDTO, ActualizarPrecioDTO } from "./precio.schema";

export const precioService = {
  listar: () => precioRepository.findAll(),

  obtener: async (id: number) => {
    const precio = await precioRepository.findById(id);
    if (!precio) throw new Error("Precio no encontrado");
    return precio;
  },

  crear: async (data: CrearPrecioDTO) => {
    return precioRepository.create(data);
  },

  actualizar: async (id: number, data: ActualizarPrecioDTO) => {
    await precioService.obtener(id);
    return precioRepository.update(id, data);
  },

  eliminar: async (id: number) => {
    await precioService.obtener(id);
    return precioRepository.delete(id);
  },
};
