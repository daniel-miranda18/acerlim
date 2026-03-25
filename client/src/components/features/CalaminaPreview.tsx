import React, { useMemo } from 'react';
import { Line } from 'react-konva';
import KonvaStage from '../common/KonvaStage';
import { generateGeometry } from "../../utils/generadorGeometria";
import type { CalaminaParams } from '../../types/geom';

interface CalaminaPreviewProps {
  params: CalaminaParams;
  containerWidth?: number;
  containerHeight?: number;
}

const CalaminaPreview: React.FC<CalaminaPreviewProps> = ({ 
  params, 
  containerWidth = 800, 
  containerHeight = 600 
}) => {
  const geometry = useMemo(() => generateGeometry(params), [params]);

  const scale = Math.min(
    (containerWidth - 40) / params.ancho,
    (containerHeight - 40) / params.largo,
    1 
  );

  const offsetX = (containerWidth - params.ancho * scale) / 2;
  const offsetY = (containerHeight - params.largo * scale) / 2;

  return (
    <div className="calamina-preview-wrapper p-4 bg-white shadow-sm rounded-lg">
      <h3 className="text-lg font-bold mb-3">{params.nombre || 'Previsualización de Calamina'}</h3>
      <KonvaStage width={containerWidth} height={containerHeight}>
        {geometry.shapes.map((shape, idx) => {
          if (shape.type === 'line') {
            const points = shape.points.flatMap(p => [
              offsetX + p.x * scale, 
              offsetY + p.y * scale
            ]);
            
            return (
              <Line
                key={idx}
                points={points}
                stroke={shape.stroke || '#000'}
                strokeWidth={shape.strokeWidth || 1}
                fill={shape.fill}
                closed={shape.closed}
              />
            );
          }
          return null;
        })}
      </KonvaStage>
      <div className="mt-3 text-sm text-gray-500">
        Dimensiones: {params.ancho} x {params.largo} mm
      </div>
    </div>
  );
};

export default CalaminaPreview;
