import { useState, useEffect } from "react";
import type { Proveedor } from "../../types/proveedor.types";
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
  CFormTextarea,
  CRow,
  CCol,
  CSpinner,
} from "@coreui/react";

interface ProveedorFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Proveedor>) => Promise<void>;
  proveedor: Proveedor | null;
  loading: boolean;
  errors?: Record<string, string[]>;
}

export default function ProveedorForm({
  visible,
  onClose,
  onSubmit,
  proveedor,
  loading,
  errors = {},
}: ProveedorFormProps) {
  const [formData, setFormData] = useState<Partial<Proveedor>>(
    proveedor || {
      nombre: "",
      contacto: "",
      telefono: "",
      correo: "",
      direccion: "",
    }
  );

  useEffect(() => {
    if (proveedor) {
      setFormData(proveedor);
    } else {
      setFormData({
        nombre: "",
        contacto: "",
        telefono: "",
        correo: "",
        direccion: "",
      });
    }
  }, [proveedor, visible]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static" size="lg">
      <CModalHeader closeButton>
        <CModalTitle>
          {proveedor ? "Editar Proveedor" : "Registrar Proveedor"}
        </CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={12}>
              <CFormLabel>Nombre / Razón Social</CFormLabel>
              <CFormInput
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleChange}
                invalid={!!errors.nombre}
                feedbackInvalid={errors.nombre?.[0]}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Persona de Contacto</CFormLabel>
              <CFormInput
                name="contacto"
                value={formData.contacto || ""}
                onChange={handleChange}
                invalid={!!errors.contacto}
                feedbackInvalid={errors.contacto?.[0]}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Teléfono</CFormLabel>
              <CFormInput
                name="telefono"
                value={formData.telefono || ""}
                onChange={handleChange}
                invalid={!!errors.telefono}
                feedbackInvalid={errors.telefono?.[0]}
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Correo Electrónico</CFormLabel>
              <CFormInput
                type="email"
                name="correo"
                value={formData.correo || ""}
                onChange={handleChange}
                invalid={!!errors.correo}
                feedbackInvalid={errors.correo?.[0]}
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Dirección</CFormLabel>
              <CFormTextarea
                name="direccion"
                value={formData.direccion || ""}
                onChange={handleChange}
                rows={3}
                invalid={!!errors.direccion}
                feedbackInvalid={errors.direccion?.[0]}
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
