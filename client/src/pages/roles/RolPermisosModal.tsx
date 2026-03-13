import { useState, useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormCheck,
  CSpinner,
  CBadge,
  CAlert,
} from "@coreui/react";
import toast from "react-hot-toast";
import { rolService } from "../../services/rol.service";
import { usePermisos } from "../../hooks/usePermisos";
import type { Rol } from "../../types/rol.types";

interface RolPermisosModalProps {
  visible: boolean;
  onClose: () => void;
  rol: Rol | null;
}

export default function RolPermisosModal({
  visible,
  onClose,
  rol,
}: RolPermisosModalProps) {
  const { permisos: todosPermisos } = usePermisos();
  const permisos = todosPermisos.filter((p) => p.estado === 1);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPermisos, setLoadingPermisos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && rol) {
      setLoadingPermisos(true);
      setError(null);
      rolService
        .listarPermisos(rol.id_rol)
        .then((res) => {
          const ids = res.data.data.permisos.map(
            (p: { id_permiso: number }) => p.id_permiso,
          );
          setSeleccionados(ids);
        })
        .catch(() => setError("Error al cargar permisos del rol"))
        .finally(() => setLoadingPermisos(false));
    }
  }, [visible, rol]);

  const togglePermiso = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const toggleTodos = () => {
    if (seleccionados.length === permisos.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(permisos.map((p) => p.id_permiso));
    }
  };

  const handleGuardar = async () => {
    if (!rol) return;
    setLoading(true);
    try {
      await rolService.sincronizarPermisos(rol.id_rol, seleccionados);
      toast.success("Permisos actualizados correctamente");
      onClose();
    } catch {
      toast.error("Error al actualizar permisos");
    } finally {
      setLoading(false);
    }
  };

  const todosSeleccionados =
    permisos.length > 0 && seleccionados.length === permisos.length;

  return (
    <CModal visible={visible} onClose={onClose} alignment="center" size="lg">
      <CModalHeader>
        <div>
          <CModalTitle>Gestionar permisos</CModalTitle>
          {rol && (
            <small
              style={{ color: "var(--cui-secondary-color)", fontSize: 12 }}
            >
              Rol: <strong>{rol.nombre}</strong>
            </small>
          )}
        </div>
      </CModalHeader>

      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}

        {loadingPermisos ? (
          <div className="d-flex justify-content-center py-4">
            <CSpinner color="primary" />
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-secondary" style={{ fontSize: 13 }}>
                {seleccionados.length} de {permisos.length} permisos
                seleccionados
              </span>
              <CButton
                color="secondary"
                variant="outline"
                size="sm"
                onClick={toggleTodos}
              >
                {todosSeleccionados
                  ? "Deseleccionar todos"
                  : "Seleccionar todos"}
              </CButton>
            </div>

            {permisos.length === 0 ? (
              <p className="text-secondary text-center py-3">
                No hay permisos disponibles. Crea permisos primero.
              </p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {permisos.map((permiso) => (
                  <div
                    key={permiso.id_permiso}
                    onClick={() => togglePermiso(permiso.id_permiso)}
                    className="d-flex align-items-center justify-content-between p-3 rounded"
                    style={{
                      cursor: "pointer",
                      border: `1px solid ${seleccionados.includes(permiso.id_permiso) ? "var(--cui-primary)" : "var(--cui-border-color)"}`,
                      background: seleccionados.includes(permiso.id_permiso)
                        ? "rgba(var(--cui-primary-rgb), 0.06)"
                        : "transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <CFormCheck
                        checked={seleccionados.includes(permiso.id_permiso)}
                        onChange={() => togglePermiso(permiso.id_permiso)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>
                          {permiso.nombre}
                        </div>
                        {permiso.descripcion && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--cui-secondary-color)",
                            }}
                          >
                            {permiso.descripcion}
                          </div>
                        )}
                      </div>
                    </div>
                    {seleccionados.includes(permiso.id_permiso) && (
                      <CBadge color="primary" style={{ fontSize: 10 }}>
                        Asignado
                      </CBadge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
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
        <CButton
          color="primary"
          onClick={handleGuardar}
          disabled={loading || loadingPermisos}
        >
          {loading
            ? "Guardando..."
            : `Guardar (${seleccionados.length} permisos)`}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
