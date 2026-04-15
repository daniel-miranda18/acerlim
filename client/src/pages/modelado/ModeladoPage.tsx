import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilZoomIn, cilZoomOut, cilFullscreen, cilHandPointUp, cilPencil, cilWindowMaximize, cilHome, cilSync } from '@coreui/icons';
import KonvaStage from '../../components/common/KonvaStage';
import CalculadoraTecho from '../../components/features/CalculadoraTecho';
import { useTheme } from '../../context/ThemeContext';
import type { CalaminaParams } from '../../types/geom';
import { generateGeometry } from '../../utils/generadorGeometria';
import { Line } from 'react-konva';
import { useProductos } from '../../hooks/useProductos';

const ModeladoPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const idProducto = searchParams.get('id_producto');
  const { productos } = useProductos();

  const { theme } = useTheme();
  const [params, setParams] = useState<CalaminaParams>({
    largo: 48000, 
    ancho: 24500, 
    tipo: 'lisa',
    nombre: 'Nuevo Diseño de Techo',
    caidas: 2
  });

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (idProducto && productos.length > 0) {
      const p = productos.find(prod => prod.id_producto === parseInt(idProducto));
      if (p) {
        setParams(prev => ({
          ...prev,
          id_producto: p.id_producto,
          nombre: p.descripcion || '',
          largo: Number(p.medida_largo) * 1000,
          ancho: Number(p.medida_ancho) * 1000,
        }));
      }
    }
  }, [idProducto, productos]);

  const handleUpdateParams = (updates: Partial<CalaminaParams>) => {
    setParams(prev => ({ ...prev, ...updates }));
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.1));
  const handleResetZoom = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      cardRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const geometry = generateGeometry(params);
  const containerWidth = 800;
  const containerHeight = 500;

  const scale = Math.min(
    (containerWidth - 60) / params.ancho,
    (containerHeight - 60) / params.largo,
    0.02
  ) * zoom;

  const offsetX = (containerWidth - params.ancho * scale) / 2 + offset.x;
  const offsetY = (containerHeight - params.largo * scale) / 2 + offset.y;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold">Modelado 2D - Estructura</h4>
          <small className="text-secondary">Diseño paramétrico y cálculo de áreas</small>
        </div>
        <div className="d-flex gap-2">
            <CButton color="primary" className="d-flex align-items-center gap-2 shadow-sm">
                <CIcon icon={cilZoomIn} />
                Guardar Plano
            </CButton>
        </div>
      </div>

      <CRow>
        <CCol lg={8}>
          <CCard ref={cardRef} className="mb-4 border-0 shadow-sm overflow-hidden" style={{ minHeight: '600px' }}>
            <CCardHeader className={`py-3 d-flex justify-content-between align-items-center ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
              <div>
                <span className="fw-semibold">{params.nombre}</span>
                <div className="text-[10px] text-uppercase text-secondary ls-1">Vista de Planta</div>
              </div>
              <div className="d-flex gap-1">
                <CButton color="light" variant="ghost" size="sm" onClick={handleZoomIn} title="Acercar"><CIcon icon={cilZoomIn} /></CButton>
                <CButton color="light" variant="ghost" size="sm" onClick={handleZoomOut} title="Alejar"><CIcon icon={cilZoomOut} /></CButton>
                <CButton color="light" variant="ghost" size="sm" onClick={handleResetZoom} title="Reset"><CIcon icon={cilSync} /></CButton>
                <CButton color="light" variant="ghost" size="sm" onClick={toggleFullscreen} title="Pantalla Completa">
                    <CIcon icon={cilFullscreen} />
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody className={`p-0 position-relative d-flex align-items-center justify-content-center ${theme === 'dark' ? 'bg-black' : 'bg-light'}`} style={{ minHeight: '500px' }}>
              
              <KonvaStage 
                width={containerWidth} 
                height={containerHeight}
                draggable
                onDragEnd={(e) => setOffset({ x: e.target.x(), y: e.target.y() })}
              >
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
                        stroke={theme === 'dark' ? '#60A5FA' : (shape.stroke || '#2563EB')} 
                        strokeWidth={shape.strokeWidth || 2}
                        fill={theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : (shape.fill || 'rgba(37, 99, 235, 0.1)')}
                        closed={shape.closed}
                      />
                    );
                  }
                  return null;
                })}
              </KonvaStage>

              <div 
                className={`position-absolute start-3 top-50 translate-middle-y d-flex flex-column gap-2 p-2 rounded shadow-sm border ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-white'}`}
                style={{ zIndex: 100 }}
              >
                <CButton color="light" variant="ghost" size="sm" title="Seleccionar"><CIcon icon={cilHandPointUp} /></CButton>
                <CButton color="light" variant="ghost" size="sm" title="Dibujar"><CIcon icon={cilPencil} /></CButton>
                <CButton color="light" variant="ghost" size="sm" title="Medir"><CIcon icon={cilWindowMaximize} /></CButton>
                <CButton color="light" variant="ghost" size="sm" title="Inicio" onClick={handleResetZoom}><CIcon icon={cilHome} /></CButton>
              </div>

              <div 
                className={`position-absolute bottom-3 end-3 d-flex flex-column gap-1 p-2 rounded border shadow-sm ${theme === 'dark' ? 'bg-dark border-secondary text-light' : 'bg-white text-secondary'}`}
                style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', zIndex: 100 }}
              >
                <div className="d-flex align-items-center fw-bold text-success mb-1">
                    <span className="d-inline-block rounded-circle bg-success me-2" style={{ width: 8, height: 8 }}></span>
                    Validación E.020 OK
                </div>
                <div className="opacity-75">Carga: 30kg/m²</div>
                <div className="opacity-75">Viento: 75km/h</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          <CalculadoraTecho params={params} onUpdate={handleUpdateParams} />
        </CCol>
      </CRow>
    </div>
  );
};

export default ModeladoPage;
