import type { SlopeInfo } from '../types/geom';

/**
 * Redondea un número a un número específico de decimales.
 */
export const roundTo = (num: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

/**
 * Calcula el factor k basado en el porcentaje de pendiente.
 * Factor k = sqrt(1 + (pendiente%)^2)
 * @param porcentaje Pendiente en porcentaje (ej. 15 para 15%)
 */
export const calculateFactorK = (porcentaje: number): number => {
  const p = porcentaje / 100;
  return Math.sqrt(1 + Math.pow(p, 2));
};

/**
 * Calcula el área plana y proyectada.
 * @param ancho Ancho en mm
 * @param largo Largo en mm
 * @param pendientes Lista de pendientes aplicables
 */
export const calculateAreas = (
  ancho: number,
  largo: number,
  pendientes: SlopeInfo[]
) => {
  // Convertir mm a m para el área
  const anchoM = ancho / 1000;
  const largoM = largo / 1000;
  const areaPlana = anchoM * largoM;

  // Si hay múltiples pendientes, el factor_k resultante puede ser complejo.
  // Supondremos que el área proyectada total usa el factor de la pendiente principal (la primera).
  const factorK = pendientes.length > 0 ? pendientes[0].factor_k : 1;
  const areaProyectada = areaPlana * factorK;

  return {
    areaPlana: roundTo(areaPlana),
    areaProyectada: roundTo(areaProyectada),
    factorK: roundTo(factorK, 3)
  };
};
