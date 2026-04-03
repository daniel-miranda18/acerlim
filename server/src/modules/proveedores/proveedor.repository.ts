import prisma from "../../shared/lib/prisma";
import { CrearProveedorDTO, ActualizarProveedorDTO } from "./proveedor.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatProveedor = (p: any) => ({
  ...p,
  fecha_creacion: formatDate(p.fecha_creacion),
  fecha_actualizacion: formatDate(p.fecha_actualizacion),
});

export const proveedorRepository = {
  findAll: async () => {
    const proveedores = await prisma.proveedor.findMany({
      where: { estado: 1 },
      orderBy: { id_proveedor: "desc" },
    });
    return proveedores.map(formatProveedor);
  },

  findById: async (id: number) => {
    const p = await prisma.proveedor.findUnique({
      where: { id_proveedor: id },
    });
    if (!p) return null;
    return formatProveedor(p);
  },

  create: async (data: CrearProveedorDTO, usuarioCreacion: number) => {
    const p = await prisma.proveedor.create({
      data: {
        ...data,
        usuario_creacion: usuarioCreacion,
      },
    });
    return formatProveedor(p);
  },

  update: async (id: number, data: ActualizarProveedorDTO, usuarioActualizacion: number) => {
    const p = await prisma.proveedor.update({
      where: { id_proveedor: id },
      data: {
        ...data,
        fecha_actualizacion: now(),
        usuario_actualizacion: usuarioActualizacion,
      },
    });
    return formatProveedor(p);
  },

  delete: async (id: number) => {
    const p = await prisma.proveedor.update({
      where: { id_proveedor: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatProveedor(p);
  },
};
