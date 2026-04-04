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
import { useProductos } from "../../hooks/useProductos";
import type { Producto, TipoProducto } from "../../types/producto.types";
import ProductoForm from "./ProductoForm";
import ConfirmModal from "../../components/shared/ConfirmModal";
import { exportToExcel } from "../../utils/exportExcel";
import { tipoProductoService } from "../../services/tipoProducto.service";
import { useEffect } from "react";

export default function ProductosPage() {
  const { productos, loading, crear, actualizar, eliminar } = useProductos();
  
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [tipos, setTipos] = useState<TipoProducto[]>([]);

  useEffect(() => {
    tipoProductoService.obtenerTodos().then(setTipos).catch(console.error);
  }, []);

  const handleCrear = () => {
    setSelectedProducto(null);
    setFormErrors({});
    setFormVisible(true);
  };

  const handleEditar = (p: Producto) => {
    setSelectedProducto(p);
    setFormErrors({});
    setFormVisible(true);
  };

  const handleEliminar = (p: Producto) => {
    setSelectedProducto(p);
    setConfirmVisible(true);
  };

  const handleSubmit = async (data: Partial<Producto>) => {
    setFormLoading(true);
    setFormErrors({});
    try {
      if (selectedProducto) {
        await actualizar(selectedProducto.id_producto, data);
        toast.success("Tipo de calamina actualizado");
      } else {
        await crear(data);
        toast.success("Tipo de calamina registrado");
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
    if (!selectedProducto) return;
    setFormLoading(true);
    try {
      await eliminar(selectedProducto.id_producto);
      toast.success("Tipo eliminado");
      setConfirmVisible(false);
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setFormLoading(false);
    }
  };

  const handleExportar = () => {
    const data = table.getFilteredRowModel().rows.map((row) => ({
      ID: row.original.id_producto,
      Tipo: row.original.tipo_producto?.nombre ?? "",
      Descripción: row.original.descripcion ?? "",
      "Largo (m)": row.original.medida_largo,
      "Ancho (m)": row.original.medida_ancho,
    }));
    exportToExcel(data, "tipos_calamina", "Tipos de Calamina");
    toast.success("Exportado a Excel correctamente");
  };

  const columns = useMemo<ColumnDef<Producto>[]>(
    () => [
      { 
        header: "Tipo", 
        accessorKey: "tipo_producto.nombre",
        cell: ({ row }) => (
          <CBadge color="primary" shape="rounded-pill">
            {row.original.tipo_producto?.nombre ?? "—"}
          </CBadge>
        ),
      },
      { 
        header: "Descripción", 
        accessorKey: "descripcion",
        cell: ({ row }) => <span className="text-secondary small">{row.original.descripcion}</span>
      },
      { 
        header: "Medidas (m)", 
        accessorKey: "medida_largo",
        cell: ({ row }) => (
          <span className="fw-medium">
            {Number(row.original.medida_largo).toFixed(2)} x {Number(row.original.medida_ancho).toFixed(2)}
          </span>
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
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: productos,
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
          <h4 className="mb-0 fw-bold">Tipos de Calamina</h4>
          <small className="text-secondary">
            Catálogo de productos y dimensiones
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
            Registrar Tipo
          </CButton>
        </div>
      </div>

      <CCard>
        <CCardHeader className="py-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-semibold">
              {table.getFilteredRowModel().rows.length} tipos encontrados
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
              placeholder="Buscar tipo de producto..."
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
                                header.getContext()
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
                          No se encontraron tipos de producto
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
                                cell.getContext()
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
                    table.getFilteredRowModel().rows.length
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

      <ProductoForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmit}
        producto={selectedProducto}
        tipos={tipos}
        loading={formLoading}
        errors={formErrors}
      />

      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar Tipo"
        message={`¿Estás seguro que deseas eliminar este producto de tipo "${selectedProducto?.tipo_producto?.nombre}"?`}
        onConfirm={handleConfirmEliminar}
        onCancel={() => setConfirmVisible(false)}
        loading={formLoading}
        confirmText={formLoading ? "Eliminando..." : "Eliminar"}
      />
    </>
  );
}
