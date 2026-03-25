import prisma from "../../shared/lib/prisma";
import { CrearDibujoDTO, ActualizarDibujoDTO } from "./dibujo.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatDibujo = (d: any) => ({
  ...d,
  largo: Number(d.largo),
  ancho: Number(d.ancho),
  area_plana: d.area_plana ? Number(d.area_plana) : null,
  area_proyectada: d.area_proyectada ? Number(d.area_proyectada) : null,
  fecha_creacion: formatDate(d.fecha_creacion),
  fecha_actualizacion: formatDate(d.fecha_actualizacion),
});

export const dibujoRepository = {
  findAllByProducto: async (idProducto: number) => {
    const dibujos = await prisma.dibujoCalamina.findMany({
      where: { id_producto: idProducto, estado: 1 },
      orderBy: { id_dibujo: "desc" },
    });
    return dibujos.map(formatDibujo);
  },

  findById: async (id: number) => {
    const d = await prisma.dibujoCalamina.findUnique({
      where: { id_dibujo: id },
    });
    if (!d) return null;
    return formatDibujo(d);
  },

  create: async (data: CrearDibujoDTO, usuarioCreacion: number) => {
    const d = await prisma.dibujoCalamina.create({
      data: { 
        ...data, 
        usuario_creacion: usuarioCreacion 
      },
    });
    return formatDibujo(d);
  },

  update: async (id: number, data: ActualizarDibujoDTO, usuarioActualizacion: number) => {
    const d = await prisma.dibujoCalamina.update({
      where: { id_dibujo: id },
      data: {
        ...data,
        fecha_actualizacion: now(),
        usuario_actualizacion: usuarioActualizacion,
      },
    });
    return formatDibujo(d);
  },

  delete: async (id: number) => {
    const d = await prisma.dibujoCalamina.update({
      where: { id_dibujo: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatDibujo(d);
  },
};
