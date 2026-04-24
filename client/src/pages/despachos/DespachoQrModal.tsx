import { useState, useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react";
import { cilQrCode, cilPrint } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { despachoService } from "../../services/despacho.service";
import type { DespachoQrData } from "../../types/despacho.types";

interface Props {
  visible: boolean;
  onClose: () => void;
  codigoQr: string | null;
}

export default function DespachoQrModal({ visible, onClose, codigoQr }: Props) {
  const [qrData, setQrData] = useState<DespachoQrData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && codigoQr) {
      setLoading(true);
      setError(null);
      despachoService
        .generarQr(codigoQr)
        .then((res) => {
          if (res.data.success) {
            setQrData(res.data.data);
          } else {
            setError(res.data.message || "Error al generar QR");
          }
        })
        .catch((err) => setError(err.message || "Error de conexión"))
        .finally(() => setLoading(false));
    } else {
      setQrData(null);
      setError(null);
    }
  }, [visible, codigoQr]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !qrData) return;

    const despacho = qrData.despacho;
    const detallesHtml = despacho.detalles
      .map(
        (d) => `
        <tr>
          <td style="padding:6px;border:1px solid #ddd">${d.pedido_detalle?.producto?.descripcion || "—"}</td>
          <td style="padding:6px;border:1px solid #ddd;text-align:center">${d.pedido_detalle?.pedido?.nombre_cliente || "—"}</td>
          <td style="padding:6px;border:1px solid #ddd;text-align:center">${Number(d.cantidad_entregada).toFixed(2)} m</td>
        </tr>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Comprobante de Despacho #${despacho.id_despacho}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: auto; }
            h2 { text-align: center; margin-bottom: 5px; }
            .qr-container { text-align: center; margin: 20px 0; }
            .qr-container img { width: 200px; height: 200px; }
            .info { margin: 10px 0; font-size: 14px; }
            .info strong { display: inline-block; width: 140px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background: #f0f0f0; padding: 8px; border: 1px solid #ddd; text-align: left; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <h2>Comprobante de Entrega</h2>
          <p style="text-align:center;color:#666;margin:0">Despacho #${despacho.id_despacho}</p>
          <hr/>
          <div class="info"><strong>Receptor:</strong> ${despacho.receptor || "—"}</div>
          <div class="info"><strong>Fecha:</strong> ${new Date(despacho.fecha_despacho).toLocaleString()}</div>
          <div class="info"><strong>Código QR:</strong> ${despacho.codigo_qr}</div>
          ${despacho.observaciones ? `<div class="info"><strong>Observaciones:</strong> ${despacho.observaciones}</div>` : ""}
          <div class="qr-container">
            <img src="${qrData.qr_image}" alt="QR Code" />
          </div>
          <h4>Detalle de Productos</h4>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th style="text-align:center">Cliente</th>
                <th style="text-align:center">Cant. Entregada</th>
              </tr>
            </thead>
            <tbody>${detallesHtml}</tbody>
          </table>
          <div class="footer">Documento generado por Sistema Acerlim — ${new Date().toLocaleString()}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg" scrollable backdrop="static">
      <CModalHeader className="border-bottom-0 pb-0">
        <CModalTitle className="fw-bold d-flex align-items-center gap-2">
          <CIcon icon={cilQrCode} size="lg" className="text-primary" />
          Código QR — Comprobante de Despacho
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="pt-0">
        <hr className="mb-4 opacity-10" />

        {loading && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <CSpinner color="primary" />
            <span className="ms-3 text-secondary">Generando código QR...</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {qrData && (
          <div className="text-center">
            <div className="mb-3">
              <img
                src={qrData.qr_image}
                alt="QR Code"
                style={{ width: 220, height: 220, imageRendering: "pixelated" }}
              />
            </div>
            <CBadge color="dark" shape="rounded-pill" className="px-3 py-2 fs-6">
              {qrData.codigo_qr}
            </CBadge>

            <div className="mt-4 text-start">
              <h6 className="text-uppercase text-secondary fw-bold small mb-2">
                Información del Despacho
              </h6>
              <div className="bg-body-tertiary p-3 rounded border">
                <div className="row g-2">
                  <div className="col-md-6">
                    <small className="text-secondary d-block">Receptor</small>
                    <span className="fw-semibold">{qrData.despacho.receptor || "—"}</span>
                  </div>
                  <div className="col-md-6">
                    <small className="text-secondary d-block">Fecha</small>
                    <span className="fw-semibold">
                      {new Date(qrData.despacho.fecha_despacho).toLocaleString()}
                    </span>
                  </div>
                </div>
                {qrData.despacho.observaciones && (
                  <div className="mt-2">
                    <small className="text-secondary d-block">Observaciones</small>
                    <span>{qrData.despacho.observaciones}</span>
                  </div>
                )}
              </div>
            </div>

            {qrData.despacho.detalles.length > 0 && (
              <div className="mt-3 text-start">
                <h6 className="text-uppercase text-secondary fw-bold small mb-2">
                  Productos Entregados
                </h6>
                <CTable bordered small responsive align="middle" className="mb-0">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Producto</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Cliente</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Cant. Entregada</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {qrData.despacho.detalles.map((d) => (
                      <CTableRow key={d.id_despacho_detalle}>
                        <CTableDataCell>
                          {d.pedido_detalle?.producto?.descripcion || "—"}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {d.pedido_detalle?.pedido?.nombre_cliente || "—"}
                        </CTableDataCell>
                        <CTableDataCell className="text-center fw-bold">
                          {Number(d.cantidad_entregada).toFixed(2)} m
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            )}
          </div>
        )}
      </CModalBody>
      <CModalFooter className="border-top-0 pt-0">
        <CButton color="secondary" variant="ghost" onClick={onClose}>
          Cerrar
        </CButton>
        {qrData && (
          <CButton
            color="primary"
            className="d-flex align-items-center gap-2"
            onClick={handlePrint}
          >
            <CIcon icon={cilPrint} />
            Imprimir Comprobante
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
}
