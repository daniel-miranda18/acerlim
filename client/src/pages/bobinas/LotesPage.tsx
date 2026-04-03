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
import { useLotes } from "../../hooks/useLotes";
import type { Lote } from "../../types/lote.types";
import LoteForm from "./LoteForm";
import ConfirmModal from "../../components/shared/ConfirmModal";
import { loteService } from "../../services/lote.service";
import { exportToExcel } from "../../utils/exportExcel";

export default function LotesPage() {
  const { lotes, loading, refreshLotes } = useLotes();
  
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const [formVisible, setFormVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCrear = () => {
    setSelectedLote(null);
    setFormVisible(true);
  };

  const handleEditar = (l: Lote) => {
    setSelectedLote(l);
    setFormVisible(true);
  };

  const handleEliminar = (l: Lote) => {
    setSelectedLote(l);
    setConfirmVisible(true);
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      if (selectedLote) {
        await loteService.actualizarLote(selectedLote.id_lote, data);
        toast.success("Lote actualizado");
      } else {
        await loteService.crearLote(data);
        toast.success("Lote creado");
      }
      refreshLotes();
      setFormVisible(false);
    } catch {
      toast.error("Error al guardar lote");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmEliminar = async () => {
    if (!selectedLote) return;
    setSubmitting(true);
    try {
      await loteService.eliminarLote(selectedLote.id_lote);
      toast.success("Lote eliminado");
      refreshLotes();
      setConfirmVisible(false);
    } catch {
      toast.error("Error al eliminar lote");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportarExcel = () => {
    const data = table.getFilteredRowModel().rows.map((row) => ({
      "Código Lote": row.original.codigo_lote,
      "Proveedor": row.original.proveedor_rel?.nombre || "—",
      "Fecha Ingreso": (row.original.fecha_ingreso || "").substring(0, 10),
      "Cantidad Bobinas": row.original._count?.bobinas || 0,
    }));
    exportToExcel(data, "lotes_acerlim", "Listado de Lotes de Materia Prima");
    toast.success("Exportado a Excel correctamente");
  };

  const columns = useMemo<ColumnDef<Lote>[]>(
    () => [
      { 
        header: "Código de Lote", 
        accessorKey: "codigo_lote",
        cell: ({ getValue }) => <span className="fw-bold">{getValue() as string}</span>
      },
      { 
        header: "Proveedor", 
        accessorKey: "proveedor_rel",
        cell: ({ getValue }: any) => {
          const prov = getValue();
          return prov ? (
            <div>
              <div className="fw-medium">{prov.nombre}</div>
              {prov.contacto && <small className="text-secondary">{prov.contacto}</small>}
            </div>
          ) : "—";
        }
      },
      { 
        header: "Fecha Ingreso", 
        accessorKey: "fecha_ingreso",
        cell: ({ getValue }) => (
          <CBadge color="light" className="text-dark border">
            {(getValue() as string || "").substring(0, 10)}
          </CBadge>
        )
      },
      { 
        header: "Cant. Bobinas", 
        accessorKey: "_count",
        cell: ({ getValue }: any) => (
          <div className="text-center">
            <CBadge color={getValue()?.bobinas > 0 ? "info" : "secondary"}>
              {getValue()?.bobinas || 0}
            </CBadge>
          </div>
        )
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
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data: lotes,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
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
          <h4 className="mb-0 fw-bold">Gestión de Lotes</h4>
          <small className="text-secondary">
            Administración de entradas de materia prima
          </small>
        </div>
        <CButton
          color="primary"
          onClick={handleCrear}
          className="d-flex align-items-center gap-2"
        >
          <CIcon icon={cilPlus} />
          Nuevo Lote
        </CButton>
      </div>

      <CCard className="mb-4">
        <CCardHeader className="py-3">
          <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
            <h5 className="mb-0 fw-bold">Listado de Lotes</h5>
            <div className="d-flex align-items-center gap-2">
              <CButton
                color="success"
                variant="outline"
                size="sm"
                onClick={handleExportarExcel}
                className="d-flex align-items-center gap-2"
              >
                <CIcon icon={cilCloudDownload} />
                Exportar Excel
              </CButton>
              <CFormSelect
                size="sm"
                style={{ width: 75 }}
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
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
              placeholder="Buscar lote o proveedor..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </CInputGroup>
        </CCardHeader>
        <CCardBody className="p-0">
          {loading && lotes.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    {table.getHeaderGroups().map((hg) => (
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
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center py-5 text-secondary">
                          No se encontraron lotes
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
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
                  Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} — {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de {table.getFilteredRowModel().rows.length} registros
                </small>
                <div className="d-flex gap-2">
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Anterior</CButton>
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Siguiente</CButton>
                </div>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <LoteForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmit}
        lote={selectedLote}
        loading={submitting}
      />

      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar Lote"
        message={`¿Estás seguro de eliminar el lote "${selectedLote?.codigo_lote}"?`}
        onConfirm={handleConfirmEliminar}
        onCancel={() => setConfirmVisible(false)}
        loading={submitting}
        confirmText={submitting ? "Eliminando..." : "Eliminar"}
      />
    </>
  );
}

