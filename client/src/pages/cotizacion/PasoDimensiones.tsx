import React from "react";
import type { Producto } from "../../types/producto.types";
import type { CalculoResult } from "../../hooks/useCalculo";

interface Props {
  techoLargo: number;
  techoAncho: number;
  traslapeCm: number;
  producto: Producto | null;
  calculo: CalculoResult | null;
  onTechoLargoChange: (v: number) => void;
  onTechoAnchoChange: (v: number) => void;
  colaActiva: boolean;
  colaBase: number;
  colaAltura: number;
  colaCantidad: number;
  onColaActivaChange: (v: boolean) => void;
  onColaBaseChange: (v: number) => void;
  onColaAlturaChange: (v: number) => void;
  onColaCantidadChange: (v: number) => void;
}

const PasoDimensiones: React.FC<Props> = ({
  techoLargo,
  techoAncho,
  traslapeCm,
  producto,
  calculo,
  onTechoLargoChange,
  onTechoAnchoChange,
  colaActiva,
  colaBase,
  colaAltura,
  colaCantidad,
  onColaActivaChange,
  onColaBaseChange,
  onColaAlturaChange,
  onColaCantidadChange,
}) => {
  return (
    <div className="animate-in">
      <h5 className="fw-bold mb-1">Dimensiones del techo</h5>
      <p className="text-secondary mb-4" style={{ fontSize: ".85rem" }}>
        Ajusta las medidas y el traslape longitudinal entre calaminas.
        {producto && (
          <span className="ms-1 fw-semibold" style={{ color: "#2563EB" }}>
            Calamina: {producto.tipo_producto?.nombre} ({Number(producto.medida_largo).toFixed(2)} m × {Number(producto.medida_ancho).toFixed(2)} m)
          </span>
        )}
      </p>

      <div className="slider-group">
        <label>
          Largo del techo
          <span className="slider-value">{techoLargo.toFixed(1)} m</span>
        </label>
        <input
          type="range"
          min={1}
          max={25}
          step={0.5}
          value={techoLargo}
          onChange={(e) => onTechoLargoChange(parseFloat(e.target.value))}
          id="slider-techo-largo"
        />
        <div className="d-flex justify-content-between mt-1" style={{ fontSize: ".7rem", color: "var(--cui-secondary-color)" }}>
          <span>1 m</span>
          <span>25 m</span>
        </div>
      </div>

      <div className="slider-group">
        <label>
          Ancho del techo
          <span className="slider-value">{techoAncho.toFixed(1)} m</span>
        </label>
        <input
          type="range"
          min={1}
          max={15}
          step={0.5}
          value={techoAncho}
          onChange={(e) => onTechoAnchoChange(parseFloat(e.target.value))}
          id="slider-techo-ancho"
        />
        <div className="d-flex justify-content-between mt-1" style={{ fontSize: ".7rem", color: "var(--cui-secondary-color)" }}>
          <span>1 m</span>
          <span>15 m</span>
        </div>
      </div>

      <div className="slider-group">
        <label>
          Traslape longitudinal
          <span className="slider-value-locked">
            10 cm
          </span>
        </label>
        <input
          type="range"
          min={10}
          max={10}
          step={1}
          value={10}
          onChange={() => {}}
          id="slider-traslape"
          disabled
          style={{ opacity: 1, cursor: "not-allowed" }}
        />
        <div className="d-flex justify-content-between mt-1" style={{ fontSize: ".7rem", color: "var(--cui-secondary-color)" }}>
          <span>Valor fijo</span>
          <span style={{ fontStyle: "italic" }}>No modificable</span>
        </div>
      </div>

      {calculo && (
        <div className="metric-cards">
          <div className="metric-card">
            <div className="metric-value">{calculo.totalTecho}</div>
            <div className="metric-label">Calaminas Techo</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{calculo.filas}</div>
            <div className="metric-label">Filas</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{calculo.cols}</div>
            <div className="metric-label">Columnas</div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          className={`cola-toggle-btn ${colaActiva ? "active" : ""}`}
          onClick={() => onColaActivaChange(!colaActiva)}
          id="btn-toggle-cola"
        >
          <span className={`cola-toggle-icon ${colaActiva ? "active" : ""}`}>
            {colaActiva ? "×" : "+"}
          </span>
          <span>{colaActiva ? "Quitar cola de pato" : "Agregar cola de pato"}</span>
        </button>

        <div className={`cola-panel ${colaActiva ? "open" : ""}`}>
          <div className="cola-panel-inner">
            <p className="text-secondary mb-3" style={{ fontSize: ".8rem" }}>
              Las colas de pato son extensiones triangulares que se agregan a los costados del techo.
            </p>

            <div className="mb-3">
              <label className="d-block mb-2" style={{ fontSize: ".78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>
                Cantidad de colas
              </label>
              <div className="cola-counter">
                <button
                  type="button"
                  className="cola-counter-btn"
                  onClick={() => onColaCantidadChange(Math.max(1, colaCantidad - 1))}
                  disabled={colaCantidad <= 1}
                >
                  −
                </button>
                <span className="cola-counter-value">{colaCantidad}</span>
                <button
                  type="button"
                  className="cola-counter-btn"
                  onClick={() => onColaCantidadChange(Math.min(4, colaCantidad + 1))}
                  disabled={colaCantidad >= 4}
                >
                  +
                </button>
              </div>
            </div>

            <div className="slider-group">
              <label>
                Base de la cola
                <span className="slider-value">{colaBase.toFixed(1)} m</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={6}
                step={0.5}
                value={colaBase}
                onChange={(e) => onColaBaseChange(parseFloat(e.target.value))}
                id="slider-cola-base"
              />
              <div className="d-flex justify-content-between mt-1" style={{ fontSize: ".7rem", color: "var(--cui-secondary-color)" }}>
                <span>0.5 m</span>
                <span>6 m</span>
              </div>
            </div>

            <div className="slider-group">
              <label>
                Altura de la cola
                <span className="slider-value">{colaAltura.toFixed(1)} m</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={4}
                step={0.5}
                value={colaAltura}
                onChange={(e) => onColaAlturaChange(parseFloat(e.target.value))}
                id="slider-cola-altura"
              />
              <div className="d-flex justify-content-between mt-1" style={{ fontSize: ".7rem", color: "var(--cui-secondary-color)" }}>
                <span>0.5 m</span>
                <span>4 m</span>
              </div>
            </div>

            {calculo && (
              <div className="cola-info-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="cola-info-card">
                  <div className="cola-info-value">{calculo.nFranjas}</div>
                  <div className="cola-info-label">N° de franjas</div>
                </div>
                <div className="cola-info-card">
                  <div className="cola-info-value">{calculo.calPorCola} pzas</div>
                  <div className="cola-info-label">Calaminas por cola</div>
                </div>
                <div className="cola-info-card highlight">
                  <div className="cola-info-value">{calculo.totalColas}</div>
                  <div className="cola-info-label">Total calaminas ({colaCantidad} cola{colaCantidad > 1 ? 's' : ''})</div>
                </div>
              </div>
            )}

            {calculo && calculo.colaPato.franjas.length > 0 && (
              <div className="mt-3">
                <label className="d-block mb-2" style={{ fontSize: ".78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>
                  Detalle de franjas por cola
                </label>
                <div className="table-responsive border rounded">
                  <table className="table table-sm table-striped table-hover mb-0" style={{ fontSize: '.82rem' }}>
                    <thead style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                      <tr className="table-light text-secondary">
                        <th className="fw-bold px-3 py-2">Franja</th>
                        <th className="fw-bold px-3 py-2">Altura</th>
                        <th className="fw-bold px-3 py-2">Calaminas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculo.colaPato.franjas.map((f, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2" style={{ fontWeight: 800, color: '#d97706' }}>{f.franja}</td>
                          <td className="px-3 py-2 fw-semibold text-body">{f.altura.toFixed(2)} m</td>
                          <td className="px-3 py-2 fw-semibold text-body">{f.calaminas} pza{f.calaminas !== 1 ? 's' : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {calculo && (
        <div className="mt-4 p-3 rounded" style={{ background: "var(--cui-secondary-bg)", border: "1px solid var(--cui-border-color)" }}>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Largo de la calamina</span>
            <span className="fw-bold">{calculo.datosJson.cal_largo.toFixed(2)} m</span>
          </div>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Traslape restado</span>
            <span className="fw-bold text-danger">−{traslapeCm} cm</span>
          </div>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Largo efectivo por calamina</span>
            <span className="fw-bold" style={{ color: "#2563EB" }}>{calculo.largoEfectivo.toFixed(2)} m</span>
          </div>
          <hr className="my-2" />
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Ancho efectivo por calamina</span>
            <span className="fw-bold">{calculo.anchoEfectivo.toFixed(2)} m</span>
          </div>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Producto</span>
            <span className="fw-bold">{producto?.tipo_producto?.nombre}</span>
          </div>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Área total del techo</span>
            <span className="fw-bold">{(techoLargo * techoAncho).toFixed(2)} m²</span>
          </div>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Total metros lineales</span>
            <span className="fw-bold" style={{ color: "#059669" }}>{calculo.totalMetrosLineales.toFixed(2)} ml</span>
          </div>

          <hr className="my-2" />

          {colaActiva ? (
            <div className="total-resumen-bar">
              <div className="total-resumen-item">
                <span className="total-resumen-num">{calculo.totalTecho}</span>
                <span className="total-resumen-label">techo</span>
              </div>
              <span className="total-resumen-op">+</span>
              <div className="total-resumen-item cola">
                <span className="total-resumen-num">{calculo.totalColas}</span>
                <span className="total-resumen-label">colas</span>
              </div>
              <span className="total-resumen-op">=</span>
              <div className="total-resumen-item total">
                <span className="total-resumen-num">{calculo.totalGeneral}</span>
                <span className="total-resumen-label">total calaminas</span>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-between" style={{ fontSize: ".92rem" }}>
              <span className="fw-bold">Total calaminas</span>
              <span className="fw-bold" style={{ color: "#2563EB", fontSize: "1.1rem" }}>{calculo.totalGeneral}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PasoDimensiones;
