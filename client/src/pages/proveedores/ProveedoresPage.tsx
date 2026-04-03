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
  cilPlus,
  cilSearch,
  cilPencil,
  cilTrash,
  cilArrowTop,
  cilArrowBottom,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { useProveedores } from "../../hooks/useProveedores";
import type { Proveedor } from "../../types/proveedor.types";
import ProveedorForm from "./ProveedorForm";
import ConfirmModal from "../../components/shared/ConfirmModal";

export default function ProveedoresPage() {
  const { proveedores, loading, crear, actualizar, eliminar } = useProveedores();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [formVisible, setFormVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const handleCrear = () => {
    setSelectedProveedor(null);
    setFormErrors({});
    setFormVisible(true);
  };

  const handleEditar = (p: Proveedor) => {
    setSelectedProveedor(p);
    setFormErrors({});
    setFormVisible(true);
  };

  const handleEliminar = (p: Proveedor) => {
    setSelectedProveedor(p);
    setConfirmVisible(true);
  };

  const handleSubmit = async (data: Partial<Proveedor>) => {
    setFormLoading(true);
    setFormErrors({});
    try {
      if (selectedProveedor) {
        await actualizar(selectedProveedor.id_proveedor, data);
        toast.success("Proveedor actualizado");
      } else {
        await crear(data);
        toast.success("Proveedor registrado");
      }
      setFormVisible(false);
    } catch (e: any) {
      if (e.response?.data?.errors) {
        setFormErrors(e.response.data.errors);
        toast.error("Por favor, corrige los errores");
      } else {
        toast.error(e.message || "Error al guardar");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmEliminar = async () => {
    if (!selectedProveedor) return;
    setFormLoading(true);
    try {
      await eliminar(selectedProveedor.id_proveedor);
      toast.success("Proveedor eliminado");
      setConfirmVisible(false);
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setFormLoading(false);
    }
  };

  const columns = useMemo<ColumnDef<Proveedor>[]>(
    () => [
      { header: "Nombre", accessorKey: "nombre" },
      { header: "Contacto", accessorKey: "contacto" },
      { header: "Teléfono", accessorKey: "telefono" },
      { header: "Correo", accessorKey: "correo" },
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

  const table = useReactTable({
    data: proveedores,
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
          <h4 className="mb-0 fw-bold">Gestión de Proveedores</h4>
          <small className="text-secondary">Administra tu red de proveedores</small>
        </div>
        <CButton
          color="primary"
          onClick={handleCrear}
          className="d-flex align-items-center gap-2"
        >
          <CIcon icon={cilPlus} />
          Registrar Proveedor
        </CButton>
      </div>

      <CCard>
        <CCardHeader className="py-3">
          <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
            <h5 className="mb-0 fw-bold">Lista de Proveedores</h5>
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
          <CInputGroup>
            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
            <CFormInput
              placeholder="Buscar proveedores..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </CInputGroup>
        </CCardHeader>
        <CCardBody className="p-0">
          {loading && proveedores.length === 0 ? (
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
                          No se encontraron proveedores
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
                  Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
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

      <ProveedorForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmit}
        proveedor={selectedProveedor}
        loading={formLoading}
        errors={formErrors}
      />

      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar Proveedor"
        message={`¿Estás seguro que deseas eliminar al proveedor "${selectedProveedor?.nombre}"?`}
        onConfirm={handleConfirmEliminar}
        onCancel={() => setConfirmVisible(false)}
        loading={formLoading}
        confirmText={formLoading ? "Eliminando..." : "Eliminar"}
      />
    </>
  );
}
