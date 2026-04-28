import { useState, useEffect, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CAlert,
} from "@coreui/react";
import { cilQrCode, cilSearch, cilArrowLeft, cilCheckCircle } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { despachoService } from "../../services/despacho.service";
import type { Despacho } from "../../types/despacho.types";

export default function EntregaQrPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [despacho, setDespacho] = useState<Despacho | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<any>(null);

  const handleSearch = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Ingrese un código QR válido");
      return;
    }
    setLoading(true);
    setDespacho(null);
    setScannerError(null);
    try {
      const res = await despachoService.buscarPorCodigoQr(trimmed);
      if (res.data.success && res.data.data) {
        setDespacho(res.data.data);
        toast.success("Despacho encontrado");
      } else {
        setScannerError("No se encontró ningún despacho con ese código QR");
      }
    } catch (err: any) {
      setScannerError(err.response?.data?.message || "Error al buscar despacho");
    } finally {
      setLoading(false);
    }
  };

  const startScanner = async () => {
    setScanning(true);
    setScannerError(null);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          html5QrCode.stop();
          setScanning(false);
          handleSearch(decodedText);
        },
        () => {}
      );
    } catch (err: any) {
      setScanning(false);
      setScannerError(
        "No se pudo acceder a la cámara. Verifique los permisos o ingrese el código manualmente."
      );
    }
  };

  const stopScanner = () => {
    if (html5QrRef.current) {
      html5QrRef.current.stop().catch(() => {});
      html5QrRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <CButton
            color="secondary"
            variant="ghost"
            onClick={() => navigate("/despachos")}
          >
            <CIcon icon={cilArrowLeft} size="lg" />
          </CButton>
          <div>
            <h4 className="mb-0 fw-bold">Entrega por Código QR</h4>
            <small className="text-secondary">
              Escanee o ingrese el código QR del despacho para confirmar la entrega
            </small>
          </div>
        </div>
      </div>

      <CCard className="border-0 shadow-sm mb-4">
        <CCardHeader className="py-3">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
            <CIcon icon={cilQrCode} className="text-primary" />
            Lectura de Código QR
          </h5>
        </CCardHeader>
        <CCardBody>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="bg-body-tertiary p-4 rounded border text-center">
                {scanning ? (
                  <>
                    <div
                      id="qr-reader"
                      ref={scannerRef}
                      style={{ width: "100%", minHeight: 300 }}
                    />
                    <CButton
                      color="danger"
                      variant="outline"
                      className="mt-3"
                      onClick={stopScanner}
                    >
                      Detener Escáner
                    </CButton>
                  </>
                ) : (
                  <>
                    <CIcon
                      icon={cilQrCode}
                      size="3xl"
                      className="mb-3 opacity-25"
                    />
                    <p className="text-secondary mb-3">
                      Active la cámara para escanear el código QR del comprobante de despacho
                    </p>
                    <CButton
                      color="primary"
                      size="lg"
                      className="px-4 shadow-sm"
                      onClick={startScanner}
                    >
                      <CIcon icon={cilQrCode} className="me-2" />
                      Activar Escáner QR
                    </CButton>
                  </>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="bg-body-tertiary p-4 rounded border h-100 d-flex flex-column justify-content-center">
                <h6 className="fw-bold text-uppercase text-secondary small mb-3">
                  Búsqueda Manual
                </h6>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Ej: DSP-A1B2C3D4E5F6..."
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(manualCode)}
                  />
                  <CButton
                    color="primary"
                    onClick={() => handleSearch(manualCode)}
                    disabled={loading || !manualCode.trim()}
                  >
                    {loading ? <CSpinner size="sm" /> : "Buscar"}
                  </CButton>
                </CInputGroup>
                <small className="text-secondary">
                  Ingrese el código QR impreso en el comprobante de despacho
                </small>
              </div>
            </div>
          </div>

          {scannerError && (
            <CAlert color="warning" className="mt-3 d-flex align-items-center gap-2">
              <CIcon icon={cilSearch} />
              {scannerError}
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      {loading && (
        <div className="d-flex justify-content-center py-4">
          <CSpinner color="primary" />
          <span className="ms-3 text-secondary">Buscando despacho...</span>
        </div>
      )}

      {despacho && (
        <CCard className="border-0 shadow-sm border-success" style={{ borderWidth: 2 }}>
          <CCardHeader className="py-3 bg-success bg-opacity-10">
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-success">
              <CIcon icon={cilCheckCircle} />
              Despacho Encontrado — #{despacho.id_despacho}
            </h5>
          </CCardHeader>
          <CCardBody>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <small className="text-secondary d-block">Código QR</small>
                <CBadge color="dark" shape="rounded-pill" className="px-3 py-2 fs-6">
                  {despacho.codigo_qr}
                </CBadge>
              </div>
              <div className="col-md-4">
                <small className="text-secondary d-block">Receptor</small>
                <span className="fw-semibold fs-5">{despacho.receptor || "—"}</span>
              </div>
              <div className="col-md-4">
                <small className="text-secondary d-block">Fecha de Despacho</small>
                <span className="fw-semibold">
                  {new Date(despacho.fecha_despacho).toLocaleString()}
                </span>
              </div>
            </div>

            {despacho.observaciones && (
              <div className="mb-3">
                <small className="text-secondary d-block">Observaciones</small>
                <span>{despacho.observaciones}</span>
              </div>
            )}

            <h6 className="text-uppercase text-secondary fw-bold small mb-2 mt-4">
              Detalle de Productos Entregados
            </h6>
            <CTable bordered responsive align="middle" className="mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Producto</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Pedido</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Cliente</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Cant. Entregada</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {despacho.detalles.map((d) => {
                  const producto = d.pedido_detalle?.producto;
                  const nombreProducto = producto?.tipo_producto?.nombre || producto?.descripcion || "—";
                  const medidaLargo = Number(producto?.medida_largo || 0);
                  const cantidadMetros = Number(d.cantidad_entregada);
                  const calaminas = medidaLargo > 0 ? Math.floor(cantidadMetros / medidaLargo) : 0;

                  return (
                    <CTableRow key={d.id_despacho_detalle}>
                      <CTableDataCell className="fw-semibold">
                        {nombreProducto}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color="primary" shape="rounded-pill">
                          #{d.id_pedido}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {d.pedido_detalle?.pedido?.nombre_cliente || "—"}
                      </CTableDataCell>
                      <CTableDataCell className="text-center fw-bold">
                        {calaminas > 0 && <span className="me-1">{calaminas} cal.</span>}
                        <span className={calaminas > 0 ? "text-secondary small" : ""}>
                          {calaminas > 0 ? `(${cantidadMetros.toFixed(2)} m)` : `${cantidadMetros.toFixed(2)} m`}
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>

            <div className="mt-4 p-3 bg-success bg-opacity-10 rounded border border-success border-opacity-25">
              <div className="d-flex align-items-center gap-2 text-success fw-bold">
                <CIcon icon={cilCheckCircle} size="lg" />
                Entrega verificada mediante código QR
              </div>
              <small className="text-secondary d-block mt-1">
                Este comprobante confirma que los productos fueron entregados al receptor indicado.
              </small>
            </div>
          </CCardBody>
        </CCard>
      )}
    </>
  );
}
