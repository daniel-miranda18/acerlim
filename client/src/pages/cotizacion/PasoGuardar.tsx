import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CFormInput, CFormSelect, CButton, CSpinner } from "@coreui/react";
import toast from "react-hot-toast";
import { dibujoService } from "../../services/dibujo.service";
import { pedidoService } from "../../services/pedido.service";
import { precioService } from "../../services/precio.service";
import type { Producto } from "../../types/producto.types";
import type { CalculoResult } from "../../hooks/useCalculo";
import type { PrecioMetro } from "../../types/precio.types";

interface Props {
  producto: Producto | null;
  calculo: CalculoResult | null;
  imagenBase64: string;
}

const PasoGuardar: React.FC<Props> = ({ producto, calculo, imagenBase64 }) => {
  const navigate = useNavigate();
  const [nombreCliente, setNombreCliente] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [savingTotal, setSavingTotal] = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState(false);

  // Precios paramétricos
  const [precios, setPrecios] = useState<PrecioMetro[]>([]);
  const [loadingPrecios, setLoadingPrecios] = useState(true);
  const [precioSeleccionado, setPrecioSeleccionado] = useState<PrecioMetro | null>(null);

  useEffect(() => {
    const fetchPrecios = async () => {
      try {
        const res = await precioService.listar();
        const data = res.data.data;
        setPrecios(data);
        if (data.length > 0) setPrecioSeleccionado(data[0]);
      } catch (err) {
        console.error("Error al cargar precios:", err);
        toast.error("No se pudieron cargar los precios");
      } finally {
        setLoadingPrecios(false);
      }
    };
    fetchPrecios();
  }, []);

  if (!producto || !calculo) {
    return (
      <div className="animate-in text-center py-5 text-secondary">
        <div style={{ fontSize: "2.5rem", opacity: .3 }}>💾</div>
        <p className="mt-2">Completa los pasos anteriores para guardar.</p>
      </div>
    );
  }

  const precioPorMetro = precioSeleccionado?.precio_por_metro ?? 0;
  const totalMetrosLineales = calculo.totalMetrosLineales;
  const totalAmount = +(totalMetrosLineales * precioPorMetro).toFixed(2);

  const handleGuardarTotal = async () => {
    if (!nombreCliente.trim()) {
      toast.error("Ingresa el nombre del cliente");
      return;
    }
    if (!precioSeleccionado) {
      toast.error("Selecciona un precio por metro lineal");
      return;
    }

    setSavingTotal(true);
    try {
      // 1. Guardar dibujo primero
      const formData = new FormData();
      formData.append("id_producto", producto.id_producto.toString());
      formData.append("largo", calculo.datosJson.techo_largo.toString());
      formData.append("ancho", calculo.datosJson.techo_ancho.toString());
      formData.append("area_plana", (calculo.datosJson.techo_largo * calculo.datosJson.techo_ancho).toString());
      formData.append("datos_json", JSON.stringify(calculo.datosJson));

      if (imagenBase64) {
        const response = await fetch(imagenBase64);
        const blob = await response.blob();
        formData.append("imagen", blob, "plano.png");
      }

      const resDibujo = await dibujoService.crear(formData as any);
      const idDibujo = resDibujo.data.data.id_dibujo;

      // 2. Crear pedido asociado
      await pedidoService.crear({
        nombre_cliente: nombreCliente.trim(),
        fecha,
        id_dibujo: idDibujo,
        subtotal: totalAmount,
        total: totalAmount,
        detalles: [
          {
            id_producto: producto.id_producto,
            cantidad: totalMetrosLineales,
            precio_unitario: precioPorMetro,
          },
        ],
      });
      setPedidoCreado(true);
      toast.success("Cotización completada y pedido creado exitosamente");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al completar la cotización");
      console.error(err);
    } finally {
      setSavingTotal(false);
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
          <hr className="my-2" />
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: ".82rem" }}>
            <span className="text-secondary">Largo por calamina</span>
            <span className="fw-bold">{calculo.datosJson.cal_largo.toFixed(2)} m</span>
          </div>
          <div className="d-flex justify-content-between" style={{ fontSize: ".88rem" }}>
            <span className="fw-bold" style={{ color: "#059669" }}>Total metros lineales</span>
            <span className="fw-bold" style={{ color: "#059669", fontSize: "1rem" }}>
              {totalMetrosLineales.toFixed(2)} ml
            </span>
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
          <label>Precio por metro lineal ({precioSeleccionado?.moneda ?? "BOB"})</label>
          {loadingPrecios ? (
            <div className="d-flex align-items-center gap-2 py-2">
              <CSpinner size="sm" /> <small className="text-secondary">Cargando precios...</small>
            </div>
          ) : precios.length === 0 ? (
            <div className="text-danger" style={{ fontSize: ".82rem" }}>
              No hay precios configurados. Ve a Configuración → Precios para crear uno.
            </div>
          ) : (
            <CFormSelect
              value={precioSeleccionado?.id_precio ?? ""}
              onChange={(e) => {
                const found = precios.find((p) => p.id_precio === Number(e.target.value));
                setPrecioSeleccionado(found ?? null);
              }}
              id="select-precio-metro"
            >
              {precios.map((p) => (
                <option key={p.id_precio} value={p.id_precio}>
                  {p.nombre} — Bs. {Number(p.precio_por_metro).toFixed(2)} / ml
                </option>
              ))}
            </CFormSelect>
          )}
        </div>

        {precioSeleccionado && (
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
              <div style={{ fontSize: ".78rem", opacity: .7, textAlign: "right" }}>
                <div>{calculo.totalGeneral} cal × {calculo.datosJson.cal_largo.toFixed(2)} m = {totalMetrosLineales.toFixed(2)} ml</div>
                <div>{totalMetrosLineales.toFixed(2)} ml × Bs. {precioPorMetro.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex gap-3 mt-4">
          <CButton
            color="primary"
            className="flex-fill d-flex align-items-center justify-content-center gap-2 py-2 fs-5 fw-bold"
            onClick={handleGuardarTotal}
            disabled={savingTotal || pedidoCreado || !nombreCliente.trim() || !precioSeleccionado}
            style={{ minHeight: "50px" }}
          >
            {savingTotal ? <CSpinner size="sm" /> : null}
            {pedidoCreado ? "✓ Cotización Guardada" : "Guardar"}
          </CButton>
        </div>

        {pedidoCreado && (
          <div className="mt-3 p-3 rounded text-center d-flex flex-column align-items-center" style={{
            background: "rgba(34,197,94,.1)",
            border: "1px solid rgba(34,197,94,.3)",
            color: "#16a34a",
            fontSize: ".9rem",
            fontWeight: 600
          }}>
            <span className="mb-3">¡Cotización completada exitosamente! El dibujo y pedido han sido registrados.</span>
            <CButton 
              color="success" 
              variant="outline" 
              onClick={() => navigate("/pedidos")}
              className="px-4 py-2"
            >
              Ver Pedidos →
            </CButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasoGuardar;
