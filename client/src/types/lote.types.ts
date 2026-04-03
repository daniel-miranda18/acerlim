import type { Proveedor } from "./proveedor.types";
import type { Bobina } from "./bobina.types";

export interface Lote {
  id_lote: number;
  codigo_lote: string;
  id_proveedor?: number | null;
  proveedor_rel?: Proveedor;
  fecha_ingreso?: string;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  usuario_creacion?: number;
  usuario_actualizacion?: number;
  bobinas?: Bobina[];
  _count?: {
    bobinas: number;
  };
}

export interface CrearLoteDTO {
  codigo_lote: string;
  id_proveedor?: number | null;
  fecha_ingreso?: string;
}

export interface ActualizarLoteDTO extends Partial<CrearLoteDTO> {}
