import { useState, useEffect, useCallback } from "react";
import { colorService } from "../services/color.service";
import type { Color, CrearColorDTO, ActualizarColorDTO } from "../types/color.types";

export function useColores() {
  const [colores, setColores] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await colorService.listar();
      setColores(res.data.data);
    } catch (err) {
      console.error("Error al cargar colores:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crearColor = async (data: CrearColorDTO) => {
    const res = await colorService.crear(data);
    await cargar();
    return res.data.data;
  };

  const actualizarColor = async (id: number, data: ActualizarColorDTO) => {
    const res = await colorService.actualizar(id, data);
    await cargar();
    return res.data.data;
  };

  const eliminarColor = async (id: number) => {
    await colorService.eliminar(id);
    await cargar();
  };

  return { colores, loading, cargar, crearColor, actualizarColor, eliminarColor };
}
