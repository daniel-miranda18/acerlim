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
  cilSearch,
  cilTrash,
  cilArrowTop,
  cilArrowBottom,
  cilCloudDownload,
  cilList,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { usePedidos } from "../../hooks/usePedidos";
import type { Pedido } from "../../types/pedido.types";
import ConfirmModal from "../../components/shared/ConfirmModal";
import PedidoDetalleModal from "./PedidoDetalleModal";
import { exportToExcel } from "../../utils/exportExcel";

export default function PedidosPage() {
  const { pedidos, loading, eliminarPedido } = usePedidos();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "fecha", desc: true }]);

  const [detalleVisible, setDetalleVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleVerDetalles = (p: Pedido) => {
    setSelectedPedido(p);
    setDetalleVisible(true);
  };

  const handleEliminar = (p: Pedido) => {
    setSelectedPedido(p);
    setConfirmVisible(true);
  };

  const handleConfirmEliminar = async () => {
    if (!selectedPedido) return;
    setActionLoading(true);
    try {
      await eliminarPedido(selectedPedido.id_pedido);
      toast.success("Pedido eliminado correctamente");
      setConfirmVisible(false);
    } catch {
      toast.error("Error al eliminar el pedido");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportarHistorial = () => {
    const data = table.getFilteredRowModel().rows.map((row) => ({
      "N° Pedido": row.original.id_pedido,
      "Cliente": row.original.nombre_cliente,
      "Fecha": new Date(row.original.fecha).toLocaleDateString(),
      "Total (Bs)": Number(row.original.total).toFixed(2),
      "Estado": row.original.estado_pedido,
      "Observaciones": row.original.observaciones || "—",
    }));
    exportToExcel(data, "listado_pedidos", "Registro de Pedidos");
    toast.success("Exportado a Excel correctamente");
  };

  const columns = useMemo<ColumnDef<Pedido>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id_pedido",
        cell: ({ getValue }) => <span className="fw-bold text-secondary">#{getValue() as number}</span>,
      },
      {
        header: "Cliente",
        accessorKey: "nombre_cliente",
        cell: ({ getValue }) => <span className="fw-semibold">{getValue() as string}</span>,
      },
      {
        header: "Fecha",
        accessorKey: "fecha",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
      },
      {
        header: "Total",
        accessorKey: "total",
        cell: ({ getValue }) => <span className="fw-bold text-success">Bs {Number(getValue()).toFixed(2)}</span>,
      },
      {
        header: "Estado",
        accessorKey: "estado_pedido",
        cell: ({ getValue }) => {
          const st = (getValue() as string).toLowerCase();
          let color = "secondary";
          if (st === "completado" || st === "pagado" || st === "entregado") color = "success";
          if (st === "pendiente") color = "warning";
          if (st === "cancelado") color = "danger";
          return <CBadge color={color} className="text-uppercase">{st}</CBadge>;
        },
      },
      {
        header: "Acciones",
        id: "acciones",
        cell: ({ row }) => (
          <div className="d-flex gap-2">
            <CButton
              color="info"
              variant="outline"
              size="sm"
              onClick={() => handleVerDetalles(row.original)}
              title="Ver Detalles"
            >
              <CIcon icon={cilList} />
            </CButton>
            <CButton
              color="danger"
              variant="outline"
              size="sm"
              onClick={() => handleEliminar(row.original)}
              title="Eliminar Pedido"
            >
              <CIcon icon={cilTrash} />
            </CButton>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: pedidos,
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
          <h4 className="mb-0 fw-bold">Registro de Pedidos</h4>
          <small className="text-secondary">
            Consulta y gestión del historial de pedidos registrados
          </small>
        </div>
      </div>

      <CCard>
        <CCardHeader className="py-3">
          <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
            <h5 className="mb-0 fw-bold">Listado de Pedidos</h5>
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
            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
            <CFormInput
              placeholder="Buscar por cliente, fecha, etc..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </CInputGroup>
        </CCardHeader>

        <CCardBody className="p-0">
          {loading && pedidos.length === 0 ? (
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
                          No se encontraron pedidos
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
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>«</CButton>
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Anterior</CButton>
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Siguiente</CButton>
                  <CButton color="secondary" variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>»</CButton>
                </div>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <PedidoDetalleModal
        visible={detalleVisible}
        onClose={() => setDetalleVisible(false)}
        pedido={selectedPedido}
      />

      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar Pedido"
        message={`¿Estás seguro que deseas eliminar el pedido #${selectedPedido?.id_pedido} de ${selectedPedido?.nombre_cliente}?`}
        onConfirm={handleConfirmEliminar}
        onCancel={() => setConfirmVisible(false)}
        loading={actionLoading}
        confirmText={actionLoading ? "Eliminando..." : "Eliminar"}
      />
    </>
  );
}
