export interface TipoProducto {
  id_tipo_producto: number;
  nombre: string;
}

export interface Producto {
  id_producto: number;
  id_tipo_producto: number;
  descripcion: string | null;
  medida_largo: number;
  medida_ancho: number;
  estado: number;
  tipo_producto?: TipoProducto;
}

export type CrearProductoDTO = Partial<Producto>;
export type ActualizarProductoDTO = Partial<Producto>;
