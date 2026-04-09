import { useState, useCallback, useEffect } from "react";
import { pedidoService } from "../services/pedido.service";
import type { Pedido, CrearPedidoDTO } from "../types/pedido.types";

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pedidoService.listar();
      if (response.data.success) {
        setPedidos(response.data.data);
      } else {
        throw new Error(response.data.message || "Error al obtener pedidos");
      }
    } catch (err: any) {
      setError(err.message || "Error de conexión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const obtenerPedido = async (id: number) => {
    const res = await pedidoService.obtener(id);
    if (!res.data.success) {
      throw new Error(res.data.message || "Error al obtener pedido");
    }
    return res.data.data;
  };

  const crearPedido = async (data: CrearPedidoDTO) => {
    const res = await pedidoService.crear(data);
    if (!res.data.success) {
      throw new Error(res.data.message || "Error al crear pedido");
    }
    await fetchPedidos();
    return res.data.data;
  };

  const actualizarPedido = async (id: number, data: Partial<CrearPedidoDTO>) => {
    const res = await pedidoService.actualizar(id, data);
    if (!res.data.success) {
      throw new Error(res.data.message || "Error al actualizar pedido");
    }
    await fetchPedidos();
    return res.data.data;
  };

  const eliminarPedido = async (id: number) => {
    const res = await pedidoService.eliminar(id);
    if (!res.data.success) {
      throw new Error(res.data.message || "Error al eliminar pedido");
    }
    await fetchPedidos();
  };

  return {
    pedidos,
    loading,
    error,
    fetchPedidos,
    obtenerPedido,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
  };
};
