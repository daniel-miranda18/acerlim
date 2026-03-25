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
  CFormSelect,
  CRow,
  CCol,
  CAlert,
} from "@coreui/react";
import type {
  Usuario,
  CrearUsuarioDTO,
  ActualizarUsuarioDTO,
} from "../../types/usuario.types";
import type { Rol } from "../../types/rol.types";

interface UsuarioFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CrearUsuarioDTO | ActualizarUsuarioDTO) => Promise<void>;
  usuario?: Usuario | null;
  roles: Rol[];
  loading?: boolean;
  errors?: Record<string, string[]>;
}

const initialForm = {
  nombre: "",
  correo: "",
  clave: "",
  telefono: "",
  id_rol: 0,
  estado: 1,
};

export default function UsuarioForm({
  visible,
  onClose,
  onSubmit,
  usuario,
  roles,
  loading,
  errors = {},
}: UsuarioFormProps) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!usuario;

  useEffect(() => {
    if (usuario) {
      setForm({
        nombre: usuario.nombre,
        correo: usuario.correo,
        clave: "",
        telefono: usuario.telefono ?? "",
        id_rol: usuario.rol?.id_rol ?? 0,
        estado: usuario.estado,
      });
    } else {
      setForm(initialForm);
    }
    setError(null);
  }, [usuario, visible]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "id_rol" || name === "estado" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.nombre || !form.correo)
      return setError("Nombre y correo son obligatorios");
    if (!isEditing && !form.clave) return setError("La clave es obligatoria");

    try {
      if (isEditing) {
        const data: ActualizarUsuarioDTO = {
          nombre: form.nombre,
          correo: form.correo,
          telefono: form.telefono || undefined,
          id_rol: form.id_rol || undefined,
          estado: form.estado,
        };
        await onSubmit(data);
      } else {
        const data: CrearUsuarioDTO = {
          nombre: form.nombre,
          correo: form.correo,
          clave: form.clave,
          telefono: form.telefono || undefined,
          id_rol: form.id_rol || undefined,
          estado: form.estado,
        };
        await onSubmit(data);
      }
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error al guardar";
      setError(msg);
    }
  };

  return (
    <CModal visible={visible} onClose={onClose} alignment="center" size="lg">
      <CModalHeader>
        <CModalTitle>
          {isEditing ? "Editar usuario" : "Nuevo usuario"}
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
            <CCol md={6}>
              <CFormLabel>Nombre completo *</CFormLabel>
              <CFormInput
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                invalid={!!errors.nombre}
                feedbackInvalid={errors.nombre?.[0]}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Correo electrónico *</CFormLabel>
              <CFormInput
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="juanperez123@acerlim.com"
                invalid={!!errors.correo}
                feedbackInvalid={errors.correo?.[0]}
              />
            </CCol>

            {!isEditing && (
              <CCol md={6}>
                <CFormLabel>Clave *</CFormLabel>
                <CFormInput
                  type="password"
                  name="clave"
                  value={form.clave}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  invalid={!!errors.clave}
                  feedbackInvalid={errors.clave?.[0]}
                />
              </CCol>
            )}

            <CCol md={isEditing ? 6 : 6}>
              <CFormLabel>Teléfono</CFormLabel>
              <CFormInput
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ej. 77712345"
                invalid={!!errors.telefono}
                feedbackInvalid={errors.telefono?.[0]}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Rol</CFormLabel>
              <CFormSelect
                name="id_rol"
                value={form.id_rol}
                onChange={handleChange}
                invalid={!!errors.id_rol}
                feedbackInvalid={errors.id_rol?.[0]}
              >
                <option value={0}>Sin rol</option>
                {roles.map((r) => (
                  <option key={r.id_rol} value={r.id_rol}>
                    {r.nombre}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={6}>
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
              : "Crear usuario"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
