import { useState, useMemo } from "react";
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
  CBadge,
} from "@coreui/react";
import { cilPencil, cilTrash, cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { usePrecios } from "../../hooks/usePrecios";
import type { PrecioMetro } from "../../types/precio.types";
import ConfirmModal from "../../components/shared/ConfirmModal";

export default function PreciosPage() {
  const { precios, loading, crearPrecio, actualizarPrecio, eliminarPrecio } = usePrecios();

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<PrecioMetro | null>(null);
  const [nombre, setNombre] = useState("");
  const [precioPorMetro, setPrecioPorMetro] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingPrecio, setDeletingPrecio] = useState<PrecioMetro | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleNuevo = () => {
    setEditando(null);
    setNombre("");
    setPrecioPorMetro(0);
    setModalVisible(true);
  };

  const handleEditar = (p: PrecioMetro) => {
    setEditando(p);
    setNombre(p.nombre);
    setPrecioPorMetro(p.precio_por_metro);
    setModalVisible(true);
  };

  const handleEliminar = (p: PrecioMetro) => {
    setDeletingPrecio(p);
    setConfirmVisible(true);
  };

  const handleConfirmEliminar = async () => {
    if (!deletingPrecio) return;
    setDeleteLoading(true);
    try {
      await eliminarPrecio(deletingPrecio.id_precio);
      toast.success("Precio eliminado correctamente");
      setConfirmVisible(false);
    } catch {
      toast.error("Error al eliminar el precio");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      toast.error("Ingresa un nombre para el precio");
      return;
    }
    if (precioPorMetro <= 0) {
      toast.error("Ingresa un precio válido mayor a 0");
      return;
    }

    setSaving(true);
    try {
      if (editando) {
        await actualizarPrecio(editando.id_precio, {
          nombre: nombre.trim(),
          precio_por_metro: precioPorMetro,
        });
        toast.success("Precio actualizado correctamente");
      } else {
        await crearPrecio({
          nombre: nombre.trim(),
          precio_por_metro: precioPorMetro,
        });
        toast.success("Precio creado correctamente");
      }
      setModalVisible(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al guardar el precio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold">Precios por Metro Lineal</h4>
          <small className="text-secondary">
            Configura los precios que se usarán en las cotizaciones
          </small>
        </div>
        <CButton
          color="primary"
          className="d-flex align-items-center gap-2"
          onClick={handleNuevo}
        >
          <CIcon icon={cilPlus} />
          Nuevo Precio
        </CButton>
      </div>

      <CCard>
        <CCardHeader className="py-3">
          <h5 className="mb-0 fw-bold">Listado de Precios</h5>
        </CCardHeader>
        <CCardBody className="p-0">
          {loading && precios.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : precios.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <div style={{ fontSize: "2.5rem", opacity: 0.3 }}>💰</div>
              <p className="mt-2">No hay precios configurados. Crea uno para comenzar.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{ padding: "12px 16px" }}>ID</th>
                    <th style={{ padding: "12px 16px" }}>Nombre</th>
                    <th style={{ padding: "12px 16px" }}>Precio / ml</th>
                    <th style={{ padding: "12px 16px" }}>Moneda</th>
                    <th style={{ padding: "12px 16px" }}>Fecha creación</th>
                    <th style={{ padding: "12px 16px" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {precios.map((p) => (
                    <tr key={p.id_precio}>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <span className="fw-bold text-secondary">#{p.id_precio}</span>
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <span className="fw-semibold">{p.nombre}</span>
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <span className="fw-bold text-success" style={{ fontSize: "1.05rem" }}>
                          Bs. {Number(p.precio_por_metro).toFixed(2)}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <CBadge color="info">{p.moneda}</CBadge>
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        {p.fecha_creacion ? new Date(p.fecha_creacion).toLocaleDateString() : "—"}
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <div className="d-flex gap-2">
                          <CButton
                            color="warning"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditar(p)}
                            title="Editar"
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            color="danger"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEliminar(p)}
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

      {/* Modal para crear/editar */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static">
        <CModalHeader>
          <CModalTitle>{editando ? "Editar Precio" : "Nuevo Precio"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre</label>
            <CFormInput
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Metro lineal estándar"
              id="input-precio-nombre"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Precio por metro lineal (Bs.)</label>
            <CFormInput
              type="number"
              min={0}
              step={0.01}
              value={precioPorMetro || ""}
              onChange={(e) => setPrecioPorMetro(parseFloat(e.target.value) || 0)}
              placeholder="60.00"
              id="input-precio-valor"
            />
          </div>
          {precioPorMetro > 0 && (
            <div className="p-3 rounded" style={{
              background: "linear-gradient(135deg, rgba(5,150,105,.08), rgba(16,185,129,.08))",
              border: "1px solid rgba(5,150,105,.2)"
            }}>
              <div style={{ fontSize: ".78rem", color: "#059669", fontWeight: 600 }}>
                Ejemplo: 10 metros lineales × Bs. {precioPorMetro.toFixed(2)} = Bs. {(10 * precioPorMetro).toFixed(2)}
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
            disabled={saving || !nombre.trim() || precioPorMetro <= 0}
          >
            {saving ? <CSpinner size="sm" /> : editando ? "Actualizar" : "Crear"}
          </CButton>
        </CModalFooter>
      </CModal>

      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar Precio"
        message={`¿Estás seguro que deseas eliminar el precio "${deletingPrecio?.nombre}"?`}
        onConfirm={handleConfirmEliminar}
        onCancel={() => setConfirmVisible(false)}
        loading={deleteLoading}
        confirmText={deleteLoading ? "Eliminando..." : "Eliminar"}
      />
    </>
  );
}
