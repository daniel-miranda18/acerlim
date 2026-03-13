import prisma from "../../shared/lib/prisma";
import { CrearRolDTO, ActualizarRolDTO } from "./rol.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatRol = (r: any) => ({
  ...r,
  fecha_creacion: formatDate(r.fecha_creacion),
  fecha_actualizacion: formatDate(r.fecha_actualizacion),
});

export const rolRepository = {
  findAll: async () => {
    const roles = await prisma.rol.findMany({ orderBy: { id_rol: "asc" } });
    return roles.map(formatRol);
  },

  findById: async (id: number) => {
    const r = await prisma.rol.findUnique({ where: { id_rol: id } });
    if (!r) return null;
    return formatRol(r);
  },

  create: async (data: CrearRolDTO, usuarioCreacion: number) => {
    const r = await prisma.rol.create({
      data: { ...data, usuario_creacion: usuarioCreacion },
    });
    return formatRol(r);
  },

  update: async (
    id: number,
    data: ActualizarRolDTO,
    usuarioActualizacion: number,
  ) => {
    const r = await prisma.rol.update({
      where: { id_rol: id },
      data: {
        ...data,
        fecha_actualizacion: now(),
        usuario_actualizacion: usuarioActualizacion,
      },
    });
    return formatRol(r);
  },

  delete: async (id: number) => {
    const r = await prisma.rol.update({
      where: { id_rol: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatRol(r);
  },
};
