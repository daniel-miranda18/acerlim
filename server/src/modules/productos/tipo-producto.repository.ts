import prisma from "../../shared/lib/prisma";

export class TipoProductoRepository {
  async findAllActives() {
    return prisma.tipoProducto.findMany({
      where: { estado: 1 },
      orderBy: { nombre: 'asc' },
    });
  }

  async findById(id: number) {
    return prisma.tipoProducto.findUnique({
      where: { id_tipo_producto: id },
    });
  }
}
