import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormSelect,
  CFormTextarea,
  CSpinner,
  CAlert,
  CBadge
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilIndustry } from "@coreui/icons";
import toast from "react-hot-toast";

import { usePedidos } from "../../hooks/usePedidos";
import { useBobinas } from "../../hooks/useBobinas";
import { produccionService } from "../../services/produccion.service";

import type { Pedido } from "../../types/pedido.types";
import type { StockBobina } from "../../types/bobina.types";

export default function ProduccionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { obtenerPedido } = usePedidos();
  const { bobinas, loading: loadingBobinas } = useBobinas();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedBobina, setSelectedBobina] = useState<string>("");
  const [observaciones, setObservaciones] = useState("");
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPedido = async () => {
      try {
        const ped = await obtenerPedido(Number(id));
        setPedido(ped);
      } catch (err: any) {
        setError(err.message || "Error al cargar pedido");
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [id, obtenerPedido]);

  if (loading || loadingBobinas) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <CAlert color="danger">
        {error || "No se encontró el pedido"}
      </CAlert>
    );
  }

  // Calculate total required meters
  const metrosRequeridos = pedido.detalles.reduce((acc, d) => acc + Number(d.cantidad), 0);

  // Filter bobinas that have enough stock
  const bobinasAptas = bobinas.filter(b => Number(b.metros_lineales_actual) >= metrosRequeridos);

  const bobinaElegida = bobinas.find(b => b.id_bobina.toString() === selectedBobina);

  const handleConfirmarProduccion = async () => {
    if (!selectedBobina) {
      toast.error("Selecciona una bobina para producir");
      return;
    }
    
    setProcesando(true);
    try {
      await produccionService.crear({
        id_pedido: pedido.id_pedido,
        id_bobina: Number(selectedBobina),
        metros_consumidos: metrosRequeridos,
        observaciones: observaciones.trim() || undefined,
      });

      toast.success("Producción confirmada. Metros descontados de la bobina.");
      navigate("/pedidos");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Error al confirmar producción");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="animate-in">
      <div className="d-flex align-items-center mb-4 gap-3">
        <CButton color="secondary" variant="outline" onClick={() => navigate(-1)}>
          <CIcon icon={cilArrowLeft} /> Volver
        </CButton>
        <div>
          <h4 className="mb-0 fw-bold">Confirmar Producción</h4>
          <small className="text-secondary">
            Pedido #{pedido.id_pedido} - Cliente: {pedido.nombre_cliente}
          </small>
        </div>
      </div>

      <div className="row g-4">
        {/* Resumen del pedido */}
        <div className="col-12 col-lg-5">
          <CCard>
            <CCardHeader className="fw-bold" style={{ backgroundColor: "var(--cui-secondary-bg)" }}>
              Resumen del Pedido
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <span className="text-secondary d-block small">Cliente</span>
                <span className="fw-medium">{pedido.nombre_cliente}</span>
              </div>
              <div className="mb-3">
                <span className="text-secondary d-block small">Fecha</span>
                <span className="fw-medium">{new Date(pedido.fecha).toLocaleDateString()}</span>
              </div>
              
              <hr />
              <h6 className="fw-bold mb-3">Productos</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-end">ML Requeridos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.detalles.map(d => (
                      <tr key={d.id_detalle}>
                        <td>{d.producto?.tipo_producto?.nombre || `Producto #${d.id_producto}`}</td>
                        <td className="text-end fw-bold">{Number(d.cantidad).toFixed(2)} m</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th className="text-end">Total a producir:</th>
                      <th className="text-end text-primary" style={{ fontSize: "1.1rem" }}>
                        {metrosRequeridos.toFixed(2)} m
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CCardBody>
          </CCard>
        </div>

        {/* Formulario de Producción */}
        <div className="col-12 col-lg-7">
          <CCard>
            <CCardHeader className="fw-bold d-flex align-items-center gap-2" style={{ backgroundColor: "var(--cui-secondary-bg)" }}>
              <CIcon icon={cilIndustry} className="text-primary" />
              Asignación de Materia Prima
            </CCardHeader>
            <CCardBody>
              <CAlert color="info" className="d-flex align-items-center gap-3 mb-4">
                <div style={{ fontSize: "1.5rem" }}>ℹ️</div>
                <div>
                  Al confirmar la producción se descontarán <strong>{metrosRequeridos.toFixed(2)} metros lineales</strong> de la bobina seleccionada.
                  Esta acción no se puede deshacer.
                </div>
              </CAlert>

              <div className="mb-4">
                <label className="form-label fw-bold">Seleccionar Bobina</label>
                <CFormSelect
                  value={selectedBobina}
                  onChange={(e) => setSelectedBobina(e.target.value)}
                  size="lg"
                >
                  <option value="">-- Elige una bobina --</option>
                  {bobinasAptas.map(b => (
                    <option key={b.id_bobina} value={b.id_bobina}>
                      Bobina #{b.id_bobina} - Lote {b.lote_rel.codigo_lote} | {b.metros_lineales_actual} m disponibles
                    </option>
                  ))}
                  {bobinasAptas.length === 0 && (
                    <option disabled>No hay bobinas con stock suficiente ({metrosRequeridos.toFixed(2)} m requeridos)</option>
                  )}
                </CFormSelect>

                {bobinaElegida && (
                  <div className="mt-3 p-3 rounded d-flex align-items-center gap-3" style={{ background: "var(--cui-secondary-bg)", border: "1px solid var(--cui-border-color)" }}>
                    <div style={{ flex: 1 }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary small">Color asignado</span>
                        <div className="d-flex align-items-center gap-2">
                          <CBadge color="primary" shape="rounded-pill">
                            {bobinaElegida.color_rel?.nombre || "Sin color asignado"}
                          </CBadge>
                          {bobinaElegida.color_rel && (
                            <div style={{
                              width: 16, height: 16,
                              backgroundColor: bobinaElegida.color_rel.codigo_hex,
                              borderRadius: "50%",
                              border: "1px solid rgba(0,0,0,0.2)"
                            }} />
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary small">Stock actual</span>
                        <span className="fw-bold">{Number(bobinaElegida.metros_lineales_actual).toFixed(2)} m</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary small">Consumo estimado</span>
                        <span className="fw-bold text-danger">-{metrosRequeridos.toFixed(2)} m</span>
                      </div>
                      <div className="d-flex justify-content-between border-top pt-2 mt-2">
                        <span className="fw-bold">Stock final estimado</span>
                        <span className="fw-bold text-success">
                          {(Number(bobinaElegida.metros_lineales_actual) - metrosRequeridos).toFixed(2)} m
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Observaciones de Producción</label>
                <CFormTextarea
                  rows={3}
                  placeholder="Anota cualquier detalle relevante para los operadores (opcional)..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>

              <div className="d-grid mt-4">
                <CButton
                  color="primary"
                  size="lg"
                  disabled={!selectedBobina || procesando}
                  onClick={handleConfirmarProduccion}
                >
                  {procesando ? (
                    <>
                      <CSpinner size="sm" className="me-2" /> Procesando...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilIndustry} className="me-2" />
                      Confirmar Producción y Descontar Stock
                    </>
                  )}
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  );
}
