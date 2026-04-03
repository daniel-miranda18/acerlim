import { useState, useCallback, useEffect } from "react";
import { proveedorService } from "../services/proveedor.service";
import type { Proveedor } from "../types/proveedor.types";

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProveedores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await proveedorService.listar();
      setProveedores(res.data.data);
      setError(null);
    } catch (e: any) {
      if (e.response?.status !== 401) {
        setError(e.message || "Error al cargar proveedores");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = async (payload: Partial<Proveedor>) => {
    const res = await proveedorService.crear(payload);
    await fetchProveedores();
    return res.data.data;
  };

  const actualizar = async (id: number, payload: Partial<Proveedor>) => {
    const res = await proveedorService.actualizar(id, payload);
    await fetchProveedores();
    return res.data.data;
  };

  const eliminar = async (id: number) => {
    const res = await proveedorService.eliminar(id);
    await fetchProveedores();
    return res.data.data;
  };

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  return { 
    proveedores, 
    loading, 
    error, 
    crear, 
    actualizar, 
    eliminar, 
    recargar: fetchProveedores 
  };
};
