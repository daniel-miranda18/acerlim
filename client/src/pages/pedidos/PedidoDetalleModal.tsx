import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from "@coreui/react";
import type { Pedido } from "../../types/pedido.types";

interface Props {
  visible: boolean;
  onClose: () => void;
  pedido: Pedido | null;
}

export default function PedidoDetalleModal({ visible, onClose, pedido }: Props) {
  if (!pedido) return null;

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
      <CModalHeader>
        <CModalTitle>Detalles del Pedido #{pedido.id_pedido}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-4">
          <h6 className="fw-bold text-secondary mb-3">Información General</h6>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="p-3 border rounded" style={{ background: "var(--cui-secondary-bg)" }}>
                <small className="text-secondary d-block">Cliente</small>
                <strong className="fs-6">{pedido.nombre_cliente}</strong>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-3 border rounded" style={{ background: "var(--cui-secondary-bg)" }}>
                <small className="text-secondary d-block">Fecha</small>
                <strong className="fs-6">{new Date(pedido.fecha).toLocaleDateString()}</strong>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-3 border rounded" style={{ background: "var(--cui-secondary-bg)" }}>
                <small className="text-secondary d-block">Estado</small>
                <strong className="fs-6 text-uppercase">{pedido.estado_pedido}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h6 className="fw-bold text-secondary mb-3">Productos Solicitados</h6>
          <div className="table-responsive border rounded">
            <table className="table table-striped table-hover mb-0">
              <thead style={{ background: "var(--cui-secondary-bg)" }}>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Precio Unit. (Bs)</th>
                  <th className="text-end">Subtotal (Bs)</th>
                </tr>
              </thead>
              <tbody>
                {pedido.detalles && pedido.detalles.length > 0 ? (
                  pedido.detalles.map((d) => (
                     <tr key={d.id_detalle}>
                      <td>{d.producto?.descripcion || `Producto ID: ${d.id_producto}`}</td>
                      <td className="text-center fw-bold">{d.cantidad}</td>
                      <td className="text-end">{Number(d.precio_unitario).toFixed(2)}</td>
                      <td className="text-end fw-bold">{Number(d.subtotal).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-3">
                      No hay productos registrados
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot style={{ background: "var(--cui-secondary-bg)" }}>
                <tr>
                  <td colSpan={3} className="text-end fw-bold align-middle">TOTAL:</td>
                  <td className="text-end fw-bold fs-5 text-primary">
                    {Number(pedido.total).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {pedido.observaciones && (
          <div>
            <h6 className="fw-bold text-secondary mb-2">Observaciones</h6>
            <div className="p-3 border rounded text-muted" style={{ background: "var(--cui-secondary-bg)" }}>
              {pedido.observaciones}
            </div>
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
