import { useState, useEffect, useMemo } from "react";
import type { Bobina } from "../../types/bobina.types";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CCol,
  CSpinner,
} from "@coreui/react";
import { useLotes } from "../../hooks/useLotes";

interface BobinaFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Bobina>) => Promise<void>;
  bobina: Bobina | null;
  loading: boolean;
  errors?: Record<string, string[]>;
}

export default function BobinaForm({
  visible,
  onClose,
  onSubmit,
  bobina,
  loading,
  errors = {},
}: BobinaFormProps) {
  const { lotes } = useLotes();

  const [formData, setFormData] = useState<Partial<Bobina>>(
    bobina || {
      id_lote: 0,
      color: "",
      espesor: 0,
      ancho: 0,
      peso_inicial: 0,
      peso_actual: 0,
      metros_lineales_inicial: 0,
      metros_lineales_actual: 0,
      estado_bobina: "En Inventario",
    }
  );

  const [loteSearchTerm, setLoteSearchTerm] = useState("");
  const [showLoteDropdown, setShowLoteDropdown] = useState(false);

  const filteredLotes = useMemo(() => {
    return lotes.filter((l) =>
      l.codigo_lote.toLowerCase().includes(loteSearchTerm.toLowerCase())
    );
  }, [lotes, loteSearchTerm]);

  // Update form data when editing
  useEffect(() => {
    if (bobina) {
      setFormData({
        ...bobina,
        espesor: Number(bobina.espesor) || 0,
        ancho: Number(bobina.ancho) || 0,
        peso_inicial: Number(bobina.peso_inicial) || 0,
        peso_actual: Number(bobina.peso_actual) || 0,
        metros_lineales_inicial: Number(bobina.metros_lineales_inicial) || 0,
        metros_lineales_actual: Number(bobina.metros_lineales_actual) || 0,
        estado_bobina: bobina.estado_bobina || "En Inventario",
      });
      if (bobina.lote_rel) {
        setLoteSearchTerm(bobina.lote_rel.codigo_lote);
      }
    } else {
      setFormData({
        id_lote: 0,
        color: "",
        espesor: 0,
        ancho: 0,
        peso_inicial: 0,
        peso_actual: 0,
        metros_lineales_inicial: 0,
        metros_lineales_actual: 0,
        estado_bobina: "En Inventario",
      });
      setLoteSearchTerm("");
    }
  }, [bobina, visible, lotes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = [
      "espesor",
      "ancho",
      "peso_inicial",
      "peso_actual",
      "metros_lineales_inicial",
      "metros_lineales_actual",
      "id_proveedor",
    ].includes(name);
    setFormData((prev: any) => ({
      ...prev,
      [name]: isNumber ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };
    
    if (!bobina) {
      if (!submitData.peso_actual || Number(submitData.peso_actual) <= 0) {
        submitData.peso_actual = submitData.peso_inicial;
      }
      if (!submitData.metros_lineales_actual || Number(submitData.metros_lineales_actual) <= 0) {
        submitData.metros_lineales_actual = submitData.metros_lineales_inicial;
      }
    } else {
      // metadata fields that shouldn't be updated manually
      delete (submitData as any).id_bobina;
      delete (submitData as any).fecha_creacion;
      delete (submitData as any).fecha_actualizacion;
      delete (submitData as any).estado;
    }
    
    onSubmit(submitData);
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static" size="lg">
      <CModalHeader closeButton>
        <CModalTitle>{bobina ? "Editar Bobina" : "Registrar Bobina"}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={12}>
              <CFormLabel>Lote (Buscador)</CFormLabel>
              <div className="position-relative">
                <CFormInput
                  placeholder="Buscar lote por código..."
                  value={loteSearchTerm}
                  onChange={(e) => {
                    setLoteSearchTerm(e.target.value);
                    setShowLoteDropdown(true);
                  }}
                  onFocus={() => setShowLoteDropdown(true)}
                  invalid={!!errors.id_lote}
                  feedbackInvalid={errors.id_lote?.[0]}
                  autoComplete="off"
                  required
                />
                {showLoteDropdown && (loteSearchTerm || lotes.length > 0) && (
                  <ul 
                    className="dropdown-menu show w-100 shadow-sm" 
                    style={{ 
                      maxHeight: "200px", 
                      overflowY: "auto",
                      top: "100%",
                      zIndex: 1050 
                    }}
                  >
                    {filteredLotes.length === 0 ? (
                      <li className="dropdown-item text-secondary small">
                        No se encontraron lotes. 
                        <CButton size="sm" variant="ghost" color="primary" className="ms-2" onClick={() => window.location.href='/lotes'}>
                          Crear Lote
                        </CButton>
                      </li>
                    ) : (
                      filteredLotes.map((l) => (
                        <li 
                          key={l.id_lote} 
                          className="dropdown-item d-flex justify-content-between align-items-center" 
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, id_lote: l.id_lote }));
                            setLoteSearchTerm(l.codigo_lote);
                            setShowLoteDropdown(false);
                          }}
                        >
                          <span>{l.codigo_lote}</span>
                          <small className="text-secondary">
                            {l.proveedor_rel?.nombre || "Sin proveedor"} - {l.fecha_ingreso?.substring(0, 10)}
                          </small>
                        </li>
                      ))
                    )}
                  </ul>
                )}
                {showLoteDropdown && (
                  <div 
                    className="position-fixed top-0 start-0 w-100 h-100" 
                    style={{ zIndex: 1040 }}
                    onClick={() => setShowLoteDropdown(false)}
                  />
                )}
              </div>
            </CCol>
            
            <CCol md={4}>
              <CFormLabel>Color</CFormLabel>
              <CFormInput
                name="color"
                value={formData.color || ""}
                onChange={handleChange}
                invalid={!!errors.color}
                feedbackInvalid={errors.color?.[0]}
                required
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Espesor (mm)</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                min="0"
                name="espesor"
                value={formData.espesor || ""}
                onChange={handleChange}
                invalid={!!errors.espesor}
                feedbackInvalid={errors.espesor?.[0]}
                required
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Ancho (mm)</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                min="0"
                name="ancho"
                value={formData.ancho || ""}
                onChange={handleChange}
                invalid={!!errors.ancho}
                feedbackInvalid={errors.ancho?.[0]}
                required
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Peso Inicial (kg)</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                min="0"
                name="peso_inicial"
                value={formData.peso_inicial || ""}
                onChange={handleChange}
                invalid={!!errors.peso_inicial}
                feedbackInvalid={errors.peso_inicial?.[0]}
                required
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Metros Lineales Inicial (m)</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                min="0"
                name="metros_lineales_inicial"
                value={formData.metros_lineales_inicial || ""}
                onChange={handleChange}
                invalid={!!errors.metros_lineales_inicial}
                feedbackInvalid={errors.metros_lineales_inicial?.[0]}
              />
            </CCol>

            {bobina && (
              <>
                <CCol md={6}>
                  <CFormLabel>Peso Actual (kg)</CFormLabel>
                  <CFormInput
                    type="number"
                    step="0.01"
                    min="0"
                    name="peso_actual"
                    value={formData.peso_actual || ""}
                    onChange={handleChange}
                    invalid={!!errors.peso_actual}
                    feedbackInvalid={errors.peso_actual?.[0]}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Metros Lineales Actual (m)</CFormLabel>
                  <CFormInput
                    type="number"
                    step="0.01"
                    min="0"
                    name="metros_lineales_actual"
                    value={formData.metros_lineales_actual || ""}
                    onChange={handleChange}
                    invalid={!!errors.metros_lineales_actual}
                    feedbackInvalid={errors.metros_lineales_actual?.[0]}
                  />
                </CCol>
                <CCol md={12}>
                  <CFormLabel>Estado Bobina</CFormLabel>
                  <CFormSelect
                    name="estado_bobina"
                    value={formData.estado_bobina || "En Inventario"}
                    onChange={handleChange}
                    invalid={!!errors.estado_bobina}
                    feedbackInvalid={errors.estado_bobina?.[0]}
                  >
                    <option value="En Inventario">En Inventario</option>
                    <option value="En Producción">En Producción</option>
                    <option value="Agotado">Agotado</option>
                  </CFormSelect>
                </CCol>
              </>
            )}

            {!bobina && (
              <>
                <CFormInput
                  type="hidden"
                  name="peso_actual"
                  value={formData.peso_actual || formData.peso_inicial || ""}
                />
                <CFormInput
                  type="hidden"
                  name="metros_lineales_actual"
                  value={formData.metros_lineales_actual || formData.metros_lineales_inicial || ""}
                />
              </>
            )}

          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </CButton>
          <CButton color="primary" type="submit" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : "Guardar"}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
}
