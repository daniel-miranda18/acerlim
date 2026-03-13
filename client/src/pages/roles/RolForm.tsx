import { useState, useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CRow,
  CCol,
  CAlert,
} from "@coreui/react";
import type { Rol, CrearRolDTO } from "../../types/rol.types";

interface RolFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CrearRolDTO) => Promise<void>;
  rol?: Rol | null;
  loading?: boolean;
}

const initialForm = { nombre: "", descripcion: "", estado: 1 };

export default function RolForm({
  visible,
  onClose,
  onSubmit,
  rol,
  loading,
}: RolFormProps) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!rol;

  useEffect(() => {
    if (rol) {
      setForm({
        nombre: rol.nombre,
        descripcion: rol.descripcion ?? "",
        estado: rol.estado,
      });
    } else {
      setForm(initialForm);
    }
    setError(null);
  }, [rol, visible]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "estado" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.nombre.trim()) return setError("El nombre es obligatorio");
    try {
      await onSubmit({
        nombre: form.nombre,
        descripcion: form.descripcion || undefined,
        estado: form.estado,
      });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    }
  };

  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle>{isEditing ? "Editar rol" : "Nuevo rol"}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}
        <CForm>
          <CRow className="g-3">
            <CCol xs={12}>
              <CFormLabel>Nombre *</CFormLabel>
              <CFormInput
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. Administrador"
              />
            </CCol>
            <CCol xs={12}>
              <CFormLabel>Descripción</CFormLabel>
              <CFormTextarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Descripción del rol..."
                rows={3}
              />
            </CCol>
            <CCol xs={12}>
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear rol"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
