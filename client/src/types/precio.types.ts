export interface PrecioMetro {
  id_precio: number;
  nombre: string;
  precio_por_metro: number;
  moneda: string;
  estado: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
}

export interface CrearPrecioDTO {
  nombre: string;
  precio_por_metro: number;
  moneda?: string;
}

export type ActualizarPrecioDTO = Partial<CrearPrecioDTO>;
