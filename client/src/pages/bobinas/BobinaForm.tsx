import { useState, useEffect } from "react";
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
  CRow,
  CCol,
  CSpinner,
} from "@coreui/react";

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
  const [formData, setFormData] = useState<Partial<Bobina>>(
    bobina || {
      codigo_lote: "",
      color: "",
      espesor: 0,
      ancho: 0,
      peso_inicial: 0,
      peso_actual: 0,
      proveedor: "",
      fecha_ingreso: new Date().toISOString().substring(0, 10),
    }
  );

  // Update form data when editing
  useEffect(() => {
    if (bobina) {
      setFormData({
        ...bobina,
        espesor: Number(bobina.espesor) || 0,
        ancho: Number(bobina.ancho) || 0,
        peso_inicial: Number(bobina.peso_inicial) || 0,
        peso_actual: Number(bobina.peso_actual) || 0,
        fecha_ingreso: bobina.fecha_ingreso ? bobina.fecha_ingreso.substring(0, 10) : "",
      });
    } else {
      setFormData({
        codigo_lote: "",
        color: "",
        espesor: 0,
        ancho: 0,
        peso_inicial: 0,
        peso_actual: 0,
        proveedor: "",
        fecha_ingreso: new Date().toISOString().substring(0, 10),
      });
    }
  }, [bobina, visible]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };
    
    if (!bobina) {
      if (!submitData.peso_actual || Number(submitData.peso_actual) <= 0) {
        submitData.peso_actual = submitData.peso_inicial;
      }
    } else {
      delete submitData.peso_actual;
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
            <CCol md={6}>
              <CFormLabel>Código Lote</CFormLabel>
              <CFormInput
                name="codigo_lote"
                value={formData.codigo_lote || ""}
                onChange={handleChange}
                invalid={!!errors.codigo_lote}
                feedbackInvalid={errors.codigo_lote?.[0]}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Fecha de Ingreso</CFormLabel>
              <CFormInput
                type="date"
                name="fecha_ingreso"
                value={formData.fecha_ingreso || ""}
                onChange={handleChange}
                invalid={!!errors.fecha_ingreso}
                feedbackInvalid={errors.fecha_ingreso?.[0]}
                required
              />
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
            <CCol md={6}>
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
            {!bobina && (
              <CCol md={6}>
                <CFormLabel>Peso Actual (kg)</CFormLabel>
                <CFormInput
                  type="number"
                  step="0.01"
                  min="0"
                  name="peso_actual"
                  value={formData.peso_actual || formData.peso_inicial || ""}
                  onChange={handleChange}
                  invalid={!!errors.peso_actual}
                  feedbackInvalid={errors.peso_actual?.[0]}
                  required
                />
              </CCol>
            )}
            <CCol md={bobina ? 6 : 12}>
              <CFormLabel>Proveedor</CFormLabel>
              <CFormInput
                name="proveedor"
                value={formData.proveedor || ""}
                onChange={handleChange}
                invalid={!!errors.proveedor}
                feedbackInvalid={errors.proveedor?.[0]}
              />
            </CCol>
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
