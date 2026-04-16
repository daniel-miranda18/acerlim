import { useState } from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from "@coreui/react";
import type { Pedido } from "../../types/pedido.types";

interface Props {
  visible: boolean;
  onClose: () => void;
  pedido: Pedido | null;
}

export default function PedidoDetalleModal({ visible, onClose, pedido }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!pedido) return null;

  const getImageUrl = (path: string) => {
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3001";
    return `${baseUrl}${path}`;
  };

  return (
    <>
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
                  <th>Tipo de Calamina</th>
                  <th className="text-center">Calaminas</th>
                  <th className="text-center">Metros Lineales</th>
                  <th className="text-end">Precio / ml (Bs)</th>
                  <th className="text-end">Subtotal (Bs)</th>
                </tr>
              </thead>
              <tbody>
                {pedido.detalles && pedido.detalles.length > 0 ? (
                  pedido.detalles.map((d) => {
                    // Calcular cantidad de calaminas desde datos_json del dibujo
                    let cantidadCalaminas: number | null = null;
                    try {
                      if (pedido.dibujo?.datos_json) {
                        const conf = JSON.parse(pedido.dibujo.datos_json);
                        const techoCalaminas = (conf.filas ?? 0) * (conf.columnas ?? 0);
                        const colasCalaminas = conf.cola_pato?.activa ? (conf.cola_pato.total_colas ?? 0) : 0;
                        cantidadCalaminas = techoCalaminas + colasCalaminas;
                      }
                    } catch {}

                    return (
                      <tr key={d.id_detalle}>
                        <td>
                          <div className="fw-bold text-primary">
                            {d.producto?.tipo_producto?.nombre || "Calamina"}
                          </div>
                          {d.producto?.descripcion && d.producto.descripcion !== d.producto?.tipo_producto?.nombre && (
                            <div className="small text-secondary">{d.producto.descripcion}</div>
                          )}
                        </td>
                        <td className="text-center fw-bold">
                          {cantidadCalaminas !== null ? (
                            <span>{cantidadCalaminas} pzas</span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="text-center fw-bold">{Number(d.cantidad).toFixed(2)} ml</td>
                        <td className="text-end">{Number(d.precio_unitario).toFixed(2)}</td>
                        <td className="text-end fw-bold">{Number(d.subtotal).toFixed(2)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-3">
                      No hay productos registrados
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot style={{ background: "var(--cui-secondary-bg)" }}>
                <tr>
                  <td colSpan={4} className="text-end fw-bold align-middle">TOTAL:</td>
                  <td className="text-end fw-bold fs-5 text-primary">
                    {Number(pedido.total).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {pedido.observaciones && (
          <div className="mb-4">
            <h6 className="fw-bold text-secondary mb-2">Observaciones</h6>
            <div className="p-3 border rounded text-muted" style={{ background: "var(--cui-secondary-bg)" }}>
              {pedido.observaciones}
            </div>
          </div>
        )}

        {pedido.dibujo && (
          <div className="mb-4">
            <h6 className="fw-bold text-secondary mb-3">Detalles de Diseño y Calaminas</h6>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded h-100" style={{ background: "var(--cui-secondary-bg)" }}>
                  <h5 className="d-block mb-3 fw-bold" style={{ fontSize: "0.95rem" }}>Especificaciones</h5>
                  <table className="table table-sm table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="text-secondary ps-0" style={{ width: "130px" }}>Largo de base:</td>
                        <td className="fw-medium">{Number(pedido.dibujo.largo).toFixed(2)} m</td>
                      </tr>
                      <tr>
                        <td className="text-secondary ps-0">Ancho de base:</td>
                        <td className="fw-medium">{Number(pedido.dibujo.ancho).toFixed(2)} m</td>
                      </tr>
                      {pedido.dibujo.area_plana && (
                        <tr>
                          <td className="text-secondary ps-0">Área plana:</td>
                          <td className="fw-medium">{Number(pedido.dibujo.area_plana).toFixed(2)} m²</td>
                        </tr>
                      )}
                      {(() => {
                        try {
                          const conf = pedido.dibujo.datos_json ? JSON.parse(pedido.dibujo.datos_json) : null;
                          if (conf) {
                            return (
                              <>
                                <tr>
                                  <td className="text-secondary ps-0">Distribución:</td>
                                  <td className="fw-medium">{conf.filas} filas × {conf.columnas} columnas</td>
                                </tr>
                                <tr>
                                  <td className="text-secondary ps-0">Traslape:</td>
                                  <td className="fw-medium">{conf.traslape_cm} cm</td>
                                </tr>
                                {conf.cola_pato?.activa && (
                                  <tr>
                                    <td className="text-secondary ps-0 text-warning">Colas de pato:</td>
                                    <td className="fw-medium">{conf.cola_pato.cantidad} ({conf.cola_pato.total_colas} calaminas extras)</td>
                                  </tr>
                                )}
                              </>
                            );
                          }
                        } catch (e) {
                        }
                        return null;
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded h-100 d-flex flex-column" style={{ background: "var(--cui-secondary-bg)" }}>
                  <h5 className="d-block mb-3 fw-bold" style={{ fontSize: "0.95rem" }}>Plano Generado</h5>
                  <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                    {pedido.dibujo.imagen_generada ? (
                      <>
                        <div 
                          className="position-relative w-100 d-flex justify-content-center border rounded shadow-sm overflow-hidden"
                          style={{ cursor: "pointer", background: "var(--cui-body-bg)" }}
                          onClick={() => setSelectedImage(getImageUrl(pedido.dibujo.imagen_generada!))}
                        >
                          <img 
                            src={getImageUrl(pedido.dibujo.imagen_generada)} 
                            alt="Plano del techo" 
                            className="img-fluid" 
                            style={{ maxHeight: "200px", objectFit: "contain", width: "100%", transition: "all 0.2s" }}
                          />
                          <div 
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{ background: "rgba(0,0,0,0.3)", opacity: 0, transition: "opacity 0.2s" }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}
                          >
                            <span className="badge bg-primary px-3 py-2 fs-6">Ampliar Imagen</span>
                          </div>
                        </div>
                        <CButton
                          color="primary"
                          variant="outline"
                          size="sm"
                          className="mt-3 w-100 w-md-auto"
                          onClick={() => setSelectedImage(getImageUrl(pedido.dibujo.imagen_generada!))}
                        >
                          Ver detalle ampliado
                        </CButton>
                      </>
                    ) : (
                      <div className="text-muted text-center py-4">No hay imagen generada</div>
                    )}
                  </div>
                </div>
              </div>
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

      {/* Lightbox para ampliar imagen */}
      <CModal 
        visible={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        size="xl" 
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle className="fs-5">Visualización ampliada del plano</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-0 text-center" style={{ background: "var(--cui-body-bg)" }}>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Plano ampliado" 
              className="img-fluid" 
              style={{ maxHeight: "85vh", objectFit: "contain", width: "100%" }}
            />
          )}
        </CModalBody>
        <CModalFooter>
          {selectedImage && (
            <CButton color="primary" variant="ghost" onClick={() => window.open(selectedImage, "_blank")}>
              Abrir en nueva pestaña
            </CButton>
          )}
          <CButton color="secondary" onClick={() => setSelectedImage(null)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}
