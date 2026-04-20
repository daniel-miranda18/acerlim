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
import { cilCheckCircle, cilList, cilTruck, cilInfo } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { usePedidos } from "../../hooks/usePedidos";
import { useDespachos } from "../../hooks/useDespachos";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function DespachoForm({ visible, onClose }: Props) {
  const { pedidos, loading: loadingPedidos } = usePedidos();
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

  const handleQuantityChange = (
    idDetalle: number,
    val: string,
    max: number,
  ) => {
    let num = parseFloat(val) || 0;
    if (num > max) num = max;
    if (num < 0) num = 0;
    setQuantities((prev) => ({ ...prev, [idDetalle]: num }));
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
                  className="shadow-sm border-primary border-opacity-25"
                  placeholder="Nombre de la persona que recibe"
                  value={receptor}
                  onChange={(e) => setReceptor(e.target.value)}
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
                  <CTableHead className="table-light">
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
                    {eligiblePedidos.map((p, idx) => (
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
                  <CTableHead className="table-dark">
                    <CTableRow>
                      <CTableHeaderCell>Producto</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Total
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Entregado
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Restante
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center bg-primary"
                        style={{ width: "180px" }}
                      >
                        A Entregar Ahora
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedPedidos.map((p, pIdx) => (
                      <>
                        <CTableRow className="bg-body-secondary">
                          <CTableDataCell
                            colSpan={5}
                            className="py-2 px-3 fw-bold small text-uppercase opacity-75"
                          >
                            Pedido #{p.id_pedido} — {p.nombre_cliente}
                          </CTableDataCell>
                        </CTableRow>
                        {p.detalles.map((det, dIdx) => {
                          const total = Number(det.cantidad);
                          const entregado = Number(det.cantidad_entregada || 0);
                          const restante = Math.max(0, total - entregado);
                          const isFilled =
                            (quantities[det.id_detalle] || 0) > 0;

                          if (restante <= 0) return null;

                          return (
                            <CTableRow
                              key={det.id_detalle}
                              className={
                                isFilled ? "table-success bg-opacity-10" : ""
                              }
                            >
                              <CTableDataCell className="ps-4">
                                <div className="fw-semibold">
                                  {det.producto?.descripcion}
                                </div>
                                <div className="small text-body-secondary">
                                  Calamina medida estándar
                                </div>
                              </CTableDataCell>
                              <CTableDataCell className="text-center text-body-secondary">
                                {total.toFixed(2)}
                              </CTableDataCell>
                              <CTableDataCell className="text-center text-body-secondary">
                                {entregado.toFixed(2)}
                              </CTableDataCell>
                              <CTableDataCell className="text-center fw-bold">
                                {restante.toFixed(2)}
                              </CTableDataCell>
                              <CTableDataCell className="bg-primary bg-opacity-10 p-2 text-center">
                                <CFormInput
                                  type="number"
                                  ref={
                                    pIdx === 0 && dIdx === 0
                                      ? firstInputRef
                                      : null
                                  }
                                  className={`text-center fw-bold border-2 ${isFilled ? "border-success" : "border-primary"}`}
                                  value={quantities[det.id_detalle] || ""}
                                  placeholder="0.00"
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      det.id_detalle,
                                      e.target.value,
                                      restante,
                                    )
                                  }
                                  onFocus={(e) => e.target.select()}
                                />
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
