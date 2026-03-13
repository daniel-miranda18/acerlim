import { useState, useEffect, useCallback } from "react";
import { rolService } from "../services/rol.service";
import type { Rol, CrearRolDTO, ActualizarRolDTO } from "../types/rol.types";

export function useRoles() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rolService.listar();
      setRoles(res.data.data);
    } catch {
      setError("Error al cargar roles");
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = async (data: CrearRolDTO) => {
    const res = await rolService.crear(data);
    await listar();
    return res.data.data;
  };

  const actualizar = async (id: number, data: ActualizarRolDTO) => {
    const res = await rolService.actualizar(id, data);
    await listar();
    return res.data.data;
  };

  const eliminar = async (id: number) => {
    await rolService.eliminar(id);
    await listar();
  };

  useEffect(() => {
    listar();
  }, [listar]);

  return { roles, loading, error, listar, crear, actualizar, eliminar };
}
