export interface SlopeInfo {
  nombre: string;
  porcentaje: number;
  factor_k: number;
}

export interface CalculationParams {
  pendientes: SlopeInfo[];
  cumbres: number;
  limas: number;
  area_plana?: number;
  area_proyectada?: number;
}

export interface CalaminaParams {
  id_producto?: number;
  nombre?: string;
  largo: number; // en mm
  ancho: number; // en mm
  tipo: 'ondulada' | 'trapezoidal' | 'lisa';
  espesor?: number;
  color?: string;
  paso_ondulacion?: number; // distancia entre picos
  altura_ondulacion?: number; // altura del pico
  calculo?: CalculationParams;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Shape2D {
  type: 'line' | 'rect' | 'circle' | 'polygon';
  points: Point2D[];
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  closed?: boolean;
}

export interface GeometricStructure {
  params: CalaminaParams;
  shapes: Shape2D[];
  boundingBox: {
    min: Point2D;
    max: Point2D;
  };
}
