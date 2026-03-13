import prisma from "../../shared/lib/prisma";
import { CrearUsuarioDTO, ActualizarUsuarioDTO } from "./usuario.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatUsuario = (u: any) => ({
  ...u,
  fecha_creacion: formatDate(u.fecha_creacion),
  fecha_actualizacion: formatDate(u.fecha_actualizacion),
});

export const usuarioRepository = {
  findAll: async () => {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        telefono: true,
        estado: true,
        fecha_creacion: true,
        fecha_actualizacion: true,
        rol: { select: { id_rol: true, nombre: true } },
      },
      orderBy: { id_usuario: "asc" },
    });
    return usuarios.map(formatUsuario);
  },

  findById: async (id: number) => {
    const u = await prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        telefono: true,
        estado: true,
        fecha_creacion: true,
        fecha_actualizacion: true,
        rol: { select: { id_rol: true, nombre: true } },
      },
    });
    if (!u) return null;
    return formatUsuario(u);
  },

  findByCorreo: (correo: string) =>
    prisma.usuario.findUnique({ where: { correo } }),

  create: async (
    data: CrearUsuarioDTO & { clave: string },
    usuarioCreacion: number,
  ) => {
    const u = await prisma.usuario.create({
      data: { ...data, usuario_creacion: usuarioCreacion },
    });
    return formatUsuario(u);
  },

  update: async (
    id: number,
    data: ActualizarUsuarioDTO,
    usuarioActualizacion: number,
  ) => {
    const u = await prisma.usuario.update({
      where: { id_usuario: id },
      data: {
        ...data,
        fecha_actualizacion: now(),
        usuario_actualizacion: usuarioActualizacion,
      },
    });
    return formatUsuario(u);
  },

  delete: async (id: number) => {
    const u = await prisma.usuario.update({
      where: { id_usuario: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatUsuario(u);
  },
};
