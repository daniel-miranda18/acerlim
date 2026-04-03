import { useState, useEffect, useMemo } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CSpinner,
} from "@coreui/react";
import { useProveedores } from "../../hooks/useProveedores";
import type { Lote, CrearLoteDTO } from "../../types/lote.types";

interface LoteFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CrearLoteDTO) => Promise<void>;
  lote: Lote | null;
  loading: boolean;
}

export default function LoteForm({
  visible,
  onClose,
  onSubmit,
  lote,
  loading,
}: LoteFormProps) {
  const { proveedores } = useProveedores();
  const [formData, setFormData] = useState<CrearLoteDTO>({
    codigo_lote: "",
    id_proveedor: null,
    fecha_ingreso: new Date().toISOString().substring(0, 10),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredProveedores = useMemo(() => {
    return proveedores.filter((p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [proveedores, searchTerm]);

  useEffect(() => {
    if (visible) {
      if (lote) {
        setFormData({
          codigo_lote: lote.codigo_lote,
          id_proveedor: lote.id_proveedor,
          fecha_ingreso: lote.fecha_ingreso?.substring(0, 10) || "",
        });
        setSearchTerm(lote.proveedor_rel?.nombre || "");
      } else {
        setFormData({
          codigo_lote: "",
          id_proveedor: null,
          fecha_ingreso: new Date().toISOString().substring(0, 10),
        });
        setSearchTerm("");
      }
    }
  }, [lote, visible]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static" size="lg">
      <CModalHeader closeButton>
        <CModalTitle className="fw-bold">
          {lote ? "Actualizar Lote" : "Registrar Nuevo Lote"}
        </CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody className="p-4">
          <CRow className="g-4">
            <CCol md={6}>
              <CFormLabel className="fw-medium">Código de Lote</CFormLabel>
              <CFormInput
                name="codigo_lote"
                placeholder="Ej: LT-2024-001"
                value={formData.codigo_lote}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel className="fw-medium">Fecha de Ingreso</CFormLabel>
              <CFormInput
                type="date"
                name="fecha_ingreso"
                value={formData.fecha_ingreso}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={12}>
              <CFormLabel className="fw-medium">Proveedor (Buscador)</CFormLabel>
              <div className="position-relative">
                <CFormInput
                  placeholder="Escriba para buscar proveedor..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  autoComplete="off"
                  required
                />
                {showDropdown && (
                  <ul 
                    className="dropdown-menu show w-100 shadow-sm border-primary-subtle" 
                    style={{ 
                      maxHeight: "200px", 
                      overflowY: "auto",
                      top: "100%",
                      zIndex: 1050
                    }}
                  >
                    {filteredProveedores.length === 0 ? (
                      <li className="dropdown-item text-secondary small py-2">
                        No se encontraron proveedores que coincidan
                      </li>
                    ) : (
                      filteredProveedores.map((p) => (
                        <li
                          key={p.id_proveedor}
                          className="dropdown-item py-2 d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, id_proveedor: p.id_proveedor }));
                            setSearchTerm(p.nombre);
                            setShowDropdown(false);
                          }}
                        >
                          <span>{p.nombre}</span>
                          <small className="text-secondary">{p.contacto || "Sin contacto"}</small>
                        </li>
                      ))
                    )}
                  </ul>
                )}
                {showDropdown && (
                  <div 
                    className="position-fixed top-0 start-0 w-100 h-100" 
                    style={{ zIndex: 1040 }} 
                    onClick={() => setShowDropdown(false)} 
                  />
                )}
              </div>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter className="border-top-0 p-4">
          <CButton color="secondary" variant="ghost" onClick={onClose}>
            Cancelar
          </CButton>
          <CButton color="primary" type="submit" disabled={loading} className="px-4">
            {loading ? <CSpinner size="sm" className="me-2" /> : null}
            {lote ? "Actualizar Lote" : "Crear Lote"}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
}
