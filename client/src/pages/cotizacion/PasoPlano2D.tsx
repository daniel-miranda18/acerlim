import React, { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect, forwardRef, useImperativeHandle } from "react";
import { Stage, Layer, Rect, Text, Line, Group } from "react-konva";
import { toPng } from "html-to-image";
import type { Producto } from "../../types/producto.types";
import type { CalculoResult, Franja } from "../../hooks/useCalculo";
import { useTheme } from "../../context/ThemeContext";

type ViewMode = "superior" | "isometrica";
type OrientationMode = "horizontal" | "vertical";

interface Props {
  producto: Producto | null;
  calculo: CalculoResult | null;
  techoLargo: number;
  techoAncho: number;
  onImagenGenerada: (base64: string) => void;
  colaActiva: boolean;
  colaBase: number;
  colaAltura: number;
  colaCantidad: number;
}

const PADDING = 60;
const GAP_COLA_TECHO = 20; // px gap between triangle and techo

export interface PasoPlano2DRef {
  exportarImagen: () => Promise<string | undefined>;
}

const PasoPlano2D = forwardRef<PasoPlano2DRef, Props>(({
  producto, calculo, techoLargo, techoAncho, onImagenGenerada,
  colaActiva, colaBase, colaAltura, colaCantidad
}, ref) => {
  const [viewMode, setViewMode] = useState<ViewMode>("superior");
  const [orientation, setOrientation] = useState<OrientationMode>("horizontal");
  const [showNumeros, setShowNumeros] = useState(true);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight || 500
      });
    }
  }, []);

  useLayoutEffect(() => { updateDimensions(); }, [updateDimensions]);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  }, []);

  const handleZoomIn  = () => setStageScale((s) => s * 1.2);
  const handleZoomOut = () => setStageScale((s) => s / 1.2);
  const handleResetZoom = () => { setStageScale(1); setStagePos({ x: 0, y: 0 }); };

  useImperativeHandle(ref, () => ({
    exportarImagen: async () => {
      if (!containerRef.current) return;
      try {
        const dataUrl = await toPng(containerRef.current, { quality: 0.95, pixelRatio: 2 });
        onImagenGenerada && onImagenGenerada(dataUrl);
        return dataUrl;
      } catch (err) {
        console.error("Error exporting image:", err);
      }
    }
  }));

  if (!calculo || !producto) {
    return (
      <div className="animate-in text-center py-5 text-secondary">
        <div style={{ fontSize: "2.5rem", opacity: .3 }}>📐</div>
        <p className="mt-2">Selecciona un producto y configura las dimensiones primero.</p>
      </div>
    );
  }

  const { filas, cols, largoEfectivo, anchoEfectivo } = calculo;
  const calLargo = Number(producto.medida_largo);
  const calAncho = Number(producto.medida_ancho);
  const franjas  = calculo.colaPato.franjas;

  return (
    <div className="animate-in">
      <h5 className="fw-bold mb-1">Plano 2D del techo</h5>
      <p className="text-secondary mb-3" style={{ fontSize: ".85rem" }}>
        Visualización de la distribución de calaminas con traslape.
      </p>

      <div className="canvas-wrapper">
        <div className="canvas-toolbar">
          <button className={`btn-view ${viewMode === "superior"   ? "active" : ""}`} onClick={() => setViewMode("superior")}>Vista Superior</button>
          <button className={`btn-view ${viewMode === "isometrica" ? "active" : ""}`} onClick={() => setViewMode("isometrica")}>Vista Isométrica</button>

          <div className="ms-2 border-start ps-2 d-flex align-items-center gap-1" style={{ borderColor: 'var(--cui-border-color)' }}>
            <button className={`btn-view ${orientation === "horizontal" ? "active" : ""}`} onClick={() => setOrientation("horizontal")}>Horizontal</button>
            <button className={`btn-view ${orientation === "vertical"   ? "active" : ""}`} onClick={() => setOrientation("vertical")}>Vertical</button>
          </div>

          <div className="ms-2 border-start ps-2 d-flex align-items-center">
            <button className={`btn-view ${showNumeros ? "active" : ""}`} onClick={() => setShowNumeros(!showNumeros)}>N° {showNumeros ? "ON" : "OFF"}</button>
          </div>

          <div className="ms-2 border-start ps-2 d-flex align-items-center gap-1" style={{ borderColor: 'var(--cui-border-color)' }}>
            <span className="text-secondary" style={{ fontSize: '.7rem', fontWeight: 600, marginRight: '.25rem' }}>ZOOM</span>
            <button className="btn-view" style={{ padding: '.2rem .6rem' }} onClick={handleZoomOut}>-</button>
            <button className="btn-view" style={{ padding: '.2rem .6rem' }} onClick={handleResetZoom}>100%</button>
            <button className="btn-view" style={{ padding: '.2rem .6rem' }} onClick={handleZoomIn}>+</button>
          </div>
        </div>

        <div ref={containerRef} id="konva-container" className="canvas-grid-bg" style={{ height: '520px' }}>
          {viewMode === "superior" ? (
            <VistaSuperior
              filas={filas} cols={cols} largoEfectivo={largoEfectivo} anchoEfectivo={anchoEfectivo}
              calLargo={calLargo} calAncho={calAncho} techoLargo={techoLargo} techoAncho={techoAncho}
              showNumeros={showNumeros} theme={theme} stageScale={stageScale} stagePos={stagePos}
              onPosChange={setStagePos} onWheel={handleWheel} width={dimensions.width} height={dimensions.height}
              orientation={orientation} colaActiva={colaActiva} colaBase={colaBase} colaAltura={colaAltura}
              colaCantidad={colaCantidad} franjas={franjas}
            />
          ) : (
            <VistaIsometrica
              filas={filas} cols={cols} largoEfectivo={largoEfectivo} anchoEfectivo={anchoEfectivo}
              calLargo={calLargo} calAncho={calAncho} techoLargo={techoLargo} techoAncho={techoAncho}
              showNumeros={showNumeros} theme={theme} stageScale={stageScale} stagePos={stagePos}
              onPosChange={setStagePos} onWheel={handleWheel} width={dimensions.width} height={dimensions.height}
              orientation={orientation} colaActiva={colaActiva} colaBase={colaBase} colaAltura={colaAltura}
              colaCantidad={colaCantidad} franjas={franjas}
            />
          )}
        </div>

        <div className="canvas-legend">
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: "rgba(93,202,165,.6)" }} />
            Calamina techo
          </div>
          {colaActiva && (
            <div className="legend-item">
              <div className="legend-swatch" style={{ background: "rgba(217,119,6,.5)" }} />
              Cola de pato (franjas)
            </div>
          )}
          <div className="legend-item">
            <div className="legend-swatch" style={{ border: "2px dashed #E24B4A", background: "transparent" }} />
            Contorno del techo
          </div>
        </div>
      </div>
    </div>
  );
});

