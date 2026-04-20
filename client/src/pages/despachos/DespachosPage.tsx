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
  CSpinner,
} from "@coreui/react";
import {
  cilSearch,
  cilArrowTop,
  cilArrowBottom,
  cilPlus,
  cilTruck,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useDespachos } from "../../hooks/useDespachos";
import type { Despacho } from "../../types/despacho.types";
import DespachoForm from "./DespachoForm";

export default function DespachosPage() {
  const { despachos, loading } = useDespachos();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "fecha_despacho", desc: true }]);
  const [formVisible, setFormVisible] = useState(false);

  const columns = useMemo<ColumnDef<Despacho>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id_despacho",
        cell: ({ getValue }) => <span className="fw-bold text-secondary">#{getValue() as number}</span>,
      },
      {
        header: "Fecha",
        accessorKey: "fecha_despacho",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
      },
      {
        header: "Receptor",
        accessorKey: "receptor",
        cell: ({ getValue }) => <span className="fw-semibold">{getValue() as string || "—"}</span>,
      },
      {
        header: "Observaciones",
        accessorKey: "observaciones",
        cell: ({ getValue }) => getValue() as string || "—",
      },
      {
        header: "Detalles",
        id: "detalles_resumen",
        cell: ({ row }) => (
          <div className="small">
            {(row.original.detalles || []).length} items entregados
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: despachos,
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
          <h4 className="mb-0 fw-bold">Gestión de Despachos</h4>
          <small className="text-secondary">
            Registro y seguimiento de entregas de productos
          </small>
        </div>
        <CButton 
          color="primary" 
          onClick={() => setFormVisible(true)}
          className="d-flex align-items-center gap-2 px-4 shadow-sm"
        >
          <CIcon icon={cilPlus} />
          Nuevo Despacho
        </CButton>
      </div>

      <CCard className="border-0 shadow-sm">
        <CCardHeader className="py-3">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <h5 className="mb-0 fw-bold">Historial de Entregas</h5>
            <div className="d-flex align-items-center gap-2">
              <CFormSelect
                size="sm"
                style={{ width: 75 }}
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </CFormSelect>
            </div>
          </div>
          <CInputGroup>
            <CInputGroupText className="border-end-0">
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              className="border-start-0"
              placeholder="Buscar por receptor, fecha u observaciones..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </CInputGroup>
        </CCardHeader>

        <CCardBody className="p-0">
          {loading && despachos.length === 0 ? (
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
                          <CIcon icon={cilTruck} size="xl" className="mb-2 opacity-25" />
                          <p className="mb-0">No se encontraron despachos registrados</p>
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

              <div className="d-flex align-items-center justify-content-between px-3 py-3 border-top flex-wrap gap-2 opacity-75">
                <small className="text-secondary fw-medium">
                  Resultados: {table.getFilteredRowModel().rows.length} registros
                </small>
                <div className="d-flex gap-1">
                  <CButton color="secondary" variant="ghost" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Anterior</CButton>
                  <CButton color="secondary" variant="ghost" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Siguiente</CButton>
                </div>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <DespachoForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
      />
    </>
  );
}
