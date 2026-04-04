import React, { useState } from "react";
import { CFormInput, CButton, CSpinner } from "@coreui/react";
import toast from "react-hot-toast";
import { dibujoService } from "../../services/dibujo.service";
import { pedidoService } from "../../services/pedido.service";
import type { Producto } from "../../types/producto.types";
import type { CalculoResult } from "../../hooks/useCalculo";

interface Props {
  producto: Producto | null;
  calculo: CalculoResult | null;
  imagenBase64: string;
}

const PasoGuardar: React.FC<Props> = ({ producto, calculo, imagenBase64 }) => {
  const [nombreCliente, setNombreCliente] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [savingDibujo, setSavingDibujo] = useState(false);
  const [savingPedido, setSavingPedido] = useState(false);
  const [dibujoGuardado, setDibujoGuardado] = useState<number | null>(null);
  const [pedidoCreado, setPedidoCreado] = useState(false);

  if (!producto || !calculo) {
    return (
      <div className="animate-in text-center py-5 text-secondary">
        <div style={{ fontSize: "2.5rem", opacity: .3 }}>💾</div>
        <p className="mt-2">Completa los pasos anteriores para guardar.</p>
      </div>
    );
  }

  const totalAmount = calculo.totalGeneral * precioUnitario;

  const handleGuardarDibujo = async () => {
    setSavingDibujo(true);
    try {
      const res = await dibujoService.crear({
        id_producto: producto.id_producto,
        largo: calculo.datosJson.techo_largo,
        ancho: calculo.datosJson.techo_ancho,
        area_plana: calculo.datosJson.techo_largo * calculo.datosJson.techo_ancho,
        datos_json: JSON.stringify(calculo.datosJson),
        imagen_generada: imagenBase64 || undefined,
      });
      setDibujoGuardado(res.data.data.id_dibujo);
      toast.success("Dibujo guardado exitosamente");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al guardar el dibujo");
    } finally {
      setSavingDibujo(false);
    }
  };

  const handleCrearPedido = async () => {
    if (!nombreCliente.trim()) {
      toast.error("Ingresa el nombre del cliente");
      return;
    }
    if (precioUnitario <= 0) {
      toast.error("Ingresa un precio unitario válido");
      return;
    }

    setSavingPedido(true);
    try {
      await pedidoService.crear({
        nombre_cliente: nombreCliente.trim(),
        fecha,
        id_dibujo: dibujoGuardado ?? undefined,
        subtotal: totalAmount,
        total: totalAmount,
        detalles: [
          {
            id_producto: producto.id_producto,
            cantidad: calculo.totalGeneral,
            precio_unitario: precioUnitario,
          },
        ],
      });
      setPedidoCreado(true);
      toast.success("Pedido creado exitosamente");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al crear el pedido");
    } finally {
      setSavingPedido(false);
    }
  };

  return (
    <div className="animate-in">
      <h5 className="fw-bold mb-1">Guardar cotización</h5>
      <p className="text-secondary mb-4" style={{ fontSize: ".85rem" }}>
        Guarda el dibujo y crea un pedido para el cliente.
      </p>

      <div className="save-form">
        {/* Resumen */}
        <div className="p-3 rounded mb-4" style={{
          background: "linear-gradient(135deg, rgba(37,99,235,.08), rgba(6,182,212,.08))",
          border: "1px solid rgba(37,99,235,.15)"
        }}>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Producto</span>
            <span className="fw-bold">{producto.tipo_producto?.nombre}</span>
          </div>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Calaminas techo</span>
            <span className="fw-bold">{calculo.totalTecho} unidades</span>
          </div>
          {calculo.colaPato.activa && (
            <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
              <span className="text-secondary">Calaminas colas ({calculo.colaPato.cantidad}×)</span>
              <span className="fw-bold" style={{ color: "#d97706" }}>+{calculo.totalColas} unidades</span>
            </div>
          )}
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Total calaminas</span>
            <span className="fw-bold" style={{ color: "#2563EB" }}>{calculo.totalGeneral} unidades</span>
          </div>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Distribución techo</span>
            <span className="fw-bold">{calculo.filas} filas × {calculo.cols} columnas</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="form-group">
          <label>Nombre del cliente</label>
          <CFormInput
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            placeholder="Ej: Juan Pérez"
            id="input-nombre-cliente"
          />
        </div>

        <div className="form-group">
          <label>Fecha</label>
          <CFormInput
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            id="input-fecha"
          />
        </div>

        <div className="form-group">
          <label>Precio unitario por calamina (Bs.)</label>
          <CFormInput
            type="number"
            min={0}
            step={0.01}
            value={precioUnitario || ""}
            onChange={(e) => setPrecioUnitario(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            id="input-precio-unitario"
          />
        </div>

        {precioUnitario > 0 && (
          <div className="p-3 rounded mb-4" style={{
            background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
            color: "#fff"
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div style={{ fontSize: ".72rem", opacity: .7, textTransform: "uppercase", letterSpacing: ".5px" }}>Total estimado</div>
                <div className="fw-bold" style={{ fontSize: "1.4rem" }}>
                  Bs. {totalAmount.toFixed(2)}
                </div>
              </div>
              <div style={{ fontSize: ".78rem", opacity: .7 }}>
                {calculo.totalGeneral} × Bs. {precioUnitario.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="d-flex gap-3 mt-4">
          <CButton
            color="success"
            className="flex-fill d-flex align-items-center justify-content-center gap-2 py-2"
            onClick={handleGuardarDibujo}
            disabled={savingDibujo || !!dibujoGuardado}
          >
            {savingDibujo ? <CSpinner size="sm" /> : null}
            {dibujoGuardado ? "✓ Dibujo Guardado" : "Guardar Dibujo"}
          </CButton>

          <CButton
            color="primary"
            className="flex-fill d-flex align-items-center justify-content-center gap-2 py-2"
            onClick={handleCrearPedido}
            disabled={savingPedido || pedidoCreado || !nombreCliente.trim() || precioUnitario <= 0}
          >
            {savingPedido ? <CSpinner size="sm" /> : null}
            {pedidoCreado ? "✓ Pedido Creado" : "Crear Pedido"}
          </CButton>
        </div>

        {pedidoCreado && (
          <div className="mt-3 p-3 rounded text-center" style={{
            background: "rgba(34,197,94,.1)",
            border: "1px solid rgba(34,197,94,.3)",
            color: "#16a34a",
            fontSize: ".85rem",
            fontWeight: 600
          }}>
            ¡Cotización completada exitosamente! El dibujo y pedido han sido registrados.
          </div>
        )}
      </div>
    </div>
  );
};

export default PasoGuardar;
