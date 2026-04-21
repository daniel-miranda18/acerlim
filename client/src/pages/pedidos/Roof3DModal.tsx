import { lazy, Suspense } from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CSpinner } from "@coreui/react";
import type { Pedido } from "../../types/pedido.types";
import { useTheme } from "../../context/ThemeContext";

const RoofViewer3D = lazy(() => import("./RoofViewer3D"));

interface Props {
  visible: boolean;
  onClose: () => void;
  pedido: Pedido | null;
}

export default function Roof3DModal({ visible, onClose, pedido }: Props) {
  const { theme } = useTheme();
  if (!pedido) return null;

  const d = pedido.dibujo;
  const largo = d ? Number(d.largo) : 8;
  const ancho = d ? Number(d.ancho) : 5;

  let filas = 4;
  let columnas = 6;
  let colaActiva = false;
  let colaBase = 2;
  let colaAltura = 1.5;
  let caidas = d?.caidas ?? 2;

  if (d?.datos_json) {
    try {
      const conf = JSON.parse(d.datos_json);
      if (conf.filas) filas = conf.filas;
      if (conf.columnas) columnas = conf.columnas;
      if (conf.caidas) caidas = conf.caidas;
      if (conf.cola_pato?.activa) {
        colaActiva = true;
        colaBase = conf.cola_pato.base ?? 2;
        colaAltura = conf.cola_pato.altura ?? 1.5;
      }
    } catch { /* noop */ }
  }

  let techoColor: string | undefined;
  if (pedido.producciones && pedido.producciones.length > 0) {
    const p = pedido.producciones[0];
    if (p.bobina?.color_rel?.codigo_hex) {
      techoColor = p.bobina.color_rel.codigo_hex;
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} size="xl" alignment="center" fullscreen="md">
      <CModalHeader>
        <CModalTitle>
          Visualización 3D — Pedido #{pedido.id_pedido} &middot; <span className="text-secondary">{pedido.nombre_cliente}</span>
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="p-0 position-relative" style={{ background: theme === "dark" ? "#0f172a" : "#dde6f0", minHeight: "55vh" }}>
        {/* Info overlay */}
        <div
          className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1"
          style={{ zIndex: 10 }}
        >
          <span
            className="badge px-3 py-2"
            style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)", color: "#94a3b8", fontSize: "0.7rem", letterSpacing: "0.5px" }}
          >
            Techo {largo}m × {ancho}m
          </span>
          <span
            className="badge px-3 py-2"
            style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)", color: techoColor || "#5dcaa5", fontSize: "0.7rem" }}
          >
            {filas} filas · {columnas} columnas
          </span>
        </div>

        <div
          className="position-absolute bottom-0 end-0 m-3"
          style={{ zIndex: 10 }}
        >
        </div>

        <Suspense
          fallback={
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "55vh" }}>
              <div className="text-center">
                <CSpinner color="primary" />
                <p className="text-secondary mt-2" style={{ fontSize: "0.8rem" }}>Cargando modelo 3D...</p>
              </div>
            </div>
          }
        >
          <RoofViewer3D
            largo={largo}
            ancho={ancho}
            filas={filas}
            columnas={columnas}
            colaActiva={colaActiva}
            colaBase={colaBase}
            colaAltura={colaAltura}
            caidas={caidas}
            theme={theme}
            techoColor={techoColor}
            style={{ height: "60vh" } as any}
          />
        </Suspense>
      </CModalBody>

      <CModalFooter style={{ background: "var(--cui-card-bg)" }}>
        <div className="d-flex align-items-center gap-3 w-100" style={{ fontSize: "0.8rem" }}>
          <div className="d-flex align-items-center gap-2">
            <span className="rounded-circle d-inline-block" style={{ width: 12, height: 12, background: "#1a7a5e" }} />
            <span className="text-secondary">Calaminas techo</span>
          </div>
          {colaActiva && (
            <div className="d-flex align-items-center gap-2">
              <span className="rounded-circle d-inline-block" style={{ width: 12, height: 12, background: "#ba7517" }} />
              <span className="text-secondary">Cola de pato</span>
            </div>
          )}
          <div className="ms-auto">
            <CButton color="secondary" onClick={onClose}>Cerrar</CButton>
          </div>
        </div>
      </CModalFooter>
    </CModal>
  );
}
