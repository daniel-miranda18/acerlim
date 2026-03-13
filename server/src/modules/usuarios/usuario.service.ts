import bcrypt from "bcryptjs";
import { usuarioRepository } from "./usuario.repository";
import { CrearUsuarioDTO, ActualizarUsuarioDTO } from "./usuario.schema";

export const usuarioService = {
  listar: () => usuarioRepository.findAll(),

  obtener: async (id: number) => {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) throw new Error("Usuario no encontrado");
    return usuario;
  },

  crear: async (data: CrearUsuarioDTO) => {
    const existe = await usuarioRepository.findByCorreo(data.correo);
    if (existe) throw new Error("El correo ya está registrado");
    const clave = await bcrypt.hash(data.clave, 10);
    return usuarioRepository.create({ ...data, clave }, 1);
  },

  actualizar: async (id: number, data: ActualizarUsuarioDTO) => {
    await usuarioService.obtener(id);
    if (data.correo) {
      const existe = await usuarioRepository.findByCorreo(data.correo);
      if (existe && existe.id_usuario !== id)
        throw new Error("El correo ya está en uso");
    }
    return usuarioRepository.update(id, data, 1);
  },

  eliminar: async (id: number) => {
    await usuarioService.obtener(id);
    return usuarioRepository.delete(id);
  },
};
