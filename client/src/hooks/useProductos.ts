import { useState, useCallback, useEffect } from "react";
import { productoService } from "../services/producto.service";
import type { Producto, CrearProductoDTO, ActualizarProductoDTO } from "../types/producto.types";

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productoService.listar();
      setProductos(res.data.data);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = async (payload: CrearProductoDTO) => {
    const res = await productoService.crear(payload);
    await fetchProductos();
    return res.data.data;
  };

  const actualizar = async (id: number, payload: ActualizarProductoDTO) => {
    const res = await productoService.actualizar(id, payload);
    await fetchProductos();
    return res.data.data;
  };

  const eliminar = async (id: number) => {
    const res = await productoService.eliminar(id);
    await fetchProductos();
    return res.data.data;
  };

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return { productos, loading, error, crear, actualizar, eliminar, recargar: fetchProductos };
};
