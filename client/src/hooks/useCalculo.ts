import { useMemo } from "react";
import type { Producto } from "../types/producto.types";

/* ── Interfaces ────────────────────────────────────────────── */

export interface Franja {
  franja: number;
  altura: number;     // altura real de esta franja en metros
  calaminas: number;  // piezas necesarias para esta franja
}

export interface ColaPato {
  activa: boolean;
  cantidad: number;
  base: number;
  altura: number;      // colaAltura (altura máxima)
  n_franjas: number;
  franjas: Franja[];
  cal_por_cola: number;
  total_colas: number;
}

export interface CalculoResult {
  largoEfectivo: number;
  anchoEfectivo: number;
  filas: number;
  cols: number;
  totalTecho: number;
  totalColas: number;
  totalGeneral: number;
  totalMetrosLineales: number;
  total: number;
  traslapeCm: number;
  nFranjas: number;
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
    total_metros_lineales: number;
    caidas: number;
  };
}

/* ── Pure calculation ───────────────────────────────────────── */

function calcular(
  techoLargo: number,
  techoAncho: number,
  producto: Producto | null,
  traslapeCm: number,
  colaActiva: boolean,
  colaBase: number,
  colaAltura: number,
  colaCantidad: number,
  caidas: number = 2
): CalculoResult | null {
  if (!producto) return null;

  const calLargo = Number(producto.medida_largo);
  const calAncho = Number(producto.medida_ancho);

  const traslapeMt = traslapeCm / 100;
  const largoEfectivo = +(calLargo - traslapeMt).toFixed(2);
  const anchoEfectivo = calAncho;

  if (largoEfectivo <= 0 || anchoEfectivo <= 0) return null;

  const filas = techoLargo <= calLargo ? 1 : 1 + Math.ceil((techoLargo - calLargo) / largoEfectivo);
  const cols  = Math.ceil(techoAncho / anchoEfectivo);
  const totalTecho = filas * cols;

  /* ── Cola de pato — cálculo franja por franja ── */
  let nFranjas   = 0;
  let calPorCola = 0;
  let totalColas = 0;
  const franjas: Franja[] = [];

  if (colaActiva) {
    // 1. Número de franjas (columnas a lo largo de la base)
    nFranjas = Math.ceil(colaBase / anchoEfectivo);

    // 2. Altura proporcional por franja y calaminas necesarias
    for (let i = 1; i <= nFranjas; i++) {
      const h_i = colaAltura * (nFranjas - i + 1) / nFranjas;
      const calPorFranja = h_i <= calLargo ? 1 : 1 + Math.ceil((h_i - calLargo) / largoEfectivo);
      franjas.push({
        franja: i,
        altura: parseFloat(h_i.toFixed(2)),
        calaminas: calPorFranja,
      });
    }

    // 3. Total por 1 cola
    calPorCola = franjas.reduce((sum, f) => sum + f.calaminas, 0);

    // 4. Total todas las colas
    totalColas = calPorCola * colaCantidad;
  }

  const totalGeneral = colaActiva ? totalTecho + totalColas : totalTecho;
  const totalMetrosLineales = +(totalGeneral * calLargo).toFixed(2);

  const colaPato: ColaPato = {
    activa:      colaActiva,
    cantidad:    colaCantidad,
    base:        colaBase,
    altura:      colaAltura,
    n_franjas:   nFranjas,
    franjas,
    cal_por_cola: calPorCola,
    total_colas:  totalColas,
  };

  return {
    largoEfectivo,
    anchoEfectivo,
    filas,
    cols,
    totalTecho,
    totalColas,
    totalGeneral,
    totalMetrosLineales,
    total: totalGeneral,
    traslapeCm,
    nFranjas,
    calPorCola,
    colaPato,
    datosJson: {
      id_producto:    producto.id_producto,
      techo_largo:    +techoLargo.toFixed(2),
      techo_ancho:    +techoAncho.toFixed(2),
      cal_largo:      calLargo,
      cal_ancho:      calAncho,
      traslape_cm:    traslapeCm,
      largo_efectivo: largoEfectivo,
      ancho_efectivo: anchoEfectivo,
      filas,
      columnas:       cols,
      total_techo:    totalTecho,
      cola_pato:      colaPato,
      total_general:  totalGeneral,
      total_metros_lineales: totalMetrosLineales,
      caidas:         caidas,
    },
  };
}

/* ── Hook ───────────────────────────────────────────────────── */

export function useCalculo(
  techoLargo: number,
  techoAncho: number,
  producto: Producto | null,
  traslapeCm: number,
  colaActiva: boolean = false,
  colaBase: number = 2,
  colaAltura: number = 1.5,
  colaCantidad: number = 1,
  caidas: number = 2
): CalculoResult | null {
  return useMemo(
    () => calcular(techoLargo, techoAncho, producto, traslapeCm, colaActiva, colaBase, colaAltura, colaCantidad, caidas),
    [techoLargo, techoAncho, producto, traslapeCm, colaActiva, colaBase, colaAltura, colaCantidad, caidas]
  );
}
