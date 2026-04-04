import { useMemo } from "react";
import type { Producto } from "../types/producto.types";

export interface ColaStrip {
  fila: number;
  anchoCorte: number;  // ancho del corte en esa franja (metros)
  alto: number;        // alto de la franja (metros)
}

export interface ColaPato {
  activa: boolean;
  cantidad: number;
  base: number;
  altura: number;
  strips: ColaStrip[];
  totalPiezasPorCola: number;
  total_colas: number;
  area_por_cola: number;
  cal_por_cola: number;
}

export interface CalculoResult {
  largoEfectivo: number;
  anchoEfectivo: number;
  filas: number;
  cols: number;
  totalTecho: number;
  totalColas: number;
  totalGeneral: number;
  total: number;
  traslapeCm: number;
  areaPorCola: number;
  calPorCola: number;
  colaPato: ColaPato;
  datosJson: {
    id_producto: number;
    techo_largo: number;
    techo_ancho: number;
    cal_largo: number;
    cal_ancho: number;
    traslape_cm: number;
    largo_efectivo: number;
    ancho_efectivo: number;
    filas: number;
    columnas: number;
    total_techo: number;
    cola_pato: ColaPato;
    total_general: number;
  };
}

function calcular(
  techoLargo: number,
  techoAncho: number,
  producto: Producto | null,
  traslapeCm: number,
  colaActiva: boolean,
  colaBase: number,
  colaAltura: number,
  colaCantidad: number
): CalculoResult | null {
  if (!producto) return null;

  const calLargo = Number(producto.medida_largo);
  const calAncho = Number(producto.medida_ancho);

  const traslapeMt = traslapeCm / 100;
  const largoEfectivo = +(calLargo - traslapeMt).toFixed(2);
  const anchoEfectivo = +(calAncho * 0.95).toFixed(2);

  if (largoEfectivo <= 0 || anchoEfectivo <= 0) return null;

  const filas = Math.ceil(techoLargo / largoEfectivo);
  const cols = Math.ceil(techoAncho / anchoEfectivo);
  const totalTecho = filas * cols;

  // Cola de pato — cálculo por franjas
  let areaPorCola = 0;
  let calPorCola = 0;
  let totalColas = 0;
  const strips: ColaStrip[] = [];

  if (colaActiva) {
    areaPorCola = +((colaBase * colaAltura) / 2).toFixed(2);

    // Dividir la altura del triángulo en franjas de largoEfectivo
    const numStrips = Math.ceil(colaAltura / largoEfectivo);
    for (let i = 0; i < numStrips; i++) {
      const d = i * largoEfectivo;
      const alto = +(Math.min(largoEfectivo, colaAltura - d)).toFixed(2);
      const anchoCorte = +(colaBase * (1 - d / colaAltura)).toFixed(2);
      if (anchoCorte > 0) {
        strips.push({ fila: i, anchoCorte, alto });
      }
    }

    calPorCola = strips.length; // 1 pieza por franja
    totalColas = calPorCola * colaCantidad;
  }

  const totalGeneral = colaActiva ? totalTecho + totalColas : totalTecho;

  const colaPato: ColaPato = {
    activa: colaActiva,
    cantidad: colaCantidad,
    base: colaBase,
    altura: colaAltura,
    strips,
    totalPiezasPorCola: calPorCola,
    total_colas: totalColas,
    area_por_cola: areaPorCola,
    cal_por_cola: calPorCola,
  };

  return {
    largoEfectivo,
    anchoEfectivo,
    filas,
    cols,
    totalTecho,
    totalColas,
    totalGeneral,
    total: totalGeneral,
    traslapeCm,
    areaPorCola,
    calPorCola,
    colaPato,
    datosJson: {
      id_producto: producto.id_producto,
      techo_largo: +techoLargo.toFixed(2),
      techo_ancho: +techoAncho.toFixed(2),
      cal_largo: calLargo,
      cal_ancho: calAncho,
      traslape_cm: traslapeCm,
      largo_efectivo: largoEfectivo,
      ancho_efectivo: anchoEfectivo,
      filas,
      columnas: cols,
      total_techo: totalTecho,
      cola_pato: colaPato,
      total_general: totalGeneral,
    },
  };
}

export function useCalculo(
  techoLargo: number,
  techoAncho: number,
  producto: Producto | null,
  traslapeCm: number,
  colaActiva: boolean = false,
  colaBase: number = 2,
  colaAltura: number = 1.5,
  colaCantidad: number = 1
): CalculoResult | null {
  return useMemo(
    () => calcular(techoLargo, techoAncho, producto, traslapeCm, colaActiva, colaBase, colaAltura, colaCantidad),
    [techoLargo, techoAncho, producto, traslapeCm, colaActiva, colaBase, colaAltura, colaCantidad]
  );
}
