import { useState, useEffect, useCallback } from "react";
import { precioService } from "../services/precio.service";
import type { PrecioMetro, CrearPrecioDTO, ActualizarPrecioDTO } from "../types/precio.types";

export function usePrecios() {
  const [precios, setPrecios] = useState<PrecioMetro[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await precioService.listar();
      setPrecios(res.data.data);
    } catch (err) {
      console.error("Error al cargar precios:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crearPrecio = async (data: CrearPrecioDTO) => {
    const res = await precioService.crear(data);
    await cargar();
    return res.data.data;
  };

  const actualizarPrecio = async (id: number, data: ActualizarPrecioDTO) => {
    const res = await precioService.actualizar(id, data);
    await cargar();
    return res.data.data;
  };

  const eliminarPrecio = async (id: number) => {
    await precioService.eliminar(id);
    await cargar();
  };

  return { precios, loading, cargar, crearPrecio, actualizarPrecio, eliminarPrecio };
}
