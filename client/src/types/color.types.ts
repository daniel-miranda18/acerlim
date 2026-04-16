export interface Color {
  id_color: number;
  nombre: string;
  codigo_hex: string;
  estado: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
}

export interface CrearColorDTO {
  nombre: string;
  codigo_hex: string;
}

export type ActualizarColorDTO = Partial<CrearColorDTO>;
