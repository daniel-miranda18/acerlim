import React, { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { Stage, Layer, Rect, Text, Line, Group, Shape } from "react-konva";
import { toPng } from "html-to-image";
import { CButton, CSpinner } from "@coreui/react";
import type { Producto } from "../../types/producto.types";
import type { CalculoResult, ColaStrip } from "../../hooks/useCalculo";
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

const PasoPlano2D: React.FC<Props> = ({
  producto, calculo, techoLargo, techoAncho, onImagenGenerada,
  colaActiva, colaBase, colaAltura, colaCantidad
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("superior");
  const [orientation, setOrientation] = useState<OrientationMode>("horizontal");
  const [showNumeros, setShowNumeros] = useState(true);
  const [exporting, setExporting] = useState(false);
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

  const handleZoomIn = () => setStageScale((s) => s * 1.2);
  const handleZoomOut = () => setStageScale((s) => s / 1.2);
  const handleResetZoom = () => { setStageScale(1); setStagePos({ x: 0, y: 0 }); };

  const handleExport = useCallback(async () => {
    if (!containerRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(containerRef.current, { quality: 0.95, pixelRatio: 2 });
      onImagenGenerada(dataUrl);
    } catch (err) {
      console.error("Error exporting image:", err);
    } finally {
      setExporting(false);
    }
  }, [onImagenGenerada]);

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

  return (
    <div className="animate-in">
      <h5 className="fw-bold mb-1">Plano 2D del techo</h5>
      <p className="text-secondary mb-3" style={{ fontSize: ".85rem" }}>
        Visualización de la distribución de calaminas con traslape.
      </p>

      <div className="canvas-wrapper">
        <div className="canvas-toolbar">
          <button className={`btn-view ${viewMode === "superior" ? "active" : ""}`} onClick={() => setViewMode("superior")}>Vista Superior</button>
          <button className={`btn-view ${viewMode === "isometrica" ? "active" : ""}`} onClick={() => setViewMode("isometrica")}>Vista Isométrica</button>

          <div className="ms-2 border-start ps-2 d-flex align-items-center gap-1" style={{ borderColor: 'var(--cui-border-color)' }}>
            <button className={`btn-view ${orientation === "horizontal" ? "active" : ""}`} onClick={() => setOrientation("horizontal")}>Horizontal</button>
            <button className={`btn-view ${orientation === "vertical" ? "active" : ""}`} onClick={() => setOrientation("vertical")}>Vertical</button>
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

          <div className="ms-auto">
            <CButton color="primary" size="sm" className="d-flex align-items-center gap-1" onClick={handleExport} disabled={exporting}>
              {exporting ? <CSpinner size="sm" /> : "📷"} Exportar imagen
            </CButton>
          </div>
        </div>

        <div ref={containerRef} id="konva-container" className="canvas-grid-bg" style={{ height: '520px' }}>
          {viewMode === "superior" ? (
            <VistaSuperiore
              filas={filas} cols={cols} largoEfectivo={largoEfectivo} anchoEfectivo={anchoEfectivo}
              calLargo={calLargo} calAncho={calAncho} techoLargo={techoLargo} techoAncho={techoAncho}
              showNumeros={showNumeros} theme={theme} stageScale={stageScale} stagePos={stagePos}
              onPosChange={setStagePos} onWheel={handleWheel} width={dimensions.width} height={dimensions.height}
              orientation={orientation} colaActiva={colaActiva} colaBase={colaBase} colaAltura={colaAltura}
              colaCantidad={colaCantidad} colaStrips={calculo.colaPato.strips}
            />
          ) : (
            <VistaIsometrica
              filas={filas} cols={cols} largoEfectivo={largoEfectivo} anchoEfectivo={anchoEfectivo}
              calLargo={calLargo} calAncho={calAncho} techoLargo={techoLargo} techoAncho={techoAncho}
              showNumeros={showNumeros} theme={theme} stageScale={stageScale} stagePos={stagePos}
              onPosChange={setStagePos} onWheel={handleWheel} width={dimensions.width} height={dimensions.height}
              orientation={orientation} colaActiva={colaActiva} colaBase={colaBase} colaAltura={colaAltura}
              colaCantidad={colaCantidad} colaStrips={calculo.colaPato.strips}
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
              Cortes cola de pato
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
};

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
  colaStrips: ColaStrip[];
}

/* ────────── TRIANGLE HELPERS ────────── */
function getSidesForCount(count: number): ("left" | "right" | "top" | "bottom")[] {
  switch (count) {
    case 1: return ["left"];
    case 2: return ["left", "right"];
    case 3: return ["left", "right", "top"];
    case 4: return ["left", "right", "top", "bottom"];
    default: return ["left"];
  }
}

/** Returns 3 vertices [x1,y1, x2,y2, x3,y3] where (x1,y1)-(x2,y2) is the base and (x3,y3) is apex */
function getTriangleVertices(
  side: "left" | "right" | "top" | "bottom",
  ox: number, oy: number, bw: number, bh: number,
  colaAlturaPx: number
): number[] {
  switch (side) {
    case "left":
      return [ox, oy, ox, oy + bh, ox - colaAlturaPx, oy + bh / 2];
    case "right":
      return [ox + bw, oy, ox + bw, oy + bh, ox + bw + colaAlturaPx, oy + bh / 2];
    case "top":
      return [ox, oy, ox + bw, oy, ox + bw / 2, oy - colaAlturaPx];
    case "bottom":
      return [ox, oy + bh, ox + bw, oy + bh, ox + bw / 2, oy + bh + colaAlturaPx];
  }
}

/** Compute strip polygons within a triangle. Each strip is a quad (trapezoid) from base toward apex. */
function computeTriangleStrips(
  triPoints: number[], // [x1,y1, x2,y2, x3,y3]
  strips: ColaStrip[],
  numStrips: number
): { polygon: number[]; anchoCorte: number; fila: number }[] {
  const [x1, y1, x2, y2, x3, y3] = triPoints;
  const result: { polygon: number[]; anchoCorte: number; fila: number }[] = [];

  for (let i = 0; i < numStrips && i < strips.length; i++) {
    const t1 = i / numStrips;
    const t2 = Math.min((i + 1) / numStrips, 1);

    // Interpolate along edge P0→P2 (left edge of triangle)
    const tlx = x1 + t1 * (x3 - x1);
    const tly = y1 + t1 * (y3 - y1);
    const blx = x1 + t2 * (x3 - x1);
    const bly = y1 + t2 * (y3 - y1);

    // Interpolate along edge P1→P2 (right edge of triangle)
    const trx = x2 + t1 * (x3 - x2);
    const try_ = y2 + t1 * (y3 - y2);
    const brx = x2 + t2 * (x3 - x2);
    const bry = y2 + t2 * (y3 - y2);

    result.push({
      polygon: [tlx, tly, trx, try_, brx, bry, blx, bly],
      anchoCorte: strips[i].anchoCorte,
      fila: strips[i].fila,
    });
  }

  return result;
}

/* ────────── VISTA SUPERIOR ────────── */
const VistaSuperiore: React.FC<ViewProps> = ({
  filas, cols, largoEfectivo, anchoEfectivo, calLargo, calAncho, techoLargo, techoAncho,
  showNumeros, theme, stageScale, stagePos, onPosChange, onWheel, width, height, orientation,
  colaActiva, colaBase: _colaBase, colaAltura, colaCantidad, colaStrips
}) => {
  const isHoriz = orientation === "horizontal";
  const drawWidth = isHoriz ? techoLargo : techoAncho;
  const drawHeight = isHoriz ? techoAncho : techoLargo;

  const totalAncho = cols > 0 ? (cols - 1) * anchoEfectivo + calAncho : 0;
  const totalLargo = filas > 0 ? (filas - 1) * largoEfectivo + calLargo : 0;
  const boundingWidth = isHoriz ? totalLargo : totalAncho;
  const boundingHeight = isHoriz ? totalAncho : totalLargo;

  // Extra space for colas
  const hasLeft = colaActiva && colaCantidad >= 1;
  const hasRight = colaActiva && colaCantidad >= 2;
  const hasTop = colaActiva && colaCantidad >= 3;
  const hasBottom = colaActiva && colaCantidad >= 4;
  const colaExtraW = (hasLeft ? colaAltura : 0) + (hasRight ? colaAltura : 0);
  const colaExtraH = (hasTop ? colaAltura : 0) + (hasBottom ? colaAltura : 0);
  const fitWidth = Math.max(boundingWidth, drawWidth) + colaExtraW;
  const fitHeight = Math.max(boundingHeight, drawHeight) + colaExtraH;

  const ppm = useMemo(() => Math.min(
    (width - PADDING * 2) / fitWidth,
    (height - PADDING * 2) / fitHeight
  ), [fitWidth, fitHeight, width, height]);

  const offsetX = useMemo(() => {
    const leftPad = hasLeft ? colaAltura * ppm : 0;
    return (width - fitWidth * ppm) / 2 + leftPad;
  }, [fitWidth, ppm, width, hasLeft, colaAltura]);
  const offsetY = useMemo(() => {
    const topPad = hasTop ? colaAltura * ppm : 0;
    return (height - fitHeight * ppm) / 2 + topPad;
  }, [fitHeight, ppm, height, hasTop, colaAltura]);

  const calaminas = useMemo(() => {
    const items: { r: number; c: number; x: number; y: number; w: number; h: number }[] = [];
    for (let r = 0; r < filas; r++) {
      for (let c = 0; c < cols; c++) {
        const x_logical = c * anchoEfectivo;
        const y_logical = r * largoEfectivo;
        const x = offsetX + (isHoriz ? y_logical : x_logical) * ppm;
        const y = offsetY + (isHoriz ? x_logical : y_logical) * ppm;
        const w = (isHoriz ? calLargo : calAncho) * ppm;
        const h = (isHoriz ? calAncho : calLargo) * ppm;
        items.push({ r, c, x, y, w: Math.max(w, 0), h: Math.max(h, 0) });
      }
    }
    return items;
  }, [filas, cols, anchoEfectivo, largoEfectivo, calAncho, calLargo, ppm, offsetX, offsetY, isHoriz]);

  // Compute cola triangle strips
  const allColaStrips = useMemo(() => {
    if (!colaActiva || colaStrips.length === 0) return [];
    const sides = getSidesForCount(colaCantidad);
    const bw = boundingWidth * ppm;
    const bh = boundingHeight * ppm;
    const numStrips = colaStrips.length;

    return sides.map(side => {
      const triPts = getTriangleVertices(side, offsetX, offsetY, bw, bh, colaAltura * ppm);
      const stripShapes = computeTriangleStrips(triPts, colaStrips, numStrips);
      return { side, triPts, stripShapes };
    });
  }, [colaActiva, colaCantidad, boundingWidth, boundingHeight, colaAltura, ppm, offsetX, offsetY, colaStrips]);

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
        {/* Calaminas del techo */}
        {calaminas.map(({ r, c, x, y, w, h }, idx) => (
          <Group key={idx}>
            <Rect x={x} y={y} width={w} height={h} fill="#5DCAA5" opacity={0.65} stroke="#1D9E75" strokeWidth={1} />
            {showNumeros && (
              <Text x={x} y={y} width={w} height={h} text={String(r * cols + c + 1)}
                fontSize={Math.max(10, Math.min(16, w * 0.25))} fontStyle="bold"
                fill={theme === "dark" ? "#f8fafc" : "#0f172a"} align="center" verticalAlign="middle" />
            )}
          </Group>
        ))}

        {/* Cola de pato — franjas con cortes */}
        {allColaStrips.map(({ side, triPts, stripShapes }, sIdx) => (
          <Group key={`cola-${side}-${sIdx}`}>
            {/* Franjas individuales */}
            {stripShapes.map(({ polygon, anchoCorte, fila: _fila }, stripIdx) => (
              <Group key={`strip-${stripIdx}`}>
                <Shape
                  sceneFunc={(ctx, shape) => {
                    ctx.beginPath();
                    ctx.moveTo(polygon[0], polygon[1]);
                    for (let i = 2; i < polygon.length; i += 2) {
                      ctx.lineTo(polygon[i], polygon[i + 1]);
                    }
                    ctx.closePath();
                    ctx.fillStrokeShape(shape);
                  }}
                  fill={stripIdx % 2 === 0 ? "rgba(186,117,23,0.55)" : "rgba(154,95,18,0.55)"}
                  stroke="rgba(239,159,39,0.7)"
                  strokeWidth={0.8}
                />
                {/* Etiqueta con ancho del corte */}
                {showNumeros && (
                  <Text
                    x={(polygon[0] + polygon[2] + polygon[4] + polygon[6]) / 4 - 18}
                    y={(polygon[1] + polygon[3] + polygon[5] + polygon[7]) / 4 - 6}
                    text={`${anchoCorte.toFixed(2)}m`}
                    fontSize={9}
                    fontStyle="bold"
                    fill={theme === "dark" ? "#fbbf24" : "#78350f"}
                  />
                )}
              </Group>
            ))}
            {/* Borde del triángulo completo */}
            <Line
              points={[triPts[0], triPts[1], triPts[2], triPts[3], triPts[4], triPts[5]]}
              closed stroke="rgba(239,159,39,0.9)" strokeWidth={1.5}
            />
          </Group>
        ))}

        {/* Borde del techo */}
        <Rect x={offsetX} y={offsetY} width={boundingWidth * ppm} height={boundingHeight * ppm}
          stroke="#E24B4A" strokeWidth={1.5} dash={[5, 3]} />

        {/* Cotas */}
        <Text x={offsetX} y={offsetY - 22} width={boundingWidth * ppm}
          text={`${drawWidth.toFixed(1)} m`} fontSize={12} fontStyle="bold"
          fill={theme === "dark" ? "#94a3b8" : "#64748b"} align="center" />
        <Text x={offsetX - 38} y={offsetY + boundingHeight * ppm}
          text={`${drawHeight.toFixed(1)} m`} fontSize={12} fontStyle="bold"
          fill={theme === "dark" ? "#94a3b8" : "#64748b"} rotation={-90}
          width={boundingHeight * ppm} align="center" />
      </Layer>
    </Stage>
  );
};

/* ────────── VISTA ISOMÉTRICA ────────── */
const VistaIsometrica: React.FC<ViewProps> = ({
  filas, cols, largoEfectivo, anchoEfectivo, calLargo, calAncho, techoLargo, techoAncho,
  showNumeros, theme, stageScale, stagePos, onPosChange, onWheel, width, height, orientation,
  colaActiva, colaBase: _colaBase2, colaAltura, colaCantidad, colaStrips
}) => {
  const isHoriz = orientation === "horizontal";

  const totalAncho = cols > 0 ? (cols - 1) * anchoEfectivo + calAncho : 0;
  const totalLargo = filas > 0 ? (filas - 1) * largoEfectivo + calLargo : 0;
  const boundingWidth = isHoriz ? totalLargo : totalAncho;
  const boundingHeight = isHoriz ? totalAncho : totalLargo;

  const scaleX = width * 0.026;
  const scaleY = width * 0.013;
  const ox = width / 2;
  const totalW = Math.max(boundingWidth, isHoriz ? techoLargo : techoAncho);
  const totalH = Math.max(boundingHeight, isHoriz ? techoAncho : techoLargo);
  const oy = height / 2 + (totalW + totalH) * scaleY / 2;

  const isoX = (mx: number, my: number) => ox + (mx - my) * scaleX;
  const isoY = (mx: number, my: number) => oy - (mx + my) * scaleY;

  const calaminas = useMemo(() => {
    const items: { r: number; c: number; points: number[] }[] = [];
    for (let r = 0; r < filas; r++) {
      for (let c = 0; c < cols; c++) {
        const x_logical = c * anchoEfectivo;
        const y_logical = r * largoEfectivo;
        const x0 = isHoriz ? y_logical : x_logical;
        const y0 = isHoriz ? x_logical : y_logical;
        const w = isHoriz ? calLargo : calAncho;
        const h = isHoriz ? calAncho : calLargo;
        const points = [
          isoX(x0, y0), isoY(x0, y0),
          isoX(x0 + w, y0), isoY(x0 + w, y0),
          isoX(x0 + w, y0 + h), isoY(x0 + w, y0 + h),
          isoX(x0, y0 + h), isoY(x0, y0 + h),
        ];
        items.push({ r, c, points });
      }
    }
    return items;
  }, [filas, cols, anchoEfectivo, largoEfectivo, calAncho, calLargo, oy, isHoriz]);

  // Isometric cola triangles with strip lines
  const isoColaData = useMemo(() => {
    if (!colaActiva || colaStrips.length === 0) return [];
    const sides = getSidesForCount(colaCantidad);
    const bw = boundingWidth;
    const bh = boundingHeight;
    const numStrips = colaStrips.length;

    return sides.map(side => {
      let p0x: number, p0y: number, p1x: number, p1y: number, apexX: number, apexY: number;
      switch (side) {
        case "left":
          p0x = 0; p0y = 0; p1x = 0; p1y = bh; apexX = -colaAltura; apexY = bh / 2; break;
        case "right":
          p0x = bw; p0y = 0; p1x = bw; p1y = bh; apexX = bw + colaAltura; apexY = bh / 2; break;
        case "top":
          p0x = 0; p0y = 0; p1x = bw; p1y = 0; apexX = bw / 2; apexY = -colaAltura; break;
        case "bottom":
        default:
          p0x = 0; p0y = bh; p1x = bw; p1y = bh; apexX = bw / 2; apexY = bh + colaAltura; break;
      }

      const triOutline = [
        isoX(p0x, p0y), isoY(p0x, p0y),
        isoX(p1x, p1y), isoY(p1x, p1y),
        isoX(apexX, apexY), isoY(apexX, apexY),
      ];

      // Strip divider lines within the triangle
      const stripLines: { points: number[]; anchoCorte: number }[] = [];
      for (let i = 0; i < numStrips; i++) {
        const t1 = i / numStrips;
        const t2 = Math.min((i + 1) / numStrips, 1);

        // Lerp base edges to apex
        const lx1 = p0x + t1 * (apexX - p0x);
        const ly1 = p0y + t1 * (apexY - p0y);
        const rx1 = p1x + t1 * (apexX - p1x);
        const ry1 = p1y + t1 * (apexY - p1y);
        const lx2 = p0x + t2 * (apexX - p0x);
        const ly2 = p0y + t2 * (apexY - p0y);
        const rx2 = p1x + t2 * (apexX - p1x);
        const ry2 = p1y + t2 * (apexY - p1y);

        stripLines.push({
          points: [
            isoX(lx1, ly1), isoY(lx1, ly1),
            isoX(rx1, ry1), isoY(rx1, ry1),
            isoX(rx2, ry2), isoY(rx2, ry2),
            isoX(lx2, ly2), isoY(lx2, ly2),
          ],
          anchoCorte: colaStrips[i]?.anchoCorte ?? 0,
        });
      }

      return { triOutline, stripLines };
    });
  }, [colaActiva, colaCantidad, boundingWidth, boundingHeight, colaAltura, colaStrips, oy]);

  const border = [
    isoX(0, 0), isoY(0, 0),
    isoX(boundingWidth, 0), isoY(boundingWidth, 0),
    isoX(boundingWidth, boundingHeight), isoY(boundingWidth, boundingHeight),
    isoX(0, boundingHeight), isoY(0, boundingHeight),
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
        {isoColaData.map(({ triOutline, stripLines }, sIdx) => (
          <Group key={`iso-cola-${sIdx}`}>
            {stripLines.map(({ points, anchoCorte: _ac }, i) => (
              <Line key={`iso-strip-${i}`} points={points} closed
                fill={i % 2 === 0 ? "rgba(186,117,23,0.5)" : "rgba(154,95,18,0.5)"}
                stroke="rgba(239,159,39,0.6)" strokeWidth={0.6} />
            ))}
            <Line points={triOutline} closed stroke="rgba(239,159,39,0.9)" strokeWidth={1.5} />
          </Group>
        ))}

        <Line points={border} closed stroke="#E24B4A" strokeWidth={1.5} dash={[5, 3]} />
      </Layer>
    </Stage>
  );
};

export default PasoPlano2D;
