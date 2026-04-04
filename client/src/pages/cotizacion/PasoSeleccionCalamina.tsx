import React from "react";
import { CSpinner } from "@coreui/react";
import { useProductos } from "../../hooks/useProductos";
import type { Producto } from "../../types/producto.types";

interface Props {
  productoSeleccionado: Producto | null;
  onSeleccionar: (p: Producto) => void;
}

const PasoSeleccionCalamina: React.FC<Props> = ({ productoSeleccionado, onSeleccionar }) => {
  const { productos, loading } = useProductos();

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div className="animate-in">
      <h5 className="fw-bold mb-1">Selecciona un tipo de calamina</h5>
      <p className="text-secondary mb-4" style={{ fontSize: ".85rem" }}>
        Elige el producto base para calcular la distribución del techo.
      </p>

      <div className="producto-grid">
        {productos.map((p) => {
          const isSelected = productoSeleccionado?.id_producto === p.id_producto;
          return (
            <div
              key={p.id_producto}
              className={`producto-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSeleccionar(p)}
              id={`producto-card-${p.id_producto}`}
            >
              <div className="check-icon">✓</div>
              <div className="prod-nombre">{p.tipo_producto?.nombre ?? "Producto"}</div>
              <div className="prod-medidas">
                {Number(p.medida_largo).toFixed(2)} m × {Number(p.medida_ancho).toFixed(2)} m
              </div>
              {p.descripcion && (
                <div className="text-secondary mt-2" style={{ fontSize: ".78rem" }}>
                  {p.descripcion}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {productos.length === 0 && !loading && (
        <div className="text-center text-secondary py-5">
          <div style={{ fontSize: "2.5rem", opacity: .3 }}>📦</div>
          <p className="mt-2">No hay productos registrados.</p>
        </div>
      )}
    </div>
  );
};

export default PasoSeleccionCalamina;
