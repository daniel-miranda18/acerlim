import { useState, useCallback, useEffect } from "react";
import { despachoService } from "../services/despacho.service";
import type { Despacho, CrearDespachoDTO } from "../types/despacho.types";

export const useDespachos = () => {
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDespachos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await despachoService.listar();
      if (response.data.success) {
        setDespachos(response.data.data);
      } else {
        throw new Error(response.data.message || "Error al obtener despachos");
      }
    } catch (err: any) {
      setError(err.message || "Error de conexión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDespachos();
  }, [fetchDespachos]);

  const crearDespacho = async (data: CrearDespachoDTO) => {
    const res = await despachoService.crear(data);
    if (!res.data.success) {
      throw new Error(res.data.message || "Error al crear despacho");
    }
    await fetchDespachos();
    return res.data.data;
  };

  return {
    despachos,
    loading,
    error,
    fetchDespachos,
    crearDespacho,
  };
};
