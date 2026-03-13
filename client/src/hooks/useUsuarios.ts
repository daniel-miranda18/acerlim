import { useState, useEffect, useCallback } from "react";
import { usuarioService } from "../services/usuario.service";
import type {
  Usuario,
  CrearUsuarioDTO,
  ActualizarUsuarioDTO,
} from "../types/usuario.types";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usuarioService.listar();
      setUsuarios(res.data.data);
    } catch {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = async (data: CrearUsuarioDTO) => {
    const res = await usuarioService.crear(data);
    await listar();
    return res.data.data;
  };

  const actualizar = async (id: number, data: ActualizarUsuarioDTO) => {
    const res = await usuarioService.actualizar(id, data);
    await listar();
    return res.data.data;
  };

  const eliminar = async (id: number) => {
    await usuarioService.eliminar(id);
    await listar();
  };

  useEffect(() => {
    listar();
  }, [listar]);

  return { usuarios, loading, error, listar, crear, actualizar, eliminar };
}
