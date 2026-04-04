import { useState, useEffect } from "react";
import type { Producto } from "../../types/producto.types";
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
  CFormSelect,
} from "@coreui/react";
import type { TipoProducto } from "../../types/producto.types";

interface ProductoFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Producto>) => Promise<void>;
  producto: Producto | null;
  tipos: TipoProducto[];
  loading: boolean;
  errors?: Record<string, string[]>;
}

export default function ProductoForm({
  visible,
  onClose,
  onSubmit,
  producto,
  tipos,
  loading,
  errors = {},
}: ProductoFormProps) {
  const [formData, setFormData] = useState<Partial<Producto>>(
    producto || {
      id_tipo_producto: undefined,
      descripcion: "",
      medida_largo: 0,
      medida_ancho: 0,
    }
  );

  useEffect(() => {
    if (producto) {
      setFormData({
        ...producto,
        medida_largo: Number(producto.medida_largo) || 0,
        medida_ancho: Number(producto.medida_ancho) || 0,
      });
    } else {
      setFormData({
        id_tipo_producto: undefined,
        descripcion: "",
        medida_largo: 0,
        medida_ancho: 0,
      });
    }
  }, [producto, visible]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" || name === "id_tipo_producto" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };
    delete (submitData as any).nombre;
    if (producto) {
      delete (submitData as any).id_tipo_calamina;
      delete (submitData as any).fecha_creacion;
      delete (submitData as any).fecha_actualizacion;
      delete (submitData as any).estado;
    }
    onSubmit(submitData);
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>{producto ? "Editar Tipo" : "Registrar Tipo"}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={12}>
              <CFormLabel>Tipo de Calamina</CFormLabel>
              <CFormSelect
                name="id_tipo_producto"
                value={formData.id_tipo_producto || ""}
                onChange={handleChange}
                invalid={!!errors.id_tipo_producto}
                required
              >
                <option value="">Seleccione un tipo...</option>
                {tipos.map((t) => (
                  <option key={t.id_tipo_producto} value={t.id_tipo_producto}>
                    {t.nombre}
                  </option>
                ))}
              </CFormSelect>
              {errors.id_tipo_producto && (
                <div className="invalid-feedback d-block">{errors.id_tipo_producto[0]}</div>
              )}
            </CCol>
            <CCol md={12}>
              <CFormLabel>Descripción</CFormLabel>
              <CFormInput
                name="descripcion"
                value={formData.descripcion || ""}
                onChange={handleChange}
                invalid={!!errors.descripcion}
                feedbackInvalid={errors.descripcion?.[0]}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Largo (m)</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                min="0"
                name="medida_largo"
                value={formData.medida_largo || ""}
                onChange={handleChange}
                invalid={!!errors.medida_largo}
                feedbackInvalid={errors.medida_largo?.[0]}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Ancho (m)</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                min="0"
                name="medida_ancho"
                value={formData.medida_ancho || ""}
                onChange={handleChange}
                invalid={!!errors.medida_ancho}
                feedbackInvalid={errors.medida_ancho?.[0]}
                required
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
