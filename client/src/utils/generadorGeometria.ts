import type { CalaminaParams, GeometricStructure, Shape2D } from '../types/geom';

export const generateGeometry = (params: CalaminaParams): GeometricStructure => {
  const shapes: Shape2D[] = [];
  const { largo, ancho, tipo, paso_ondulacion = 50 } = params;

  shapes.push({
    type: 'line',
    points: [
      { x: 0, y: 0 },
      { x: ancho, y: 0 },
      { x: ancho, y: largo },
      { x: 0, y: largo },
      { x: 0, y: 0 }
    ],
    stroke: '#333',
    strokeWidth: 2,
    closed: true,
    fill: '#e0e0e0'
  });

  if (tipo === 'ondulada') {
    for (let x = paso_ondulacion; x < ancho; x += paso_ondulacion) {
      shapes.push({
        type: 'line',
        points: [
          { x: x, y: 0 },
          { x: x, y: largo }
        ],
        stroke: '#888',
        strokeWidth: 1
      });
    }
  } else if (tipo === 'trapezoidal') {
    for (let x = paso_ondulacion; x < ancho; x += paso_ondulacion) {
      shapes.push({
        type: 'line',
        points: [
          { x: x - 5, y: 0 },
          { x: x - 5, y: largo }
        ],
        stroke: '#666',
        strokeWidth: 1
      });
      shapes.push({
        type: 'line',
        points: [
          { x: x + 5, y: 0 },
          { x: x + 5, y: largo }
        ],
        stroke: '#666',
        strokeWidth: 1
      });
    }
  }

  return {
    params,
    shapes,
    boundingBox: {
      min: { x: 0, y: 0 },
      max: { x: ancho, y: largo }
    }
  };
};
