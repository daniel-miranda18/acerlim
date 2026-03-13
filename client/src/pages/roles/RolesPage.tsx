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
  cilShieldAlt,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { useRoles } from "../../hooks/useRoles";
import RolForm from "./RolForm";
import ConfirmModal from "../../components/shared/ConfirmModal";
import RolPermisosModal from "./RolPermisosModal";
import { exportToExcel } from "../../utils/exportExcel";
import type { Rol, CrearRolDTO } from "../../types/rol.types";

export default function RolesPage() {
  const { roles, loading, crear, actualizar, eliminar } = useRoles();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [permisosVisible, setPermisosVisible] = useState(false);

  const handleGestionarPermisos = (r: Rol) => {
    setSelectedRol(r);
    setPermisosVisible(true);
  };
  const handleCrear = () => {
    setSelectedRol(null);
    setFormVisible(true);
  };
  const handleEditar = (r: Rol) => {
    setSelectedRol(r);
    setFormVisible(true);
  };
  const handleEliminar = (r: Rol) => {
    setSelectedRol(r);
    setConfirmVisible(true);
  };

  const handleSubmit = async (data: CrearRolDTO) => {
    setFormLoading(true);
    try {
      if (selectedRol) {
        await actualizar(selectedRol.id_rol, data);
        toast.success("Rol actualizado correctamente");
      } else {
        await crear(data);
        toast.success("Rol creado correctamente");
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
      throw e;
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmEliminar = async () => {
    if (!selectedRol) return;
    setFormLoading(true);
    try {
      await eliminar(selectedRol.id_rol);
      toast.success("Rol eliminado correctamente");
      setConfirmVisible(false);
    } catch {
      toast.error("Error al eliminar el rol");
    } finally {
      setFormLoading(false);
    }
  };

  const handleExportar = () => {
    const data = table.getFilteredRowModel().rows.map((row) => ({
      ID: row.original.id_rol,
      Nombre: row.original.nombre,
      Descripción: row.original.descripcion ?? "",
      Estado: row.original.estado === 1 ? "Activo" : "Inactivo",
      "Fecha Creación": row.original.fecha_creacion ?? "",
    }));
    exportToExcel(data, "roles", "Roles");
    toast.success("Exportado a Excel correctamente");
  };

  const columns = useMemo<ColumnDef<Rol>[]>(
    () => [
      { header: "#", accessorKey: "id_rol", size: 60 },
      { header: "Nombre", accessorKey: "nombre" },
      {
        header: "Descripción",
        accessorKey: "descripcion",
        cell: ({ getValue }) =>
          getValue() ?? <span className="text-secondary">—</span>,
      },
      {
        header: "Estado",
        accessorKey: "estado",
        cell: ({ getValue }) => (
          <CBadge color={getValue() === 1 ? "success" : "danger"}>
            {getValue() === 1 ? "Activo" : "Inactivo"}
          </CBadge>
        ),
      },
      {
        header: "Creado",
        accessorKey: "fecha_creacion",
        cell: ({ getValue }) => getValue() ?? "—",
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
              onClick={() => handleGestionarPermisos(row.original)}
              title={
                row.original.estado === 0
                  ? "El rol está inactivo"
                  : "Gestionar permisos"
              }
              disabled={row.original.estado === 0}
            >
              <CIcon icon={cilShieldAlt} />
            </CButton>
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
    [],
  );

  const table = useReactTable({
    data: roles,
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
          <h4 className="mb-0 fw-bold">Roles</h4>
          <small className="text-secondary">Gestión de roles del sistema</small>
        </div>
        <div className="d-flex gap-2">
          <CButton
            color="success"
            variant="outline"
            onClick={handleExportar}
            className="d-flex align-items-center gap-2"
          >
            <CIcon icon={cilCloudDownload} />
            Exportar Excel
          </CButton>
          <CButton
            color="primary"
            onClick={handleCrear}
            className="d-flex align-items-center gap-2"
          >
            <CIcon icon={cilPlus} />
            Nuevo rol
          </CButton>
        </div>
      </div>

      <CCard>
        <CCardHeader className="py-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-semibold">
              {table.getFilteredRowModel().rows.length} roles encontrados
            </span>
            <div className="d-flex align-items-center gap-2">
              <small className="text-secondary text-nowrap">Mostrar</small>
              <CFormSelect
                size="sm"
                style={{ width: 75 }}
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </CFormSelect>
              <small className="text-secondary text-nowrap">registros</small>
            </div>
          </div>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="Buscar rol..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </CInputGroup>
        </CCardHeader>

        <CCardBody className="p-0">
          {loading ? (
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
                              cursor: header.column.getCanSort()
                                ? "pointer"
                                : "default",
                              whiteSpace: "nowrap",
                              padding: "12px 16px",
                            }}
                          >
                            <div className="d-flex align-items-center gap-1">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.getIsSorted() === "asc" && (
                                <CIcon icon={cilArrowTop} size="sm" />
                              )}
                              {header.column.getIsSorted() === "desc" && (
                                <CIcon icon={cilArrowBottom} size="sm" />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-5 text-secondary"
                        >
                          No se encontraron roles
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              style={{
                                padding: "12px 16px",
                                verticalAlign: "middle",
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
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
                  Mostrando{" "}
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}{" "}
                  —{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length,
                  )}{" "}
                  de {table.getFilteredRowModel().rows.length} registros
                </small>
                <div className="d-flex gap-2">
                  <CButton
                    color="secondary"
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    «
                  </CButton>
                  <CButton
                    color="secondary"
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Anterior
                  </CButton>
                  <CButton
                    color="secondary"
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Siguiente
                  </CButton>
                  <CButton
                    color="secondary"
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    »
                  </CButton>
                </div>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <RolForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmit}
        rol={selectedRol}
        loading={formLoading}
      />

      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar rol"
        message={`¿Estás seguro que deseas eliminar el rol "${selectedRol?.nombre}"?`}
        onConfirm={handleConfirmEliminar}
        onCancel={() => setConfirmVisible(false)}
        loading={formLoading}
      />

      <RolPermisosModal
        visible={permisosVisible}
        onClose={() => setPermisosVisible(false)}
        rol={selectedRol}
      />
    </>
  );
}
