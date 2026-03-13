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
import type { Permiso, CrearPermisoDTO } from "../../types/permiso.types";

interface PermisoFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CrearPermisoDTO) => Promise<void>;
  permiso?: Permiso | null;
  loading?: boolean;
}

const initialForm = { nombre: "", descripcion: "", estado: 1 };

export default function PermisoForm({
  visible,
  onClose,
  onSubmit,
  permiso,
  loading,
}: PermisoFormProps) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!permiso;

  useEffect(() => {
    if (permiso) {
      setForm({
        nombre: permiso.nombre,
        descripcion: permiso.descripcion ?? "",
        estado: permiso.estado,
      });
    } else {
      setForm(initialForm);
    }
    setError(null);
  }, [permiso, visible]);

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
        <CModalTitle>
          {isEditing ? "Editar permiso" : "Nuevo permiso"}
        </CModalTitle>
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
                placeholder="Ej. usuarios.crear"
              />
            </CCol>
            <CCol xs={12}>
              <CFormLabel>Descripción</CFormLabel>
              <CFormTextarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Descripción del permiso..."
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
              : "Crear permiso"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
