import React, { useState } from "react";
import { CCard, CCardBody, CButton } from "@coreui/react";
import type { Producto } from "../../types/producto.types";
import { useCalculo } from "../../hooks/useCalculo";
import PasoSeleccionCalamina from "./PasoSeleccionCalamina";
import PasoDimensiones from "./PasoDimensiones";
import PasoPlano2D from "./PasoPlano2D";
import PasoGuardar from "./PasoGuardar";
import "./CotizacionTechoPage.css";

const PASOS = [
  { num: 1, label: "Calamina" },
  { num: 2, label: "Dimensiones" },
  { num: 3, label: "Plano 2D" },
  { num: 4, label: "Guardar" },
];

const CotizacionTechoPage: React.FC = () => {
  const [paso, setPaso] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [techoLargo, setTechoLargo] = useState(8);
  const [techoAncho, setTechoAncho] = useState(5);
  const traslapeCm = 10;
  const [imagenBase64, setImagenBase64] = useState("");

  // Cola de pato
  const [colaActiva, setColaActiva] = useState(false);
  const [colaBase, setColaBase] = useState(2);
  const [colaAltura, setColaAltura] = useState(1.5);
  const [colaCantidad, setColaCantidad] = useState(1);

  const calculo = useCalculo(
    techoLargo, techoAncho, productoSeleccionado, traslapeCm,
    colaActiva, colaBase, colaAltura, colaCantidad
  );

  const canGoNext = () => {
    if (paso === 1) return !!productoSeleccionado;
    if (paso === 2) return !!calculo;
    if (paso === 3) return true;
    return false;
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold">Cotización de Techo</h4>
          <small className="text-secondary">
            Calcula, visualiza y genera cotizaciones de calaminas
          </small>
        </div>
      </div>

      {/* Stepper */}
      <div className="cotizacion-stepper">
        {PASOS.map((p, i) => (
          <React.Fragment key={p.num}>
            <div
              className={`stepper-step ${paso === p.num ? "active" : ""} ${paso > p.num ? "completed" : ""}`}
              onClick={() => {
                if (p.num < paso) setPaso(p.num);
                if (p.num === paso + 1 && canGoNext()) setPaso(p.num);
              }}
            >
              <div className="step-number">
                {paso > p.num ? "✓" : p.num}
              </div>
              <span className="step-label">{p.label}</span>
            </div>
            {i < PASOS.length - 1 && (
              <div className={`stepper-connector ${paso > p.num ? "done" : ""}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <CCard className="border-0 shadow-sm">
        <CCardBody className="p-4">
          {paso === 1 && (
            <PasoSeleccionCalamina
              productoSeleccionado={productoSeleccionado}
              onSeleccionar={setProductoSeleccionado}
            />
          )}

          {paso === 2 && (
            <PasoDimensiones
              techoLargo={techoLargo}
              techoAncho={techoAncho}
              traslapeCm={traslapeCm}
              producto={productoSeleccionado}
              calculo={calculo}
              onTechoLargoChange={setTechoLargo}
              onTechoAnchoChange={setTechoAncho}
              colaActiva={colaActiva}
              colaBase={colaBase}
              colaAltura={colaAltura}
              colaCantidad={colaCantidad}
              onColaActivaChange={setColaActiva}
              onColaBaseChange={setColaBase}
              onColaAlturaChange={setColaAltura}
              onColaCantidadChange={setColaCantidad}
            />
          )}

          {paso === 3 && (
            <PasoPlano2D
              producto={productoSeleccionado}
              calculo={calculo}
              techoLargo={techoLargo}
              techoAncho={techoAncho}
              onImagenGenerada={setImagenBase64}
              colaActiva={colaActiva}
              colaBase={colaBase}
              colaAltura={colaAltura}
              colaCantidad={colaCantidad}
            />
          )}

          {paso === 4 && (
            <PasoGuardar
              producto={productoSeleccionado}
              calculo={calculo}
              imagenBase64={imagenBase64}
            />
          )}

          {/* Navigation */}
          <div className="step-navigation">
            <CButton
              color="secondary"
              variant="outline"
              onClick={() => setPaso(paso - 1)}
              disabled={paso === 1}
              className="px-4"
            >
              ← Anterior
            </CButton>

            <div className="text-secondary" style={{ fontSize: ".78rem", fontWeight: 600 }}>
              Paso {paso} de {PASOS.length}
            </div>

            {paso < PASOS.length ? (
              <CButton
                color="primary"
                onClick={() => setPaso(paso + 1)}
                disabled={!canGoNext()}
                className="px-4"
              >
                Siguiente →
              </CButton>
            ) : (
              <div style={{ width: 120 }} />
            )}
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CotizacionTechoPage;