/* ────────── SHARED TYPES ────────── */
interface ViewProps {
  filas: number; cols: number;
  largoEfectivo: number; anchoEfectivo: number;
  calLargo: number; calAncho: number;
  techoLargo: number; techoAncho: number;
  showNumeros: boolean; theme: string;
  stageScale: number; stagePos: { x: number; y: number };
  onPosChange: (pos: { x: number; y: number }) => void;
  onWheel: (e: any) => void;
  width: number; height: number;
  orientation: OrientationMode;
  colaActiva: boolean; colaBase: number; colaAltura: number; colaCantidad: number;
  franjas: Franja[];
}

/* ────────── HELPERS ────────── */
type Side = "left" | "right" | "top" | "bottom";

function getSidesForCount(count: number): Side[] {
  switch (count) {
    case 1:  return ["left"];
    case 2:  return ["left", "right"];
    case 3:  return ["left", "right", "top"];
    case 4:  return ["left", "right", "top", "bottom"];
    default: return ["left"];
  }
}

/* ────────── VISTA SUPERIOR ────────── */
const VistaSuperior: React.FC<ViewProps> = ({
  filas, cols, largoEfectivo, anchoEfectivo, calLargo, calAncho, techoLargo, techoAncho,
  showNumeros, theme, stageScale, stagePos, onPosChange, onWheel, width, height, orientation,
  colaActiva, colaBase, colaAltura, colaCantidad: _colaCantidad, franjas
}) => {
  const isHoriz = orientation === "horizontal";
  const drawWidth  = isHoriz ? techoLargo : techoAncho;
  const drawHeight = isHoriz ? techoAncho : techoLargo;

  const totalAncho = cols > 0 ? (cols - 1) * anchoEfectivo + calAncho : 0;
  const totalLargo = filas > 0 ? (filas - 1) * largoEfectivo + calLargo : 0;
  const boundingWidth  = isHoriz ? totalLargo  : totalAncho;
  const boundingHeight = isHoriz ? totalAncho : totalLargo;

  const nFranjas = franjas.length;
  // Siempre se muestra solo UNA cola (todas son idénticas)
  const sides: Side[] = colaActiva && nFranjas > 0 ? ["left"] : [];

  // How many sides use horizontal space (left/right) vs vertical (top/bottom)
  const hasLeft   = sides.includes("left");
  const hasRight  = sides.includes("right");
  const hasTop    = sides.includes("top");
  const hasBottom = sides.includes("bottom");

  // Extra canvas space needed for the triangles
  // For left/right: triangle base = colaBase, height = colaAltura (horizontal protrusion)
  // For top/bottom: triangle base = colaBase, height = colaAltura (vertical protrusion)
  const extraLeft   = hasLeft   ? colaBase   + GAP_COLA_TECHO / 50 : 0;
  const extraRight  = hasRight  ? colaBase   + GAP_COLA_TECHO / 50 : 0;
  const extraTop    = hasTop    ? colaBase   + GAP_COLA_TECHO / 50 : 0;
  const extraBottom = hasBottom ? colaBase   + GAP_COLA_TECHO / 50 : 0;

  const fitWidth  = Math.max(boundingWidth,  drawWidth)  + extraLeft + extraRight;
  const fitHeight = Math.max(boundingHeight, drawHeight) + extraTop  + extraBottom;

  const ppm = useMemo(() => Math.min(
    (width  - PADDING * 2) / Math.max(fitWidth,  0.1),
    (height - PADDING * 2) / Math.max(fitHeight, 0.1)
  ), [fitWidth, fitHeight, width, height]);

  // Origin of the techo: shifted right/down to leave room for left/top colas
  const ox = useMemo(() => (width  - fitWidth  * ppm) / 2 + extraLeft  * ppm, [fitWidth,  ppm, width,  extraLeft]);
  const oy = useMemo(() => (height - fitHeight * ppm) / 2 + extraTop   * ppm, [fitHeight, ppm, height, extraTop]);

  const bw = boundingWidth  * ppm;
  const bh = boundingHeight * ppm;

  /* Calaminas del techo */
  const calaminas = useMemo(() => {
    const items: { r: number; c: number; x: number; y: number; w: number; h: number }[] = [];
    for (let r = 0; r < filas; r++) {
      for (let c = 0; c < cols; c++) {
        const x_l = c * anchoEfectivo;
        const y_l = r * largoEfectivo;
        const x = ox + (isHoriz ? y_l : x_l) * ppm;
        const y = oy + (isHoriz ? x_l : y_l) * ppm;
        const w = (isHoriz ? calLargo : calAncho) * ppm;
        const h = (isHoriz ? calAncho : calLargo) * ppm;
        items.push({ r, c, x, y, w: Math.max(w, 0), h: Math.max(h, 0) });
      }
    }
    return items;
  }, [filas, cols, anchoEfectivo, largoEfectivo, calAncho, calLargo, ppm, ox, oy, isHoriz]);

  /* Cola de pato — triángulo recto con franjas verticales (side = left) */
  const colaGroups = useMemo(() => {
    if (!colaActiva || nFranjas === 0) return [];
    const franjaW_px = colaBase * ppm / nFranjas; // width of each vertical franja in px

    return sides.map(side => {
      // Compute origin and dimensions of the triangle bounding box per side
      let triX: number, triY: number, triW: number, triH: number;
      // clip polygon vertices (A, B, C)
      let Ax: number, Ay: number, Bx: number, By: number, Cx: number, Cy: number;

      if (side === "left") {
        // Triangle to the left of techo
        triW = colaBase  * ppm;
        triH = colaAltura * ppm;
        triX = ox - triW - GAP_COLA_TECHO;
        triY = oy;
        // Right-angle at top-left; hypotenuse from B(inf-izq) to C(sup-der)
        Ax = triX;      Ay = triY;           // sup-izq (right angle)
        Bx = triX;      By = triY + triH;    // inf-izq
        Cx = triX + triW; Cy = triY;         // sup-der
      } else if (side === "right") {
        triW = colaBase  * ppm;
        triH = colaAltura * ppm;
        triX = ox + bw + GAP_COLA_TECHO;
        triY = oy;
        Ax = triX + triW; Ay = triY;
        Bx = triX + triW; By = triY + triH;
        Cx = triX;        Cy = triY;
      } else if (side === "top") {
        triW = colaAltura * ppm;  // protrudes upward; base = bw, height = colaAltura
        triH = colaBase   * ppm;
        triX = ox;
        triY = oy - triH - GAP_COLA_TECHO;
        Ax = triX;      Ay = triY + triH;
        Bx = triX + bw; By = triY + triH;
        Cx = triX + bw / 2; Cy = triY;
      } else {
        triW = colaAltura * ppm;
        triH = colaBase   * ppm;
        triX = ox;
        triY = oy + bh + GAP_COLA_TECHO;
        Ax = triX;      Ay = triY;
        Bx = triX + bw; By = triY;
        Cx = triX + bw / 2; Cy = triY + triH;
      }

      const rects = franjas.map((f, idx) => {
        let rx: number, ry: number, rw: number, rh: number, labelX: number, labelY: number;

        if (side === "left") {
          rw = franjaW_px;
          rh = triH;  
          rx = triX + idx * franjaW_px;
          ry = triY;
          const visH = f.altura * ppm;
          labelX = rx + rw / 2;
          labelY = triY + (triH - visH) / 2 + visH / 2;
        } else if (side === "right") {
          rw = franjaW_px;
          rh = triH;
          rx = triX + idx * franjaW_px;
          ry = triY;
          const visH = (franjas[nFranjas - 1 - idx]?.altura ?? 0) * ppm;
          labelX = rx + rw / 2;
          labelY = triY + (triH - visH) / 2 + visH / 2;
        } else if (side === "top") {
          rw = bw / nFranjas;
          rh = franjaW_px;
          rx = triX + idx * rw;
          ry = triY;
          const visW = f.altura * ppm;
          labelX = rx + rw / 2;
          labelY = triY + (triH - visW) / 2 + visW / 2;
        } else {
          rw = bw / nFranjas;
          rh = franjaW_px;
          rx = triX + idx * rw;
          ry = triY + idx * franjaW_px;
          labelX = rx + rw / 2;
          labelY = ry + rh / 2;
        }

        return { rx, ry, rw, rh, labelX, labelY, f, idx };
      });

      return { side, triX, triY, triW, triH, Ax, Ay, Bx, By, Cx, Cy, rects };
    });
  }, [colaActiva, nFranjas, sides, colaBase, colaAltura, ppm, franjas, ox, oy, bw, bh]);

  const labelColor = theme === "dark" ? "#fde68a" : "#92400e";

  return (
    <Stage
      width={width} height={height}
      scaleX={stageScale} scaleY={stageScale}
      x={stagePos.x} y={stagePos.y}
      draggable
      onDragEnd={(e) => { const s = e.target.getStage(); if (s) onPosChange({ x: s.x(), y: s.y() }); }}
      onWheel={onWheel}
    >
      <Layer>
        {/* ── Calaminas del techo ── */}
        {calaminas.map(({ r, c, x, y, w, h }, idx) => (
          <Group key={idx}>
            <Rect x={x} y={y} width={w} height={h} fill="#5DCAA5" opacity={0.65} stroke="#1D9E75" strokeWidth={1} />
            {showNumeros && (
              <Text x={x} y={y} width={w} height={h} text={String(r * cols + c + 1)}
                fontSize={Math.max(10, Math.min(16, w * 0.25))} fontStyle="bold"
                fill={theme === "dark" ? "#f8fafc" : "#0f172a"} align="center" verticalAlign="middle" />
            )}
            {/* Dimensiones de la calamina — solo en la primera (idx=0) */}
            {idx === 0 && (() => {
              const dimColor = theme === "dark" ? "#94a3b8" : "#475569";
              const calW_label = isHoriz ? calLargo : calAncho;   // dimension along X axis
              const calH_label = isHoriz ? calAncho : calLargo;   // dimension along Y axis
              const tickLen = 4;
              return (
                <Group>
                  {/* ── Cota horizontal (ancho del tile) ── */}
                  {/* Línea superior con flechas */}
                  <Line points={[x, y - 14, x + w, y - 14]} stroke={dimColor} strokeWidth={1} dash={[3, 2]} />
                  <Line points={[x, y - 10, x, y - 18]} stroke={dimColor} strokeWidth={1} />
                  <Line points={[x + w, y - 10, x + w, y - 18]} stroke={dimColor} strokeWidth={1} />
                  <Text
                    x={x} y={y - 25} width={w}
                    text={`${calW_label.toFixed(2)} m`}
                    fontSize={9} fontStyle="bold" align="center"
                    fill={dimColor}
                  />
                  {/* ── Cota vertical (alto del tile) ── */}
                  <Line points={[x + w + 14, y, x + w + 14, y + h]} stroke={dimColor} strokeWidth={1} dash={[3, 2]} />
                  <Line points={[x + w + 10, y, x + w + 18, y]} stroke={dimColor} strokeWidth={1} />
                  <Line points={[x + w + 10, y + h, x + w + 18, y + h]} stroke={dimColor} strokeWidth={1} />
                  <Text
                    x={x + w + tickLen + 14} y={y}
                    width={h} height={20}
                    text={`${calH_label.toFixed(2)} m`}
                    fontSize={9} fontStyle="bold" align="center"
                    fill={dimColor} rotation={90}
                  />
                </Group>
              );
            })()}
          </Group>
        ))}

        {/* ── Colas de pato — franjas recortadas en triángulo ── */}
        {colaGroups.map(({ side, triX, triY, triW, triH, Ax, Ay, Bx, By, Cx, Cy, rects }) => (
          <Group key={`cola-${side}`}>
            {/* Franjas recortadas por el clip del triángulo */}
            <Group
              clipFunc={(ctx) => {
                ctx.beginPath();
                ctx.moveTo(Ax, Ay);
                ctx.lineTo(Bx, By);
                ctx.lineTo(Cx, Cy);
                ctx.closePath();
              }}
            >
              {rects.map(({ rx, ry, rw, rh, idx }) => (
                <Rect
                  key={`fr-${idx}`}
                  x={rx} y={ry} width={rw} height={rh}
                  fill={idx % 2 === 0 ? "rgba(186,117,23,0.75)" : "rgba(154,95,18,0.75)"}
                />
              ))}
            </Group>

            {/* Labels de altura por franja (si hay espacio) */}
            {showNumeros && rects.map(({ rx, ry, rw, rh, f, idx }) => {
              if (rw < 20) return null;
              const labelX = rx + rw / 2;
              const labelY = (side === "left" || side === "right")
                ? (Ay + (f.altura * ppm) / 2)   // dentro del área visible
                : (ry + rh / 2);
              return (
                <Text
                  key={`lbl-${idx}`}
                  x={labelX - 16} y={labelY - 6}
                  text={`${f.altura.toFixed(2)}m`}
                  fontSize={9} fontStyle="bold"
                  fill={labelColor}
                />
              );
            })}

            {/* Borde del triángulo */}
            <Line
              points={[Ax, Ay, Bx, By, Cx, Cy]}
              closed stroke="rgba(239,159,39,0.95)" strokeWidth={1.5}
            />

            {/* Cota BASE del triángulo */}
            {(side === "left" || side === "right") && (
              <Text
                x={triX} y={triY + triH + 6}
                width={triW} text={`${colaBase.toFixed(1)} m`}
                fontSize={10} fontStyle="bold"
                fill={labelColor} align="center"
              />
            )}

            {/* Cota ALTURA MÁX (rotada, al exterior del triángulo) */}
            {side === "left" && (
              <Text
                x={triX - 18} y={triY + triH}
                text={`${colaAltura.toFixed(1)} m`}
                fontSize={10} fontStyle="bold"
                fill={labelColor} rotation={-90}
                width={triH} align="center"
              />
            )}
          </Group>
        ))}

        {/* ── Borde del techo ── */}
        <Rect x={ox} y={oy} width={bw} height={bh}
          stroke="#E24B4A" strokeWidth={1.5} dash={[5, 3]} />

        {/* ── Cotas techo ── */}
        <Text x={ox} y={oy - 22} width={bw}
          text={`${drawWidth.toFixed(1)} m`} fontSize={12} fontStyle="bold"
          fill={theme === "dark" ? "#94a3b8" : "#64748b"} align="center" />
        <Text x={ox - 38} y={oy + bh}
          text={`${drawHeight.toFixed(1)} m`} fontSize={12} fontStyle="bold"
          fill={theme === "dark" ? "#94a3b8" : "#64748b"} rotation={-90}
          width={bh} align="center" />
      </Layer>
    </Stage>
  );
};

