import { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from "@coreui/react";
import { cilPencil, cilTrash, cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { useColores } from "../../hooks/useColores";
import type { Color } from "../../types/color.types";
import ConfirmModal from "../../components/shared/ConfirmModal";

export default function ColoresPage() {
  const { colores, loading, crearColor, actualizarColor, eliminarColor } = useColores();

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Color | null>(null);
  const [nombre, setNombre] = useState("");
  const [codigoHex, setCodigoHex] = useState("#FF0000");
  const [saving, setSaving] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingColor, setDeletingColor] = useState<Color | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleNuevo = () => {
    setEditando(null);
    setNombre("");
    setCodigoHex("#FF0000");
    setModalVisible(true);
  };

  const handleEditar = (c: Color) => {
    setEditando(c);
    setNombre(c.nombre);
    setCodigoHex(c.codigo_hex);
    setModalVisible(true);
  };

  const handleEliminar = (c: Color) => {
    setDeletingColor(c);
    setConfirmVisible(true);
  };

  const handleConfirmEliminar = async () => {
    if (!deletingColor) return;
    setDeleteLoading(true);
    try {
      await eliminarColor(deletingColor.id_color);
      toast.success("Color eliminado correctamente");
      setConfirmVisible(false);
    } catch {
      toast.error("Error al eliminar el color");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      toast.error("Ingresa un nombre para el color");
      return;
    }
    if (!codigoHex || !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(codigoHex)) {
      toast.error("Selecciona un color válido");
      return;
    }

    setSaving(true);
    try {
      if (editando) {
        await actualizarColor(editando.id_color, {
          nombre: nombre.trim(),
          codigo_hex: codigoHex,
        });
        toast.success("Color actualizado correctamente");
      } else {
        await crearColor({
          nombre: nombre.trim(),
          codigo_hex: codigoHex,
        });
        toast.success("Color creado correctamente");
      }
      setModalVisible(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al guardar el color");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Returns white or black depending on the brightness of the background,
   * so that text is always readable on top of the color swatch.
   */
  const contrastText = (hex: string) => {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold">Colores de Producto</h4>
          <small className="text-secondary">
            Administra los colores disponibles para las calaminas
          </small>
        </div>
        <CButton
          color="primary"
          className="d-flex align-items-center gap-2"
          onClick={handleNuevo}
        >
          <CIcon icon={cilPlus} />
          Nuevo Color
        </CButton>
      </div>

      <CCard>
        <CCardHeader className="py-3">
          <h5 className="mb-0 fw-bold">Listado de Colores</h5>
        </CCardHeader>
        <CCardBody className="p-0">
          {loading && colores.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : colores.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <div style={{ fontSize: "2.5rem", opacity: 0.3 }}>🎨</div>
              <p className="mt-2">No hay colores registrados. Crea uno para comenzar.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{ padding: "12px 16px" }}>ID</th>
                    <th style={{ padding: "12px 16px" }}>Color</th>
                    <th style={{ padding: "12px 16px" }}>Nombre</th>
                    <th style={{ padding: "12px 16px" }}>Código HEX</th>
                    <th style={{ padding: "12px 16px" }}>Fecha creación</th>
                    <th style={{ padding: "12px 16px" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {colores.map((c) => (
                    <tr key={c.id_color}>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <span className="fw-bold text-secondary">#{c.id_color}</span>
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            backgroundColor: c.codigo_hex,
                            border: "2px solid rgba(0,0,0,.12)",
                            boxShadow: `0 2px 8px ${c.codigo_hex}44`,
                            transition: "transform .15s ease",
                            cursor: "default",
                          }}
                          title={c.codigo_hex}
                        />
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <span className="fw-semibold">{c.nombre}</span>
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "3px 10px",
                            borderRadius: 6,
                            backgroundColor: c.codigo_hex,
                            color: contrastText(c.codigo_hex),
                            fontWeight: 600,
                            fontSize: ".82rem",
                            fontFamily: "monospace",
                            letterSpacing: ".5px",
                          }}
                        >
                          {c.codigo_hex.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        {c.fecha_creacion
                          ? new Date(c.fecha_creacion).toLocaleDateString()
                          : "—"}
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <div className="d-flex gap-2">
                          <CButton
                            color="warning"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditar(c)}
                            title="Editar"
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            color="danger"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEliminar(c)}
                            title="Eliminar"
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Modal para crear/editar color */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static">
        <CModalHeader>
          <CModalTitle>{editando ? "Editar Color" : "Nuevo Color"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre del color</label>
            <CFormInput
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Rojo Teja, Azul Colonial"
              id="input-color-nombre"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Seleccionar color</label>
            <div className="d-flex align-items-center gap-3">
              <input
                type="color"
                value={codigoHex}
                onChange={(e) => setCodigoHex(e.target.value)}
                id="input-color-picker"
                style={{
                  width: 56,
                  height: 56,
                  border: "2px solid rgba(0,0,0,.15)",
                  borderRadius: 12,
                  padding: 2,
                  cursor: "pointer",
                  background: "transparent",
                }}
              />
              <div style={{ flex: 1 }}>
                <CFormInput
                  value={codigoHex}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (!val.startsWith("#")) val = "#" + val;
                    setCodigoHex(val);
                  }}
                  placeholder="#FF0000"
                  id="input-color-hex"
                  maxLength={7}
                  style={{ fontFamily: "monospace", fontWeight: 600, letterSpacing: "1px" }}
                />
                <small className="text-secondary mt-1 d-block">
                  Código hexadecimal del color (ej: #A52A2A)
                </small>
              </div>
            </div>
          </div>

          {/* Vista previa del color */}
          {codigoHex && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(codigoHex) && (
            <div
              className="p-3 rounded d-flex align-items-center gap-3"
              style={{
                background: `linear-gradient(135deg, ${codigoHex}22, ${codigoHex}33)`,
                border: `2px solid ${codigoHex}55`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: codigoHex,
                  boxShadow: `0 4px 14px ${codigoHex}55`,
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: ".95rem" }}>
                  Vista previa
                </div>
                <div style={{ fontSize: ".8rem", color: "var(--cui-secondary-color)" }}>
                  {nombre.trim() || "Sin nombre"} —{" "}
                  <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                    {codigoHex.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setModalVisible(false)}>
            Cancelar
          </CButton>
          <CButton
            color="primary"
            onClick={handleGuardar}
            disabled={saving || !nombre.trim() || !codigoHex}
          >
            {saving ? <CSpinner size="sm" /> : editando ? "Actualizar" : "Crear"}
          </CButton>
        </CModalFooter>
      </CModal>

      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar Color"
        message={`¿Estás seguro que deseas eliminar el color "${deletingColor?.nombre}"?`}
        onConfirm={handleConfirmEliminar}
        onCancel={() => setConfirmVisible(false)}
        loading={deleteLoading}
        confirmText={deleteLoading ? "Eliminando..." : "Eliminar"}
      />
    </>
  );
}
