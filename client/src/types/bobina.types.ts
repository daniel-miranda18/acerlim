
export interface Bobina {
  id_bobina: number;
  id_lote: number;
  lote_rel?: any; 
  id_color: number | null;
  color_rel?: any;
  espesor: number | string;
  ancho: number | string;
  peso_inicial: number | string;
  peso_actual: number | string;
  metros_lineales_inicial?: number | string | null;
  metros_lineales_actual?: number | string | null;
  estado_bobina: "En Inventario" | "En Producción" | "Agotado";
  estado: number;
  fecha_creacion: string;
  fecha_actualizacion?: string | null;
}

export interface StockBobina {
  ancho: number;
  espesor: number;
  id_color: number | null;
  color_rel?: any;
  total_peso_actual: number;
  cantidad_bobinas: number;
}

export type CrearBobinaDTO = Partial<Bobina>;
export type ActualizarBobinaDTO = Partial<Bobina>;
