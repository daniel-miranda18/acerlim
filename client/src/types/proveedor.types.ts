export interface Proveedor {
  id_proveedor: number;
  nombre: string;
  contacto?: string | null;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  estado: number;
  fecha_creacion: string;
  fecha_actualizacion?: string | null;
}
