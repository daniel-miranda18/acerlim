export interface Bobina {
  id_bobina: number;
  codigo_lote: string;
  color: string;
  espesor: number;
  ancho: number;
  peso_inicial: number;
  peso_actual: number;
  metros_lineales_inicial: number;
  metros_lineales_actual: number;
  fecha_ingreso: string;
  proveedor: string;
  estado_bobina: string;
  estado: number;
}

export interface StockBobina {
  ancho: number;
  espesor: number;
  color: string;
  total_peso_actual: number;
  cantidad_bobinas: number;
}

export type CrearBobinaDTO = Partial<Bobina>;
export type ActualizarBobinaDTO = Partial<Bobina>;
