import prisma from "../../shared/lib/prisma";
import { CrearPermisoDTO, ActualizarPermisoDTO } from "./permiso.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatPermiso = (p: any) => ({
  ...p,
  fecha_creacion: formatDate(p.fecha_creacion),
  fecha_actualizacion: formatDate(p.fecha_actualizacion),
});

export const permisoRepository = {
  findAll: async () => {
    const permisos = await prisma.permiso.findMany({
      orderBy: { id_permiso: "asc" },
    });
    return permisos.map(formatPermiso);
  },

  findById: async (id: number) => {
    const p = await prisma.permiso.findUnique({ where: { id_permiso: id } });
    if (!p) return null;
    return formatPermiso(p);
  },

  create: async (data: CrearPermisoDTO, usuarioCreacion: number) => {
    const p = await prisma.permiso.create({
      data: { ...data, usuario_creacion: usuarioCreacion },
    });
    return formatPermiso(p);
  },

  update: async (
    id: number,
    data: ActualizarPermisoDTO,
    usuarioActualizacion: number,
  ) => {
    const p = await prisma.permiso.update({
      where: { id_permiso: id },
      data: {
        ...data,
        fecha_actualizacion: now(),
        usuario_actualizacion: usuarioActualizacion,
      },
    });
    return formatPermiso(p);
  },

  delete: async (id: number) => {
    const p = await prisma.permiso.update({
      where: { id_permiso: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatPermiso(p);
  },
};
