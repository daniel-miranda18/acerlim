import React, { useState, useMemo } from 'react';
import { CCard, CCardBody, CCardHeader, CCardFooter, CNav, CNavItem, CNavLink, CFormInput, CButton, CRow, CCol, CBadge } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilSettings, cilCalculator, cilChartLine } from '@coreui/icons';
import { calculateFactorK, roundTo, calculateAreas } from '../../utils/calculosTecho';
import type { CalaminaParams, SlopeInfo } from '../../types/geom';
import { useTheme } from '../../context/ThemeContext';

interface CalculadoraTechoProps {
  params: CalaminaParams;
  onUpdate: (updates: Partial<CalaminaParams>) => void;
}

type TabType = 'geometria' | 'materiales' | 'calculos';

const CalculadoraTecho: React.FC<CalculadoraTechoProps> = ({ params, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('geometria');
  const { theme } = useTheme();
  
  const { largo, ancho, calculo } = params;
  const pendientes = calculo?.pendientes || [];

  const results = useMemo(() => {
    return calculateAreas(ancho, largo, pendientes);
  }, [ancho, largo, pendientes]);

  const handleWidthChange = (val: number) => onUpdate({ ancho: val });
  const handleLengthChange = (val: number) => onUpdate({ largo: val });

  const addSlope = () => {
    const newSlope: SlopeInfo = {
      nombre: `P${pendientes.length + 1}`,
      porcentaje: 15,
      factor_k: calculateFactorK(15)
    };
    onUpdate({
      calculo: {
        ...(calculo || { cumbres: 0, limas: 0 }),
        pendientes: [...pendientes, newSlope]
      }
    });
  };

  const updateSlope = (index: number, percentage: number) => {
    const newPendientes = [...pendientes];
    newPendientes[index] = {
      ...newPendientes[index],
      porcentaje: percentage,
      factor_k: calculateFactorK(percentage)
    };
    onUpdate({
      calculo: {
        ...(calculo || { cumbres: 0, limas: 0 }),
        pendientes: newPendientes
      }
    });
  };

  const removeSlope = (index: number) => {
    const newPendientes = pendientes.filter((_, i) => i !== index);
    onUpdate({
      calculo: {
        ...(calculo || { cumbres: 0, limas: 0 }),
        pendientes: newPendientes
      }
    });
  };

  return (
    <CCard className="shadow-sm border-0 mb-4 h-100">
      <CCardHeader className="py-0 border-bottom-0">
        <CNav variant="tabs" className="card-header-tabs border-bottom-0">
          <CNavItem>
            <CNavLink 
              active={activeTab === 'geometria'} 
              onClick={() => setActiveTab('geometria')}
              className="py-3 px-3 cursor-pointer"
            >
              <CIcon icon={cilSettings} className="me-2" />
              Geometría
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink 
              active={activeTab === 'materiales'} 
              onClick={() => setActiveTab('materiales')}
              className="py-3 px-3 cursor-pointer"
            >
              <CIcon icon={cilCalculator} className="me-2" />
              Materiales
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink 
              active={activeTab === 'calculos'} 
              onClick={() => setActiveTab('calculos')}
              className="py-3 px-3 cursor-pointer"
            >
              <CIcon icon={cilChartLine} className="me-2" />
              Cálculos
            </CNavLink>
          </CNavItem>
        </CNav>
      </CCardHeader>

      <CCardBody className="p-4">
        {activeTab === 'geometria' && (
          <div>
            <h6 className="text-[10px] text-uppercase text-secondary ls-1 mb-4 fw-bold">Dimensiones y Diseño</h6>
            <CRow className="mb-4">
              <CCol xs={6}>
                <label className="form-label text-[10px] text-uppercase text-secondary mb-1">Ancho (X)</label>
                <div className="input-group input-group-sm">
                  <CFormInput 
                    type="number" 
                    value={ancho / 1000} 
                    onChange={(e) => handleWidthChange(parseFloat(e.target.value) * 1000 || 0)}
                    className="border-gray-300"
                  />
                  <span className="input-group-text bg-body-tertiary text-secondary">m</span>
                </div>
              </CCol>
              <CCol xs={6}>
                <label className="form-label text-[10px] text-uppercase text-secondary mb-1">Largo (Y)</label>
                <div className="input-group input-group-sm">
                  <CFormInput 
                    type="number" 
                    value={largo / 1000} 
                    onChange={(e) => handleLengthChange(parseFloat(e.target.value) * 1000 || 0)}
                    className="border-gray-300"
                  />
                  <span className="input-group-text bg-body-tertiary text-secondary">m</span>
                </div>
              </CCol>
            </CRow>

            <h6 className="text-[10px] text-uppercase text-secondary ls-1 mb-2 fw-bold">Número de Caídas</h6>
            <div className="d-flex gap-2 mb-4">
              {[1, 2, 3, 4].map((num) => (
                <CButton
                  key={num}
                  color={params.caidas === num || (!params.caidas && num === 2) ? "primary" : "secondary"}
                  variant={params.caidas === num || (!params.caidas && num === 2) ? "solid" : "ghost"}
                  className={`flex-grow-1 py-2 fw-bold ${params.caidas !== num && !(num === 2 && !params.caidas) ? 'text-secondary-emphasis' : ''}`}
                  onClick={() => onUpdate({ caidas: num })}
                >
                  {num} {num === 1 ? "Caída" : "Caídas"}
                  {num === 2 && !params.caidas && <small className="d-block text-[8px] opacity-75">Por defecto</small>}
                </CButton>
              ))}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-[10px] text-uppercase text-secondary ls-1 mb-0 fw-bold">Pendientes de Techo</h6>
                <CButton color="link" className="p-0 text-primary text-decoration-none fw-semibold" size="sm" onClick={addSlope}>
                    <CIcon icon={cilPlus} size="sm" className="me-1" />
                    Agregar
                </CButton>
            </div>

            <div className="vstack gap-3 mb-4">
              {pendientes.map((slope, idx) => (
                <div key={idx} className={`p-3 border rounded shadow-sm hover-shadow transition-all ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                        <CBadge color="primary" shape="rounded-pill" className="px-2">{slope.nombre}</CBadge>
                        <span className="text-xs fw-semibold">Pendiente Principal</span>
                    </div>
                    <CButton color="light" size="sm" onClick={() => removeSlope(idx)}>
                        <CIcon icon={cilTrash} className="text-danger" />
                    </CButton>
                  </div>
                  <CRow className="align-items-center">
                    <CCol xs={6}>
                        <div className="input-group input-group-sm">
                            <CFormInput 
                                type="number" 
                                value={slope.porcentaje}
                                onChange={(e) => updateSlope(idx, parseFloat(e.target.value) || 0)}
                                className="border-0 bg-body-tertiary fw-bold"
                            />
                            <span className="input-group-text bg-body-tertiary border-0 text-secondary">%</span>
                        </div>
                    </CCol>
                    <CCol xs={6} className="text-end">
                        <small className="text-secondary text-[9px] text-uppercase ls-1 d-block mb-1">Factor k</small>
                        <span className="font-mono fw-bold text-primary">{roundTo(slope.factor_k, 3)}</span>
                    </CCol>
                  </CRow>
                </div>
              ))}
            </div>

            <h6 className="text-[10px] text-uppercase text-secondary ls-1 mb-3 fw-bold">Elementos del Techo</h6>
            <CRow className="g-3">
                <CCol xs={6}>
                    <div className={`p-3 border-0 rounded text-center shadow-sm ${theme === 'dark' ? 'bg-dark opacity-75' : 'bg-light'}`}>
                        <small className="text-secondary text-[9px] text-uppercase ls-1 d-block mb-1">Cumbres</small>
                        <span className={`h4 mb-0 fw-bold ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>{calculo?.cumbres || 0}</span>
                    </div>
                </CCol>
                <CCol xs={6}>
                    <div className={`p-3 border-0 rounded text-center shadow-sm ${theme === 'dark' ? 'bg-dark opacity-75' : 'bg-light'}`}>
                        <small className="text-secondary text-[9px] text-uppercase ls-1 d-block mb-1">Limas</small>
                        <span className={`h4 mb-0 fw-bold ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>{calculo?.limas || 0}</span>
                    </div>
                </CCol>
            </CRow>
          </div>
        )}

        {activeTab === 'calculos' && (
          <div>
            <h6 className="text-[10px] text-uppercase text-secondary ls-1 mb-4 fw-bold">Resumen de Cálculo</h6>
            <div className="vstack gap-4">
              <div className={`p-4 border rounded shadow-sm ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small fw-semibold">Área Plana (Base)</span>
                  <span className="h4 mb-0 fw-bold">{results.areaPlana} m²</span>
                </div>
                <div className="progress" style={{ height: 4 }}>
                    <div className="progress-bar bg-secondary" style={{ width: '100%' }}></div>
                </div>
                <small className="text-secondary mt-2 d-block text-[10px]">Cálculo base sin considerar pendiente.</small>
              </div>

              <div className="p-4 bg-primary text-white border-0 rounded shadow" style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-semibold text-white-50">Área Proyectada</span>
                  <span className="h3 mb-0 fw-bold">{results.areaProyectada} m²</span>
                </div>
                <div className="progress bg-white-20" style={{ height: 4 }}>
                    <div className="progress-bar bg-white" style={{ width: '100%' }}></div>
                </div>
                <small className="text-white-50 mt-2 d-block text-[10px]">Afectada por factor k: {results.factorK}</small>
              </div>

              <div className="mt-4 pt-4 border-top">
                <h6 className="text-[10px] text-uppercase text-secondary ls-1 mb-3 fw-bold">Desglose Técnico</h6>
                {pendientes.map((s, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center mb-2 p-2 rounded hover-light transition-all">
                        <span className="text-secondary small">{s.nombre} ({s.porcentaje}%)</span>
                        <span className="fw-bold small">{roundTo((ancho/1000)*(largo/1000)*s.factor_k)} m²</span>
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materiales' && (
          <div className="text-center py-5 vstack gap-3 animate-in slide-in-from-bottom-2 duration-500">
            <div className="display-4 text-center op-20">📦</div>
            <h6 className="fw-bold mb-0">Gestión de Materiales</h6>
            <p className="text-secondary small px-4">Esta sección permitirá asignar tipos de calaminas a cada pendiente del diseño.</p>
            <CButton color="primary" variant="outline" size="sm" disabled className="mx-5">Programar</CButton>
          </div>
        )}
      </CCardBody>

      <CCardFooter className="border-top-0 p-4 mt-auto">
        <CButton color="primary" className="w-100 py-3 fw-bold shadow-sm" size="lg" style={{ letterSpacing: '0.5px' }}>
          ACTUALIZAR GEOMETRÍA
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default CalculadoraTecho;
