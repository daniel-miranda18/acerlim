import React from 'react';
import { Stage, Layer } from 'react-konva';
import { useTheme } from '../../context/ThemeContext';

interface KonvaStageProps {
  width: number;
  height: number;
  children: React.ReactNode;
  draggable?: boolean;
  onDragEnd?: (e: any) => void;
}

const KonvaStage: React.FC<KonvaStageProps> = ({ width, height, children, ...props }) => {
  const { theme } = useTheme();
  
  return (
    <div 
        className="konva-container overflow-hidden" 
        style={{ 
            border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
            borderRadius: '12px' 
        }}
    >
      <Stage width={width} height={height} {...props}>
        <Layer>
          {children}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaStage;
