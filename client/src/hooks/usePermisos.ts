import { useState, useEffect, useCallback } from "react";
import { permisoService } from "../services/permiso.service";
import type {
  Permiso,
  CrearPermisoDTO,
  ActualizarPermisoDTO,
} from "../types/permiso.types";

export function usePermisos() {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await permisoService.listar();
      setPermisos(res.data.data);
    } catch {
      setError("Error al cargar permisos");
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = async (data: CrearPermisoDTO) => {
    const res = await permisoService.crear(data);
    await listar();
    return res.data.data;
  };

  const actualizar = async (id: number, data: ActualizarPermisoDTO) => {
    const res = await permisoService.actualizar(id, data);
    await listar();
    return res.data.data;
  };

  const eliminar = async (id: number) => {
    await permisoService.eliminar(id);
    await listar();
  };

  useEffect(() => {
    listar();
  }, [listar]);

  return { permisos, loading, error, listar, crear, actualizar, eliminar };
}
