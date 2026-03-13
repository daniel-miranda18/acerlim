import prisma from "../../shared/lib/prisma";

export const rolPermisoRepository = {
  findByRol: (id_rol: number) =>
    prisma.rolPermiso.findMany({
      where: { id_rol, estado: 1 },
      include: {
        permiso: {
          select: { id_permiso: true, nombre: true, descripcion: true },
        },
      },
    }),

  findExistente: (id_rol: number, id_permiso: number) =>
    prisma.rolPermiso.findFirst({
      where: { id_rol, id_permiso },
    }),

  asignar: (id_rol: number, id_permiso: number) =>
    prisma.rolPermiso.create({
      data: { id_rol, id_permiso, estado: 1 },
    }),

  reactivar: (id: number) =>
    prisma.rolPermiso.update({
      where: { id },
      data: { estado: 1 },
    }),

  quitar: (id_rol: number, id_permiso: number) =>
    prisma.rolPermiso.updateMany({
      where: { id_rol, id_permiso },
      data: { estado: 0 },
    }),

  quitarTodos: (id_rol: number) =>
    prisma.rolPermiso.updateMany({
      where: { id_rol },
      data: { estado: 0 },
    }),
};
