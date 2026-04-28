import { useState, useMemo, useRef, useEffect } from "react";
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
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CBadge,
  CAlert,
} from "@coreui/react";
import { cilCheckCircle, cilTruck, cilInfo } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { usePedidos } from "../../hooks/usePedidos";
import { useDespachos } from "../../hooks/useDespachos";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DespachoForm({ visible, onClose, onSuccess }: Props) {
  const { pedidos, loading: loadingPedidos, fetchPedidos } = usePedidos();
  const { crearDespacho } = useDespachos();

  const [receptor, setReceptor] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [selectedPedidoIds, setSelectedPedidoIds] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [submitting, setSubmitting] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);

  const eligiblePedidos = useMemo(
    () =>
      pedidos.filter(
        (p) => (p.estado_pedido || "").toLowerCase() === "produccion",
      ),
    [pedidos],
  );

  const selectedPedidos = useMemo(
    () =>
      eligiblePedidos.filter((p) => selectedPedidoIds.includes(p.id_pedido)),
    [eligiblePedidos, selectedPedidoIds],
  );

  const totalItemsToDeliver = useMemo(() => {
    return Object.values(quantities).filter((v) => v > 0).length;
  }, [quantities]);

  // Auto-rellenar receptor desde los pedidos seleccionados
  useEffect(() => {
    if (selectedPedidos.length === 0) {
      setReceptor("");
      return;
    }
    const nombres = [...new Set(selectedPedidos.map((p) => p.nombre_cliente?.trim()).filter(Boolean))];
    setReceptor(nombres.join(" / "));
  }, [selectedPedidos]);

  // Refrescar pedidos cada vez que el modal se abre para tener datos actualizados
  useEffect(() => {
    if (visible) {
      fetchPedidos();
      setSelectedPedidoIds([]);
      setQuantities({});
    }
  }, [visible]);

  // Focus first quantity input when a pedido is selected
  useEffect(() => {
    if (selectedPedidoIds.length > 0 && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [selectedPedidoIds.length]);

  const handleTogglePedido = (id: number) => {
    setSelectedPedidoIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  // val = número de calaminas ingresadas; max = metros lineales restantes; medidaLargo = metros por calamina
  const handleQuantityChange = (
    idDetalle: number,
    val: string,
    maxMetros: number,
    medidaLargo: number,
  ) => {
    const calaminas = Math.max(0, Math.floor(Number(val) || 0));
    const maxCalaminas = medidaLargo > 0 ? Math.floor(maxMetros / medidaLargo) : 0;
    const calaminasClamped = Math.min(calaminas, maxCalaminas);
    // Guardamos en metros lineales para que el backend no cambie
    const metros = calaminasClamped * medidaLargo;
    setQuantities((prev) => ({ ...prev, [idDetalle]: metros }));
  };

  const handleSubmit = async () => {
    if (selectedPedidoIds.length === 0) {
      toast.error("Debe seleccionar al menos un pedido");
      return;
    }

    const detalles = [];
    for (const p of selectedPedidos) {
      for (const det of p.detalles) {
        const qty = quantities[det.id_detalle] || 0;
        if (qty > 0) {
          detalles.push({
            id_pedido: p.id_pedido,
            id_pedido_detalle: det.id_detalle,
            cantidad_entregada: qty,
          });
        }
      }
    }

    if (detalles.length === 0) {
      toast.error(
        "Debe ingresar la cantidad a entregar para al menos un producto",
      );
      return;
    }

    setSubmitting(true);
    try {
      await crearDespacho({
        receptor,
        observaciones,
        detalles,
      });
      toast.success("Despacho registrado correctamente");
      resetForm();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error al crear despacho:", error);
      toast.error(error.message || "Error al registrar despacho");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setReceptor("");
    setObservaciones("");
    setSelectedPedidoIds([]);
    setQuantities({});
  };

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="xl"
      scrollable
      backdrop="static"
    >
      <CModalHeader className="border-bottom-0 pb-0">
        <CModalTitle className="fw-bold d-flex align-items-center gap-2">
          <CIcon icon={cilTruck} size="lg" className="text-primary" />
          Registrar Nuevo Despacho
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="pt-0">
        <hr className="mb-4 opacity-10" />

        <CForm>
          <div className="mb-4">
            <h6 className="text-uppercase text-secondary fw-bold small mb-3 d-flex align-items-center gap-2">
              <span
                className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: 24, height: 24 }}
              >
                1
              </span>
              Información de Entrega
            </h6>
            <CRow className="g-3 bg-body-tertiary p-3 rounded border">
              <CCol md={6}>
                <CFormLabel className="fw-semibold">
                  Receptor / Entregado a:
                </CFormLabel>
                <CFormInput
                  size="lg"
                  readOnly
                  className="shadow-sm border-primary border-opacity-25 bg-body-tertiary"
                  placeholder="Se auto-completa al seleccionar un pedido"
                  value={receptor}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel className="fw-semibold">Observaciones:</CFormLabel>
                <CFormTextarea
                  className="shadow-sm"
                  rows={2}
                  placeholder="Notas adicionales sobre la entrega..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </CCol>
            </CRow>
          </div>

          <div className="mb-4">
            <h6 className="text-uppercase text-secondary fw-bold small mb-3 d-flex align-items-center gap-2">
              <span
                className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: 24, height: 24 }}
              >
                2
              </span>
              Seleccionar Pedidos
            </h6>
            <div className="rounded p-0 overflow-hidden border shadow-sm">
              {loadingPedidos ? (
                <div className="text-center py-4 text-secondary">
                  Cargando pedidos...
                </div>
              ) : eligiblePedidos.length === 0 ? (
                <div className="text-center py-5 text-secondary italic">
                  <CIcon icon={cilInfo} size="xl" className="mb-2 opacity-50" />
                  <p>No hay pedidos en estado "Producción" disponibles.</p>
                </div>
              ) : (
                <CTable hover responsive align="middle" className="mb-0">
                  <CTableHead className="bg-body-tertiary">
                    <CTableRow>
                      <CTableHeaderCell
                        style={{ width: "50px" }}
                      ></CTableHeaderCell>
                      <CTableHeaderCell>Pedido</CTableHeaderCell>
                      <CTableHeaderCell>Cliente</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Fecha
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Items
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {eligiblePedidos.map((p) => (
                      <CTableRow
                        key={p.id_pedido}
                        onClick={() => handleTogglePedido(p.id_pedido)}
                        style={{ cursor: "pointer" }}
                        className={
                          selectedPedidoIds.includes(p.id_pedido)
                            ? "table-active"
                            : ""
                        }
                      >
                        <CTableDataCell className="text-center">
                          <CFormCheck
                            readOnly
                            checked={selectedPedidoIds.includes(p.id_pedido)}
                            style={{ cursor: "pointer" }}
                          />
                        </CTableDataCell>
                        <CTableDataCell className="fw-bold text-primary">
                          #{p.id_pedido}
                        </CTableDataCell>
                        <CTableDataCell className="fw-semibold">
                          {p.nombre_cliente}
                        </CTableDataCell>
                        <CTableDataCell className="text-center text-body-secondary">
                          {new Date(p.fecha).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CBadge color="dark" shape="rounded-pill">
                            {p.detalles.length} prod.
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </div>
          </div>

          <div className="mb-3">
            <h6 className="text-uppercase text-secondary fw-bold small mb-3 d-flex align-items-center gap-2">
              <span
                className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: 24, height: 24 }}
              >
                3
              </span>
              Cantidades a Entregar
            </h6>

            {selectedPedidoIds.length === 0 ? (
              <CAlert
                color="info"
                className="d-flex align-items-center gap-3 border-start border-4"
              >
                <CIcon icon={cilInfo} size="xl" />
                <div>
                  <strong>Paso requerido:</strong> Selecciona uno o más pedidos
                  en la lista de arriba para empezar a cargar las cantidades de
                  entrega.
                </div>
              </CAlert>
            ) : (
              <div className="rounded shadow-sm border overflow-hidden">
                <CTable bordered responsive align="middle" className="mb-0">
                  <CTableHead>
                    <CTableRow style={{ background: "var(--cui-secondary-bg)" }}>
                      <CTableHeaderCell
                        className="fw-semibold"
                        style={{
                          color: "var(--cui-body-color)",
                          background: "var(--cui-secondary-bg)",
                          borderBottom: "2px solid var(--cui-border-color)",
                        }}
                      >
                        Producto
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center fw-semibold"
                        style={{
                          color: "var(--cui-body-color)",
                          background: "var(--cui-secondary-bg)",
                          borderBottom: "2px solid var(--cui-border-color)",
                        }}
                      >
                        Total
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center fw-semibold"
                        style={{
                          color: "var(--cui-body-color)",
                          background: "var(--cui-secondary-bg)",
                          borderBottom: "2px solid var(--cui-border-color)",
                        }}
                      >
                        Entregado
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center fw-semibold"
                        style={{
                          color: "var(--cui-body-color)",
                          background: "var(--cui-secondary-bg)",
                          borderBottom: "2px solid var(--cui-border-color)",
                        }}
                      >
                        Restante
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center fw-semibold"
                        style={{
                          width: "200px",
                          background: "var(--cui-primary)",
                          color: "#fff",
                          borderBottom: "2px solid var(--cui-border-color)",
                        }}
                      >
                        Calaminas a Entregar
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedPedidos.map((p, pIdx) => (
                      <>
                        <CTableRow>
                          <CTableDataCell
                            colSpan={5}
                            className="py-2 px-3 fw-bold small text-uppercase"
                            style={{
                              background: "var(--cui-tertiary-bg)",
                              color: "var(--cui-secondary-color)",
                            }}
                          >
                            Pedido #{p.id_pedido} — {p.nombre_cliente}
                          </CTableDataCell>
                        </CTableRow>
                        {p.detalles.map((det, dIdx) => {
                          const medidaLargo = Number(det.producto?.medida_largo || 0);
                          const totalMetros = Number(det.cantidad);
                          const entregadoMetros = Number(det.cantidad_entregada || 0);
                          const restanteMetros = Math.max(0, totalMetros - entregadoMetros);

                          // Convertir metros → calaminas
                          const totalCal = medidaLargo > 0 ? Math.floor(totalMetros / medidaLargo) : 0;
                          const entregadoCal = medidaLargo > 0 ? Math.floor(entregadoMetros / medidaLargo) : 0;
                          const restanteCal = medidaLargo > 0 ? Math.floor(restanteMetros / medidaLargo) : 0;

                          // Calaminas que el usuario ha indicado en este despacho
                          const metrosIngresados = quantities[det.id_detalle] || 0;
                          const calaminaIngresadas = medidaLargo > 0 ? Math.round(metrosIngresados / medidaLargo) : 0;

                          // Restante descontando lo que se está despachando ahora (en tiempo real)
                          const restanteMetrosFinal = Math.max(0, restanteMetros - metrosIngresados);
                          const restanteCalFinal = medidaLargo > 0 ? Math.floor(restanteMetrosFinal / medidaLargo) : 0;

                          const isFilled = metrosIngresados > 0;

                          if (restanteCal <= 0) return null;

                          return (
                            <CTableRow
                              key={det.id_detalle}
                              style={{
                                background: isFilled
                                  ? "rgba(var(--cui-success-rgb), 0.08)"
                                  : "var(--cui-body-bg)",
                              }}
                            >
                              <CTableDataCell
                                className="ps-4"
                                style={{ color: "var(--cui-body-color)" }}
                              >
                                <div className="fw-semibold">
                                  {det.producto?.descripcion}
                                </div>
                                <div className="small" style={{ color: "var(--cui-secondary-color)" }}>
                                  {medidaLargo > 0
                                    ? `${medidaLargo} m por calamina`
                                    : "Longitud no definida"}
                                </div>
                              </CTableDataCell>
                              <CTableDataCell
                                className="text-center"
                                style={{ color: "var(--cui-secondary-color)" }}
                              >
                                <div className="fw-semibold">{totalCal} cal.</div>
                                <div className="small">{totalMetros.toFixed(2)} m</div>
                              </CTableDataCell>
                              <CTableDataCell
                                className="text-center"
                                style={{ color: "var(--cui-secondary-color)" }}
                              >
                                <div className="fw-semibold">{entregadoCal} cal.</div>
                                <div className="small">{entregadoMetros.toFixed(2)} m</div>
                              </CTableDataCell>
                              <CTableDataCell className="text-center fw-bold">
                                <div style={{ color: isFilled ? "var(--cui-warning)" : "var(--cui-body-color)" }}>
                                  {restanteCalFinal} cal.
                                </div>
                                <div
                                  className="small"
                                  style={{ color: isFilled ? "var(--cui-warning)" : "var(--cui-secondary-color)" }}
                                >
                                  {restanteMetrosFinal.toFixed(2)} m
                                </div>
                              </CTableDataCell>
                              <CTableDataCell
                                className="p-2 text-center"
                                style={{ background: "rgba(var(--cui-primary-rgb), 0.12)" }}
                              >
                                <CFormInput
                                  type="number"
                                  min={0}
                                  max={restanteCal}
                                  step={1}
                                  ref={
                                    pIdx === 0 && dIdx === 0
                                      ? firstInputRef
                                      : null
                                  }
                                  className={`text-center fw-bold border-2 ${isFilled ? "border-success" : "border-primary"}`}
                                  value={calaminaIngresadas || ""}
                                  placeholder="0"
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      det.id_detalle,
                                      e.target.value,
                                      restanteMetros,
                                      medidaLargo,
                                    )
                                  }
                                  onFocus={(e) => e.target.select()}
                                />
                                {isFilled && (
                                  <div className="small mt-1 fw-semibold text-success">
                                    = {metrosIngresados.toFixed(2)} m
                                  </div>
                                )}
                              </CTableDataCell>
                            </CTableRow>
                          );
                        })}
                      </>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            )}
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter className="border-top-0 pt-0">
        <div className="me-auto">
          {totalItemsToDeliver > 0 && (
            <CBadge
              color="success"
              className="p-2 d-flex align-items-center gap-2"
            >
              <CIcon icon={cilCheckCircle} />
              {totalItemsToDeliver} producto(s) listos para entrega
            </CBadge>
          )}
        </div>
        <CButton
          color="secondary"
          variant="ghost"
          onClick={onClose}
          disabled={submitting}
        >
          Cancelar
        </CButton>
        <CButton
          color="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={
            submitting ||
            selectedPedidoIds.length === 0 ||
            totalItemsToDeliver === 0
          }
          className="px-5 shadow"
        >
          {submitting ? "Procesando..." : "Finalizar y Entregar"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
