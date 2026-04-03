import prisma from "../../shared/lib/prisma";
import { CrearLoteDTO, ActualizarLoteDTO } from "./lote.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatLote = (l: any) => ({
  ...l,
  fecha_ingreso: formatDate(l.fecha_ingreso),
  fecha_creacion: formatDate(l.fecha_creacion),
  fecha_actualizacion: formatDate(l.fecha_actualizacion),
});

export const loteRepository = {
  findAll: async () => {
    const lotes = await prisma.lote.findMany({
      where: { estado: 1 },
      include: { 
        proveedor_rel: true,
        _count: {
          select: { bobinas: true }
        }
      },
      orderBy: { id_lote: "desc" },
    });
    return lotes.map(formatLote);
  },

  findById: async (id: number) => {
    const l = await prisma.lote.findUnique({
      where: { id_lote: id },
      include: { 
        proveedor_rel: true,
        bobinas: {
          where: { estado: 1 }
        }
      },
    });
    if (!l) return null;
    return formatLote(l);
  },

  create: async (data: CrearLoteDTO, usuarioCreacion: number) => {
    const fecha_ingreso = data.fecha_ingreso ? new Date(data.fecha_ingreso + "T12:00:00") : null;
    const l = await prisma.lote.create({
      data: {
        ...data,
        fecha_ingreso,
        usuario_creacion: usuarioCreacion,
      },
    });
    return formatLote(l);
  },

  update: async (id: number, data: ActualizarLoteDTO, usuarioActualizacion: number) => {
    const fecha_ingreso = data.fecha_ingreso ? new Date(data.fecha_ingreso + "T12:00:00") : undefined;
    const l = await prisma.lote.update({
      where: { id_lote: id },
      data: {
        ...data,
        fecha_ingreso,
        fecha_actualizacion: now(),
        usuario_actualizacion: usuarioActualizacion,
      },
    });
    return formatLote(l);
  },

  delete: async (id: number) => {
    const l = await prisma.lote.update({
      where: { id_lote: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatLote(l);
  },
};
