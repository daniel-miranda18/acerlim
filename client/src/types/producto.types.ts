export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  color: string;
  medida_largo: number;
  medida_ancho: number;
  estado: number;
}

export type CrearProductoDTO = Partial<Producto>;
export type ActualizarProductoDTO = Partial<Producto>;
