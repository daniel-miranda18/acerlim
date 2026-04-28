import { useState, useEffect, useMemo } from "react";
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
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CSpinner,
} from "@coreui/react";
import {
  cilSearch,
  cilArrowTop,
  cilArrowBottom,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { auditoriaService } from "../../services/auditoria.service";
import type { Auditoria } from "../../types/auditoria.types";

export default function AuditoriaPage() {
  const [data, setData] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    auditoriaService.getAuditoria()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo<ColumnDef<Auditoria>[]>(
    () => [
      { header: "ID", accessorKey: "id_auditoria", size: 60 },
      { header: "Tabla", accessorKey: "tabla_afectada" },
      { header: "Acción", accessorKey: "accion", cell: ({ getValue }) => (
        <CBadge color="info">{getValue() as string}</CBadge>
      )},
      { header: "Registro ID", accessorKey: "id_registro" },
      { header: "Descripción", accessorKey: "descripcion" },
      { header: "Usuario", accessorKey: "usuario", cell: ({ row }) => (
        row.original.usuario?.nombre || "Sistema"
      )},
      { header: "Fecha", accessorKey: "fecha_evento", cell: ({ getValue }) => (
        new Date(getValue() as string).toLocaleString()
      )},
    ],
    []
  );

  const table = useReactTable({
    data,
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
      <div className="mb-4">
        <h4 className="fw-bold">Auditoría General</h4>
        <small className="text-secondary">Registro de cambios en la base de datos</small>
      </div>

      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>{table.getFilteredRowModel().rows.length} registros</span>
            <CFormSelect
              size="sm"
              style={{ width: 80 }}
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <CInputGroup>
            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
            <CFormInput
              placeholder="Buscar..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
            />
          </CInputGroup>
        </CCardHeader>
        <CCardBody className="p-0">
          {loading ? (
            <div className="text-center py-5"><CSpinner color="primary" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                      {hg.headers.map(header => (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          style={{ cursor: "pointer", padding: "12px" }}
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
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} style={{ padding: "12px", verticalAlign: "middle" }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  );
}
