import prisma from "../../shared/lib/prisma";
import { CrearBobinaDTO, ActualizarBobinaDTO } from "./bobina.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatBobina = (b: any) => ({
  ...b,
  fecha_creacion: formatDate(b.fecha_creacion),
  fecha_actualizacion: formatDate(b.fecha_actualizacion),
});

export const bobinaRepository = {
  findAll: async () => {
    const bobinas = await prisma.bobina.findMany({
      where: { estado: 1 },
      include: { 
        lote_rel: {
          include: { proveedor_rel: true }
        }
      },
      orderBy: { id_bobina: "desc" },
    });
    return bobinas.map(formatBobina);
  },

  findById: async (id: number) => {
    const b = await prisma.bobina.findUnique({
      where: { id_bobina: id },
      include: { 
        lote_rel: {
          include: { proveedor_rel: true }
        }
      },
    });
    if (!b) return null;
    return formatBobina(b);
  },


  getStockPorTipo: async () => {
    const grouped = await prisma.bobina.groupBy({
      by: ['ancho', 'espesor', 'color'],
      where: { estado: 1 },
      _sum: {
        peso_actual: true,
      },
      _count: {
        id_bobina: true,
      }
    });
    return grouped.map((g: any) => ({
      ancho: g.ancho,
      espesor: g.espesor,
      color: g.color,
      total_peso_actual: g._sum.peso_actual,
      cantidad_bobinas: g._count.id_bobina
    }));
  },

  create: async (data: CrearBobinaDTO, usuarioCreacion: number) => {
    const b = await prisma.bobina.create({
      data: { 
        ...data, 
        peso_actual: data.peso_actual ?? data.peso_inicial,
        metros_lineales_actual: data.metros_lineales_actual ?? data.metros_lineales_inicial,
        usuario_creacion: usuarioCreacion 
      },
    });
    return formatBobina(b);
  },

  update: async (id: number, data: ActualizarBobinaDTO, usuarioActualizacion: number) => {
    const b = await prisma.bobina.update({
      where: { id_bobina: id },
      data: {
        ...data,
        fecha_actualizacion: now(),
        usuario_actualizacion: usuarioActualizacion,
      },
    });
    return formatBobina(b);
  },

  delete: async (id: number) => {
    const b = await prisma.bobina.update({
      where: { id_bobina: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatBobina(b);
  },
};
