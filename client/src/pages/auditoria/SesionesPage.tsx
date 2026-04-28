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
import type { Sesion } from "../../types/auditoria.types";

export default function SesionesPage() {
  const [data, setData] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    auditoriaService.getSesiones()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo<ColumnDef<Sesion>[]>(
    () => [
      { header: "ID", accessorKey: "id_sesion", size: 60 },
      { header: "Usuario", accessorKey: "usuario", cell: ({ row }) => (
        row.original.usuario?.nombre || "N/A"
      )},
      { header: "Inicio", accessorKey: "fecha_inicio", cell: ({ getValue }) => (
        new Date(getValue() as string).toLocaleString()
      )},
      { header: "Cierre", accessorKey: "fecha_cierre", cell: ({ getValue }) => (
        getValue() ? new Date(getValue() as string).toLocaleString() : <CBadge color="success">Activa</CBadge>
      )},
      { header: "IP", accessorKey: "ip" },
      { header: "Dispositivo", accessorKey: "dispositivo", cell: ({ getValue }) => (
        <span style={{ fontSize: "0.85rem" }}>{getValue() as string}</span>
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
        <h4 className="fw-bold">Sesiones de Usuario</h4>
        <small className="text-secondary">Registro de accesos al sistema</small>
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
