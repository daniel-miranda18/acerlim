import { rolPermisoRepository } from "./rol_permiso.repository";
import { rolRepository } from "../roles/rol.repository";
import { permisoRepository } from "../permisos/permiso.repository";

export const rolPermisoService = {
  listarPermisos: async (id_rol: number) => {
    const rol = await rolRepository.findById(id_rol);
    if (!rol) throw new Error("Rol no encontrado");

    const items = await rolPermisoRepository.findByRol(id_rol);
    return {
      rol: { id_rol: rol.id_rol, nombre: rol.nombre },
      permisos: items.map((i) => i.permiso),
    };
  },

  asignarPermisos: async (id_rol: number, permisos: number[]) => {
    const rol = await rolRepository.findById(id_rol);
    if (!rol) throw new Error("Rol no encontrado");

    for (const id_permiso of permisos) {
      const permiso = await permisoRepository.findById(id_permiso);
      if (!permiso) throw new Error(`Permiso ${id_permiso} no encontrado`);

      const existente = await rolPermisoRepository.findExistente(
        id_rol,
        id_permiso,
      );
      if (existente) {
        if (existente.estado === 0) {
          await rolPermisoRepository.reactivar(existente.id);
        }
      } else {
        await rolPermisoRepository.asignar(id_rol, id_permiso);
      }
    }

    return rolPermisoService.listarPermisos(id_rol);
  },

  quitarPermiso: async (id_rol: number, id_permiso: number) => {
    const rol = await rolRepository.findById(id_rol);
    if (!rol) throw new Error("Rol no encontrado");

    await rolPermisoRepository.quitar(id_rol, id_permiso);
    return rolPermisoService.listarPermisos(id_rol);
  },

  sincronizar: async (id_rol: number, permisos: number[]) => {
    const rol = await rolRepository.findById(id_rol);
    if (!rol) throw new Error("Rol no encontrado");

    await rolPermisoRepository.quitarTodos(id_rol);

    for (const id_permiso of permisos) {
      const existente = await rolPermisoRepository.findExistente(
        id_rol,
        id_permiso,
      );
      if (existente) {
        await rolPermisoRepository.reactivar(existente.id);
      } else {
        await rolPermisoRepository.asignar(id_rol, id_permiso);
      }
    }

    return rolPermisoService.listarPermisos(id_rol);
  },
};
