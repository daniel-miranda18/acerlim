import { useState, useCallback, useEffect } from "react";
import { bobinaService } from "../services/bobina.service";
import type { Bobina, StockBobina, CrearBobinaDTO, ActualizarBobinaDTO } from "../types/bobina.types";

export const useBobinas = () => {
  const [bobinas, setBobinas] = useState<Bobina[]>([]);
  const [stock, setStock] = useState<StockBobina[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBobinas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bobinaService.listar();
      setBobinas(res.data.data);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Error al cargar bobinas");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bobinaService.getStock();
      setStock(res.data.data);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Error al cargar stock");
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = async (payload: CrearBobinaDTO) => {
    const res = await bobinaService.crear(payload);
    await fetchBobinas();
    await fetchStock();
    return res.data.data;
  };

  const actualizar = async (id: number, payload: ActualizarBobinaDTO) => {
    const res = await bobinaService.actualizar(id, payload);
    await fetchBobinas();
    await fetchStock();
    return res.data.data;
  };

  const eliminar = async (id: number) => {
    const res = await bobinaService.eliminar(id);
    await fetchBobinas();
    await fetchStock();
    return res.data.data;
  };

  useEffect(() => {
    fetchBobinas();
    fetchStock();
  }, [fetchBobinas, fetchStock]);

  return { bobinas, stock, loading, error, crear, actualizar, eliminar, recargar: fetchBobinas, recargarStock: fetchStock };
};
