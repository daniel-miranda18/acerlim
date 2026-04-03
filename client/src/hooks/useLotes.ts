import { useState, useEffect, useCallback } from "react";
import type { Lote } from "../types/lote.types";
import { loteService } from "../services/lote.service";
import toast from "react-hot-toast";

export function useLotes() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await loteService.getLotes();
      setLotes(res.data.data);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast.error("Error al cargar lotes");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLotes();
  }, [fetchLotes]);

  return {
    lotes,
    loading,
    refreshLotes: fetchLotes,
  };
}
