import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,  
  CBadge,
  CSpinner,
} from "@coreui/react";
import {
  cilPlus,
  cilSearch,
  cilPencil,
  cilTrash,
  cilArrowTop,
  cilArrowBottom,
  cilCloudDownload,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { useBobinas } from "../../hooks/useBobinas";
import type { Bobina } from "../../types/bobina.types";
import BobinaForm from "./BobinaForm";
import ConfirmModal from "../../components/shared/ConfirmModal";
import { exportToExcel } from "../../utils/exportExcel";

export default function BobinasPage() {
  const { bobinas, stock, loading, crear, actualizar, eliminar } = useBobinas();
  
  const [globalFilterStock, setGlobalFilterStock] = useState("");
  const [sortingStock, setSortingStock] = useState<SortingState>([]);
  
  const [globalFilterHist, setGlobalFilterHist] = useState("");
  const [sortingHist, setSortingHist] = useState<SortingState>([]);

  const [formVisible, setFormVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedBobina, setSelectedBobina] = useState<Bobina | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const handleCrear = () => {
    setSelectedBobina(null);
    setFormErrors({});
    setFormVisible(true);
  };

  const handleEditar = (b: Bobina) => {
    setSelectedBobina(b);
    setFormErrors({});
    setFormVisible(true);
  };

  const handleEliminar = (b: Bobina) => {
    setSelectedBobina(b);
    setConfirmVisible(true);
  };

  const handleSubmit = async (data: Partial<Bobina>) => {
    setFormLoading(true);
    setFormErrors({});
    try {
      if (selectedBobina) {
        await actualizar(selectedBobina.id_bobina, data);
        toast.success("Bobina actualizada");
      } else {
        await crear(data);
        toast.success("Bobina registrada");
      }
      setFormVisible(false);
    } catch (e: any) {
      if (e.response?.data?.errors) {
        setFormErrors(e.response.data.errors);
        const errs = e.response.data.errors;
        const firstKey = Object.keys(errs)[0];
        if (firstKey) {
            toast.error(`Error en ${firstKey}: ${errs[firstKey][0]}`);
        } else {
            toast.error("Por favor, corrige los errores en el formulario");
        }
      } else {
        toast.error(e.message || "Error al guardar");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmEliminar = async () => {
    if (!selectedBobina) return;
    setFormLoading(true);
    try {
      await eliminar(selectedBobina.id_bobina);
      toast.success("Bobina eliminada");
      setConfirmVisible(false);
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setFormLoading(false);
    }
  };

  const handleExportarStock = () => {
    const data = tableStock.getFilteredRowModel().rows.map((row) => ({
      "Tipo (Ancho)": row.original.ancho,
      "Espesor": row.original.espesor,
      "Color": row.original.color_rel?.nombre || "—",
      "Cantidad Bobinas": row.original.cantidad_bobinas,
      "Peso Total (kg)": Number(row.original.total_peso_actual).toFixed(2),
    }));
    exportToExcel(data, "stock_bobinas", "Stock Disponibilidad Bobinas");
    toast.success("Exportado a Excel correctamente");
  };

  const handleExportarHistorial = () => {
    const data = tableHist.getFilteredRowModel().rows.map((row) => ({
      "Lote": row.original.lote_rel?.codigo_lote || "—",
      "Ingreso": (row.original.lote_rel?.fecha_ingreso || "").substring(0, 10),
      "Color": row.original.color_rel?.nombre || "—",
      "Espesor": row.original.espesor,
      "Ancho": row.original.ancho,
      "Peso Inicial (kg)": row.original.peso_inicial,
      "Metros Lineales (m)": row.original.metros_lineales_actual,
      "Estado Bobina": row.original.estado_bobina || "Sin estado",
    }));
    exportToExcel(data, "historial_bobinas", "Historial Bobinas");
    toast.success("Exportado a Excel correctamente");
  };

  const columnsStock = useMemo<ColumnDef<any>[]>(
    () => [
      { header: "Tipo (Ancho mm)", accessorKey: "ancho" },
      { header: "Espesor (mm)", accessorKey: "espesor" },
      { 
        header: "Color", 
        accessorKey: "color_rel.nombre",
        cell: ({ row }) => {
          const color = row.original.color_rel;
          if (!color) return <span className="text-secondary small">—</span>;
          return (
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: color.codigo_hex,
                  border: "1px solid rgba(0,0,0,.1)",
                }}
              />
              <span className="small fw-medium">{color.nombre}</span>
            </div>
          );
        },
      },
      { header: "Cantidad Bobinas", accessorKey: "cantidad_bobinas" },
      { 
        header: "Peso Total Stock (kg)", 
        accessorKey: "total_peso_actual",
        cell: ({ getValue }) => <span className="fw-bold">{Number(getValue()).toFixed(2)}</span>
      },
    ],
    []
  );

  const columnsHist = useMemo<ColumnDef<Bobina>[]>(
    () => [
      { 
        header: "Lote", 
        accessorKey: "lote_rel.codigo_lote",
        cell: ({ row }) => row.original.lote_rel?.codigo_lote || "—" 
      },
      { 
        header: "Ingreso", 
        accessorKey: "lote_rel.fecha_ingreso",
        cell: ({ row }) => (row.original.lote_rel?.fecha_ingreso || "").substring(0, 10),
      },
      {
        header: "Proveedor",
        accessorKey: "lote_rel.proveedor_rel.nombre",
        cell: ({ row }) => row.original.lote_rel?.proveedor_rel?.nombre || "—",
      },
      { 
        header: "Color", 
        accessorKey: "color_rel.nombre",
        cell: ({ row }) => {
          const color = row.original.color_rel;
          if (!color) return <span className="text-secondary small">—</span>;
          return (
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: color.codigo_hex,
                  border: "1px solid rgba(0,0,0,.1)",
                }}
              />
              <span className="small fw-medium">{color.nombre}</span>
            </div>
          );
        },
      },
      { header: "Espesor", accessorKey: "espesor" },
      { header: "Ancho", accessorKey: "ancho" },
      { 
        header: "Peso Inicial", 
        accessorKey: "peso_inicial",
        cell: ({ getValue }) => `${getValue()} kg`,
      },
      { 
        header: "M. Lineales (Stock)", 
        id: "metros_lineales",
        cell: ({ row }) => {
          const inicial = Number(row.original.metros_lineales_inicial || 0);
          const actual = Number(row.original.metros_lineales_actual || 0);
          
          if (!inicial && !actual) return <span className="text-secondary small">—</span>;

          let colorClass = "text-success"; // > 60%
          if (inicial > 0) {
            const ratio = actual / inicial;
            if (ratio <= 0.3) colorClass = "text-danger";
            else if (ratio <= 0.6) colorClass = "text-warning";
          } else if (actual === 0) {
             colorClass = "text-danger";
          }

          return (
            <div className="d-flex flex-column">
              <span className={`fw-bold ${colorClass}`}>{actual.toFixed(2)} m</span>
              <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                de {inicial.toFixed(2)} m
              </span>
            </div>
          );
        },
      },
      {
        header: "Estado Bobina",
        accessorKey: "estado_bobina",
        cell: ({ getValue }) => {
          const estado = getValue() as string;
          let color: string = "secondary";
          if (estado === "En Inventario") color = "info";
          else if (estado === "En Producción") color = "warning";
          else if (estado === "Agotado") color = "danger";
          return <CBadge color={color}>{estado || "Sin estado"}</CBadge>;
        },
      },
      {
        header: "Acciones",
        id: "acciones",
        cell: ({ row }) => (
          <div className="d-flex gap-2">
            <CButton
              color="primary"
              variant="outline"
              size="sm"
              onClick={() => handleEditar(row.original)}
            >
              <CIcon icon={cilPencil} />
            </CButton>
            <CButton
              color="danger"
              variant="outline"
              size="sm"
              onClick={() => handleEliminar(row.original)}
            >
              <CIcon icon={cilTrash} />
            </CButton>
          </div>
        ),
      },
    ],
    []
  );

  const tableStock = useReactTable({
    data: stock,
    columns: columnsStock,
    state: { globalFilter: globalFilterStock, sorting: sortingStock },
    onGlobalFilterChange: setGlobalFilterStock,
    onSortingChange: setSortingStock,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const tableHist = useReactTable({
    data: bobinas,
    columns: columnsHist,
    state: { globalFilter: globalFilterHist, sorting: sortingHist },
    onGlobalFilterChange: setGlobalFilterHist,
    onSortingChange: setSortingHist,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold">Almacén de Bobinas</h4>
          <small className="text-secondary">
            Gestión de stock de materia prima
          </small>
        </div>
        <CButton
          color="primary"
          onClick={handleCrear}
          className="d-flex align-items-center gap-2"
        >
          <CIcon icon={cilPlus} />
          Registrar Bobina
        </CButton>
      </div>

      <CCard className="mb-4">
        <CCardHeader className="py-3">
          <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
            <h5 className="mb-0 fw-bold">Stock Disponible</h5>
            <div className="d-flex align-items-center gap-2">
              <CButton
                color="success"
                variant="outline"
                size="sm"
                onClick={handleExportarStock}
                className="d-flex align-items-center gap-2"
              >
                <CIcon icon={cilCloudDownload} />
                Exportar Excel
              </CButton>
              <CFormSelect
                size="sm"
                style={{ width: 75 }}
                value={tableStock.getState().pagination.pageSize}
                onChange={(e) => tableStock.setPageSize(Number(e.target.value))}
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </CFormSelect>
            </div>
          </div>
          <CInputGroup>
            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
            <CFormInput
              placeholder="Buscar en stock..."
              value={globalFilterStock}
              onChange={(e) => setGlobalFilterStock(e.target.value)}
            />
          </CInputGroup>
        </CCardHeader>
        <CCardBody className="p-0">
          {loading && stock.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    {tableStock.getHeaderGroups().map((hg) => (
                      <tr key={hg.id}>
                        {hg.headers.map((header) => (
                          <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            style={{
                              cursor: header.column.getCanSort() ? "pointer" : "default",
                              whiteSpace: "nowrap",
                              padding: "12px 16px",
                            }}
                          >
                            <div className="d-flex align-items-center gap-1">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getIsSorted() === "asc" && <CIcon icon={cilArrowTop} size="sm" />}
                              {header.column.getIsSorted() === "desc" && <CIcon icon={cilArrowBottom} size="sm" />}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {tableStock.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={columnsStock.length} className="text-center py-5 text-secondary">
                          No hay stock disponible
                        </td>
                      </tr>
                    ) : (
                      tableStock.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex align-items-center justify-content-between px-3 py-3 border-top flex-wrap gap-2">
                <small className="text-secondary">
                  Mostrando {tableStock.getState().pagination.pageIndex * tableStock.getState().pagination.pageSize + 1} — {Math.min((tableStock.getState().pagination.pageIndex + 1) * tableStock.getState().pagination.pageSize, tableStock.getFilteredRowModel().rows.length)} de {tableStock.getFilteredRowModel().rows.length} grupos
                </small>
                <div className="d-flex gap-2">
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => tableStock.previousPage()} disabled={!tableStock.getCanPreviousPage()}>Anterior</CButton>
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => tableStock.nextPage()} disabled={!tableStock.getCanNextPage()}>Siguiente</CButton>
                </div>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader className="py-3">
          <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
            <h5 className="mb-0 fw-bold">Historial de Bobinas</h5>
            <div className="d-flex align-items-center gap-2">
              <CButton
                color="success"
                variant="outline"
                size="sm"
                onClick={handleExportarHistorial}
                className="d-flex align-items-center gap-2"
              >
                <CIcon icon={cilCloudDownload} />
                Exportar Excel
              </CButton>
              <CFormSelect
                size="sm"
                style={{ width: 75 }}
                value={tableHist.getState().pagination.pageSize}
                onChange={(e) => tableHist.setPageSize(Number(e.target.value))}
              >
                {[5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </CFormSelect>
            </div>
          </div>
          <CInputGroup>
            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
            <CFormInput
              placeholder="Buscar en historial l..."
              value={globalFilterHist}
              onChange={(e) => setGlobalFilterHist(e.target.value)}
            />
          </CInputGroup>
        </CCardHeader>

        <CCardBody className="p-0">
          {loading && bobinas.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    {tableHist.getHeaderGroups().map((hg) => (
                      <tr key={hg.id}>
                        {hg.headers.map((header) => (
                          <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            style={{
                              cursor: header.column.getCanSort() ? "pointer" : "default",
                              whiteSpace: "nowrap",
                              padding: "12px 16px",
                            }}
                          >
                            <div className="d-flex align-items-center gap-1">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getIsSorted() === "asc" && <CIcon icon={cilArrowTop} size="sm" />}
                              {header.column.getIsSorted() === "desc" && <CIcon icon={cilArrowBottom} size="sm" />}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {tableHist.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={columnsHist.length} className="text-center py-5 text-secondary">
                          No se encontraron bobinas
                        </td>
                      </tr>
                    ) : (
                      tableHist.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex align-items-center justify-content-between px-3 py-3 border-top flex-wrap gap-2">
                <small className="text-secondary">
                  Mostrando {tableHist.getState().pagination.pageIndex * tableHist.getState().pagination.pageSize + 1} — {Math.min((tableHist.getState().pagination.pageIndex + 1) * tableHist.getState().pagination.pageSize, tableHist.getFilteredRowModel().rows.length)} de {tableHist.getFilteredRowModel().rows.length} registros
                </small>
                <div className="d-flex gap-2">
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => tableHist.setPageIndex(0)} disabled={!tableHist.getCanPreviousPage()}>«</CButton>
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => tableHist.previousPage()} disabled={!tableHist.getCanPreviousPage()}>Anterior</CButton>
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => tableHist.nextPage()} disabled={!tableHist.getCanNextPage()}>Siguiente</CButton>
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => tableHist.setPageIndex(tableHist.getPageCount() - 1)} disabled={!tableHist.getCanNextPage()}>»</CButton>
                </div>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <BobinaForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmit}
        bobina={selectedBobina}
        loading={formLoading}
        errors={formErrors}
      />

      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar Bobina"
        message={`¿Estás seguro que deseas eliminar la bobina del lote "${selectedBobina?.lote_rel?.codigo_lote}"?`}
        onConfirm={handleConfirmEliminar}
        onCancel={() => setConfirmVisible(false)}
        loading={formLoading}
        confirmText={formLoading ? "Eliminando..." : "Eliminar"}
      />
    </>
  );
}
