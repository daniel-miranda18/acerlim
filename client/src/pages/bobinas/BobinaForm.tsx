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
  CFormSelect,
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
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<Partial<Bobina>>(
    bobina || {
      codigo_lote: "",
      color: "",
      espesor: 0,
      ancho: 0,
      peso_inicial: 0,
      peso_actual: 0,
      metros_lineales_inicial: 0,
      metros_lineales_actual: 0,
      proveedor: "",
      estado_bobina: "En Inventario",
      fecha_ingreso: getLocalDate(),
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
        metros_lineales_inicial: Number(bobina.metros_lineales_inicial) || 0,
        metros_lineales_actual: Number(bobina.metros_lineales_actual) || 0,
        fecha_ingreso: bobina.fecha_ingreso ? bobina.fecha_ingreso.substring(0, 10) : "",
        estado_bobina: bobina.estado_bobina || "En Inventario",
      });
    } else {
      setFormData({
        codigo_lote: "",
        color: "",
        espesor: 0,
        ancho: 0,
        peso_inicial: 0,
        peso_actual: 0,
        metros_lineales_inicial: 0,
        metros_lineales_actual: 0,
        proveedor: "",
        estado_bobina: "En Inventario",
        fecha_ingreso: getLocalDate(),
      });
    }
  }, [bobina, visible]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = ["espesor", "ancho", "peso_inicial", "peso_actual", "metros_lineales_inicial", "metros_lineales_actual"].includes(name);
    setFormData((prev: any) => ({
      ...prev,
      [name]: isNumber ? Number(value) : value,
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
      delete submitData.peso_actual;
      delete submitData.metros_lineales_actual;
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
            <CCol md={6}>
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
            {!bobina && (
              <CCol md={6}>
                <CFormLabel>Metros Lineales Actual (m)</CFormLabel>
                <CFormInput
                  type="number"
                  step="0.01"
                  min="0"
                  name="metros_lineales_actual"
                  value={formData.metros_lineales_actual || formData.metros_lineales_inicial || ""}
                  onChange={handleChange}
                  invalid={!!errors.metros_lineales_actual}
                  feedbackInvalid={errors.metros_lineales_actual?.[0]}
                />
              </CCol>
            )}
            <CCol md={6}>
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
            <CCol md={bobina ? 12 : 6}>
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
