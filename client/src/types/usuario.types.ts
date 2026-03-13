export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono?: string | null;
  estado: number;
  fecha_creacion: string | null;
  fecha_actualizacion: string | null;
  rol?: { id_rol: number; nombre: string } | null;
}

export interface CrearUsuarioDTO {
  nombre: string;
  correo: string;
  clave: string;
  id_rol?: number;
  telefono?: string;
  estado?: number;
}

export type ActualizarUsuarioDTO = Partial<Omit<CrearUsuarioDTO, "clave">>;
