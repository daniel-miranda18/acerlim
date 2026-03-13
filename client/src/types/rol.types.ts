export interface Rol {
  id_rol: number;
  nombre: string;
  descripcion?: string | null;
  estado: number;
  fecha_creacion: string | null;
  fecha_actualizacion: string | null;
  usuario_creacion?: number | null;
  usuario_actualizacion?: number | null;
}

export interface RolConPermisos extends Rol {
  permisos: PermisoBasico[];
}

export interface PermisoBasico {
  id_permiso: number;
  nombre: string;
  descripcion?: string | null;
}

export interface CrearRolDTO {
  nombre: string;
  descripcion?: string;
  estado?: number;
}

export type ActualizarRolDTO = Partial<CrearRolDTO>;
