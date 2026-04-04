import prisma from "../../shared/lib/prisma";
import { CrearProductoDTO, ActualizarProductoDTO } from "./producto.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatProducto = (p: any) => ({
  ...p,
  fecha_creacion: formatDate(p.fecha_creacion),
  fecha_actualizacion: formatDate(p.fecha_actualizacion),
});

export const productoRepository = {
  findAll: async () => {
    const productos = await prisma.producto.findMany({
      where: { estado: 1 },
      include: { tipo_producto: true },
      orderBy: { id_producto: "desc" },
    });
    return productos.map(formatProducto);
  },

  findById: async (id: number) => {
    const p = await prisma.producto.findUnique({
      where: { id_producto: id },
      include: { tipo_producto: true },
    });
    if (!p) return null;
    return formatProducto(p);
  },

  create: async (data: CrearProductoDTO, usuarioCreacion: number) => {
    const p = await prisma.producto.create({
      data: { ...data, usuario_creacion: usuarioCreacion },
    });
    return formatProducto(p);
  },

  update: async (id: number, data: ActualizarProductoDTO, usuarioActualizacion: number) => {
    const p = await prisma.producto.update({
      where: { id_producto: id },
      data: {
        ...data,
        fecha_actualizacion: now(),
        usuario_actualizacion: usuarioActualizacion,
      },
    });
    return formatProducto(p);
  },

  delete: async (id: number) => {
    const p = await prisma.producto.update({
      where: { id_producto: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatProducto(p);
  },
};
