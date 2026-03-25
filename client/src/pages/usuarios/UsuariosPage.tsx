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
import { useUsuarios } from "../../hooks/useUsuarios";
import { useRoles } from "../../hooks/useRoles";
import UsuarioForm from "./UsuarioForm";
import ConfirmModal from "../../components/shared/ConfirmModal";
import { exportToExcel } from "../../utils/exportExcel";
import type {
  Usuario,
  CrearUsuarioDTO,
  ActualizarUsuarioDTO,
} from "../../types/usuario.types";

export default function UsuariosPage() {
  const { usuarios, loading, crear, actualizar, eliminar } = useUsuarios();
  const { roles } = useRoles();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const handleCrear = () => {
    setSelectedUsuario(null);
    setFormErrors({});
    setFormVisible(true);
  };
  const handleEditar = (u: Usuario) => {
    setSelectedUsuario(u);
    setFormErrors({});
    setFormVisible(true);
  };
  const handleEliminar = (u: Usuario) => {
    setSelectedUsuario(u);
    setConfirmVisible(true);
  };

  const handleSubmit = async (data: CrearUsuarioDTO | ActualizarUsuarioDTO) => {
    setFormLoading(true);
    setFormErrors({});
    try {
      if (selectedUsuario) {
        await actualizar(
          selectedUsuario.id_usuario,
          data as ActualizarUsuarioDTO,
        );
        toast.success("Usuario actualizado correctamente");
      } else {
        await crear(data as CrearUsuarioDTO);
        toast.success("Usuario creado correctamente");
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
      throw e;
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmEliminar = async () => {
    if (!selectedUsuario) return;
    setFormLoading(true);
    try {
      await eliminar(selectedUsuario.id_usuario);
      toast.success("Usuario eliminado correctamente");
      setConfirmVisible(false);
    } catch {
      toast.error("Error al eliminar el usuario");
    } finally {
      setFormLoading(false);
    }
  };

  const handleExportar = () => {
    const data = table.getFilteredRowModel().rows.map((row) => ({
      ID: row.original.id_usuario,
      Nombre: row.original.nombre,
      Correo: row.original.correo,
      Teléfono: row.original.telefono ?? "",
      Rol: row.original.rol?.nombre ?? "",
      Estado: row.original.estado === 1 ? "Activo" : "Inactivo",
      "Fecha Creación": row.original.fecha_creacion ?? "",
    }));
    exportToExcel(data, "usuarios", "Usuarios");
    toast.success("Exportado a Excel correctamente");
  };

  const columns = useMemo<ColumnDef<Usuario>[]>(
    () => [
      { header: "#", accessorKey: "id_usuario", size: 60 },
      { header: "Nombre", accessorKey: "nombre" },
      { header: "Correo", accessorKey: "correo" },
      {
        header: "Teléfono",
        accessorKey: "telefono",
        cell: ({ getValue }) =>
          getValue() ?? <span className="text-secondary">—</span>,
      },
      {
        header: "Rol",
        accessorKey: "rol",
        cell: ({ row }) =>
          row.original.rol ? (
            <CBadge color="primary">{row.original.rol.nombre}</CBadge>
          ) : (
            <span className="text-secondary">—</span>
          ),
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
    data: usuarios,
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
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="mb-0 fw-bold">Usuarios</h4>
          <small className="text-secondary">
            Gestión de usuarios del sistema
          </small>
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
            Nuevo usuario
          </CButton>
        </div>
      </div>

      <CCard>
        <CCardHeader className="py-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-semibold">
              {table.getFilteredRowModel().rows.length} usuarios encontrados
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
              placeholder="Buscar usuario..."
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
                          No se encontraron usuarios
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

      <UsuarioForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmit}
        usuario={selectedUsuario}
        roles={roles}
        loading={formLoading}
        errors={formErrors}
      />

      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar usuario"
        message={`¿Estás seguro que deseas eliminar a "${selectedUsuario?.nombre}"?`}
        onConfirm={handleConfirmEliminar}
        onCancel={() => setConfirmVisible(false)}
        loading={formLoading}
        confirmText={formLoading ? "Eliminando..." : "Eliminar"}
      />
    </>
  );
}