/* ────────── VISTA ISOMÉTRICA ────────── */
const VistaIsometrica: React.FC<ViewProps> = ({
  filas, cols, largoEfectivo, anchoEfectivo, calLargo, calAncho, techoLargo, techoAncho,
  showNumeros, theme, stageScale, stagePos, onPosChange, onWheel, width, height, orientation,
  colaActiva, colaBase, colaAltura: _colaAltura, colaCantidad, franjas
}) => {
  const isHoriz = orientation === "horizontal";

  const totalAncho = cols > 0 ? (cols - 1) * anchoEfectivo + calAncho : 0;
  const totalLargo = filas > 0 ? (filas - 1) * largoEfectivo + calLargo : 0;
  const boundingWidth  = isHoriz ? totalLargo  : totalAncho;
  const boundingHeight = isHoriz ? totalAncho : totalLargo;

  const scaleX = width * 0.026;
  const scaleY = width * 0.013;
  const ox     = width / 2;
  const totalW = Math.max(boundingWidth,  isHoriz ? techoLargo : techoAncho);
  const totalH = Math.max(boundingHeight, isHoriz ? techoAncho : techoLargo);
  const oy     = height / 2 + (totalW + totalH) * scaleY / 2;

  const isoX = (mx: number, my: number) => ox + (mx - my) * scaleX;
  const isoY = (mx: number, my: number) => oy - (mx + my) * scaleY;

  const calaminas = useMemo(() => {
    const items: { r: number; c: number; points: number[] }[] = [];
    for (let r = 0; r < filas; r++) {
      for (let c = 0; c < cols; c++) {
        const x_l = c * anchoEfectivo;
        const y_l = r * largoEfectivo;
        const x0  = isHoriz ? y_l : x_l;
        const y0  = isHoriz ? x_l : y_l;
        const w   = isHoriz ? calLargo : calAncho;
        const h   = isHoriz ? calAncho : calLargo;
        const pts = [
          isoX(x0, y0),         isoY(x0, y0),
          isoX(x0 + w, y0),     isoY(x0 + w, y0),
          isoX(x0 + w, y0 + h), isoY(x0 + w, y0 + h),
          isoX(x0, y0 + h),     isoY(x0, y0 + h),
        ];
        items.push({ r, c, points: pts });
      }
    }
    return items;
  }, [filas, cols, anchoEfectivo, largoEfectivo, calAncho, calLargo, oy, isHoriz]);

  /* Isometric cola: draw franjas as parallelograms projected into iso space */
  const isoColaData = useMemo(() => {
    if (!colaActiva || franjas.length === 0) return [];
    const nFranjas = franjas.length;
    const sides = getSidesForCount(colaCantidad);
    const bw = boundingWidth;
    const bh = boundingHeight;

    return sides.map(side => {
      let p0x: number, p0y: number, p1x: number, p1y: number, apexX: number, apexY: number;
      switch (side) {
        case "left":
          p0x = 0; p0y = 0;  p1x = 0;  p1y = bh; apexX = -colaBase; apexY = 0;   break;
        case "right":
          p0x = bw; p0y = 0; p1x = bw; p1y = bh; apexX = bw + colaBase; apexY = 0; break;
        case "top":
          p0x = 0; p0y = 0;  p1x = bw; p1y = 0;  apexX = bw / 2; apexY = -colaBase; break;
        case "bottom":
        default:
          p0x = 0; p0y = bh; p1x = bw; p1y = bh; apexX = bw / 2; apexY = bh + colaBase; break;
      }

      const outline = [
        isoX(p0x, p0y), isoY(p0x, p0y),
        isoX(p1x, p1y), isoY(p1x, p1y),
        isoX(apexX, apexY), isoY(apexX, apexY),
      ];

      // Isometric franja strips
      const strips = franjas.map((f, idx) => {
        const t1 = idx / nFranjas;
        const t2 = (idx + 1) / nFranjas;

        const lx1 = p0x + t1 * (apexX - p0x); const ly1 = p0y + t1 * (apexY - p0y);
        const rx1 = p1x + t1 * (apexX - p1x); const ry1 = p1y + t1 * (apexY - p1y);
        const lx2 = p0x + t2 * (apexX - p0x); const ly2 = p0y + t2 * (apexY - p0y);
        const rx2 = p1x + t2 * (apexX - p1x); const ry2 = p1y + t2 * (apexY - p1y);

        return {
          points: [
            isoX(lx1, ly1), isoY(lx1, ly1),
            isoX(rx1, ry1), isoY(rx1, ry1),
            isoX(rx2, ry2), isoY(rx2, ry2),
            isoX(lx2, ly2), isoY(lx2, ly2),
          ],
          fill: idx % 2 === 0 ? "rgba(186,117,23,0.5)" : "rgba(154,95,18,0.5)",
          altura: f.altura,
        };
      });

      return { outline, strips };
    });
  }, [colaActiva, franjas, colaCantidad, boundingWidth, boundingHeight, colaBase, oy]);

  const border = [
    isoX(0, 0),                  isoY(0, 0),
    isoX(boundingWidth, 0),      isoY(boundingWidth, 0),
    isoX(boundingWidth, boundingHeight), isoY(boundingWidth, boundingHeight),
    isoX(0, boundingHeight),     isoY(0, boundingHeight),
  ];

  return (
    <Stage
      width={width} height={height}
      scaleX={stageScale} scaleY={stageScale}
      x={stagePos.x} y={stagePos.y}
      draggable
      onDragEnd={(e) => { const s = e.target.getStage(); if (s) onPosChange({ x: s.x(), y: s.y() }); }}
      onWheel={onWheel}
    >
      <Layer>
        {calaminas.map(({ r, c, points }, idx) => (
          <Group key={idx}>
            <Line points={points} closed fill="#5DCAA5" opacity={0.5} stroke="#1D9E75" strokeWidth={0.8} />
            {showNumeros && (
              <Text x={(points[0] + points[4]) / 2 - 8} y={(points[1] + points[5]) / 2 - 6}
                text={String(r * cols + c + 1)} fontSize={11} fontStyle="bold"
                fill={theme === "dark" ? "#f8fafc" : "#0f172a"} />
            )}
          </Group>
        ))}

        {/* Iso colas con franjas */}
        {isoColaData.map(({ outline, strips }, sIdx) => (
          <Group key={`iso-cola-${sIdx}`}>
            {strips.map(({ points, fill }, i) => (
              <Line key={`iso-strip-${i}`} points={points} closed
                fill={fill} stroke="rgba(239,159,39,0.6)" strokeWidth={0.6} />
            ))}
            <Line points={outline} closed stroke="rgba(239,159,39,0.9)" strokeWidth={1.5} />
          </Group>
        ))}

        <Line points={border} closed stroke="#E24B4A" strokeWidth={1.5} dash={[5, 3]} />
      </Layer>
    </Stage>
  );
};

export default PasoPlano2D;
