export interface Auditoria {
  id_auditoria: number;
  tabla_afectada: string;
  id_registro: number;
  accion: string;
  descripcion: string;
  id_usuario: number | null;
  fecha_evento: string;
  estado: number;
  usuario?: {
    nombre: string;
    correo: string;
  };
}

export interface EventoHttp {
  id_evento: number;
  id_usuario: number | null;
  metodo: string;
  endpoint: string;
  descripcion: string;
  fecha_evento: string;
  estado: number;
  usuario?: {
    nombre: string;
    correo: string;
  };
}

export interface Sesion {
  id_sesion: number;
  id_usuario: number | null;
  fecha_inicio: string;
  fecha_cierre: string | null;
  ip: string;
  dispositivo: string;
  estado: number;
  usuario?: {
    nombre: string;
    correo: string;
  };
}
