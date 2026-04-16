import prisma from "../../shared/lib/prisma";
import { CrearColorDTO, ActualizarColorDTO } from "./color.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatColor = (c: any) => ({
  ...c,
  fecha_creacion: formatDate(c.fecha_creacion),
  fecha_actualizacion: formatDate(c.fecha_actualizacion),
});

export const colorRepository = {
  findAll: async () => {
    const colores = await prisma.color.findMany({
      where: { estado: 1 },
      orderBy: { id_color: "desc" },
    });
    return colores.map(formatColor);
  },

  findById: async (id: number) => {
    const c = await prisma.color.findUnique({
      where: { id_color: id },
    });
    if (!c) return null;
    return formatColor(c);
  },

  create: async (data: CrearColorDTO) => {
    const c = await prisma.color.create({
      data: {
        nombre: data.nombre,
        codigo_hex: data.codigo_hex,
      },
    });
    return formatColor(c);
  },

  update: async (id: number, data: ActualizarColorDTO) => {
    const c = await prisma.color.update({
      where: { id_color: id },
      data: {
        ...data,
        fecha_actualizacion: now(),
      },
    });
    return formatColor(c);
  },

  delete: async (id: number) => {
    const c = await prisma.color.update({
      where: { id_color: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatColor(c);
  },
};
