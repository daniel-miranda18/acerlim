import type { Pedido } from "./pedido.types";
import type { Bobina } from "./bobina.types";

export interface Produccion {
  id_produccion: number;
  id_pedido: number;
  id_bobina: number;
  metros_consumidos: number;
  observaciones: string | null;
  estado: number;
  fecha_creacion: string;
  pedido?: Pedido;
  bobina?: Bobina;
}

export interface CrearProduccionDTO {
  id_pedido: number;
  id_bobina: number;
  metros_consumidos: number;
  observaciones?: string;
}
