import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { getAllCabezasCirculo, deleteCabezaCirculo, updateCabezaCirculo, exportCabezasCirculoToExcel } from "../../api";
import "./CabezaCirculo.css";
import { useToaster } from "../../components/ui/ToasterProvider"; // Agregar import
import CabezaCirculoEdit from './CabezaCirculoEdit';
import { ExcelButton } from '../../components/buttons/ExcelButton.styles';

const CabezaCirculoCRUD = () => {
  // Estado para manejar el registro seleccionado para edición
  const [selectedCabeza, setSelectedCabeza] = useState(null);
  
  // Estado para el filtro global de búsqueda en la tabla
  const [globalFilter, setGlobalFilter] = useState("");
  
  // Reemplazar estado de mensaje local con ToasterProvider
  const { showSuccess, showError } = useToaster();
  
  // Hooks de TanStack Query para manejo de estado del servidor
  const queryClient = useQueryClient();
  const columnHelper = createColumnHelper();

  // Consulta para obtener todos los registros de cabezas de círculo
  const {
    data: cabezasCirculo = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cabezasCirculo"],
    queryFn: getAllCabezasCirculo,
    staleTime: 5 * 60 * 1000, // Los datos se consideran frescos por 5 minutos
  });

  // Mutación para eliminar un registro de cabeza de círculo
  const deleteMutation = useMutation({
    mutationFn: deleteCabezaCirculo,
    onSuccess: () => {
      // Invalidar la consulta para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["cabezasCirculo"] });
      showSuccess("Registro eliminado exitosamente.");
    },
    onError: (error) => {
      console.error("Error deleting record:", error);
      showError("Error al eliminar el registro.");
    },
  });

  // Mutación para actualizar un registro de cabeza de círculo
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCabezaCirculo(id, data),
    onSuccess: () => {
      // Invalidar la consulta para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["cabezasCirculo"] });
      showSuccess("Registro actualizado exitosamente.");
      setSelectedCabeza(null); // Cerrar el modal de edición
    },
    onError: (error) => {
      console.error("Error updating record:", error);
      showError("Error al actualizar el registro.");
    },
  });

  // Definición de las columnas de la tabla con TanStack Table
  const columns = useMemo(
    () => [
      // Columna para el nombre
      columnHelper.accessor("nombre", {
        header: "Nombre",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna para apellido paterno
      columnHelper.accessor("apellidoPaterno", {
        header: "Apellido Paterno",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna para apellido materno
      columnHelper.accessor("apellidoMaterno", {
        header: "Apellido Materno",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna para fecha de nacimiento con formato
      columnHelper.accessor("fechaNacimiento", {
        header: "Fecha de Nacimiento",
        cell: (info) => {
          const date = info.getValue();
          return date ? new Date(date).toISOString().split('T')[0] : "";
        },
        enableGlobalFilter: false,
      }),
      // Columna para teléfono
      columnHelper.accessor("telefono", {
        header: "Teléfono",
        cell: (info) => info.getValue(),
        enableGlobalFilter: false,
      }),
      // Columna para calle
      columnHelper.accessor("calle", {
        header: "Calle",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna para número exterior
      columnHelper.accessor("noExterior", {
        header: "No. Exterior",
        cell: (info) => info.getValue(),
        enableGlobalFilter: false,
      }),
      // Columna para número interior (opcional)
      columnHelper.accessor("noInterior", {
        header: "No. Interior",
        cell: (info) => info.getValue() || "-",
        enableGlobalFilter: false,
      }),
      // Columna para colonia
      columnHelper.accessor("colonia", {
        header: "Colonia",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna para código postal
      columnHelper.accessor("codigoPostal", {
        header: "Código Postal",
        cell: (info) => info.getValue(),
        enableGlobalFilter: false,
      }),
      // Columna para municipio (opcional)
      columnHelper.accessor("municipio", {
        header: "Municipio",
        cell: (info) => info.getValue() || "-",
        filterFn: "includesString",
      }),
      // Columna para clave de elector
      columnHelper.accessor("claveElector", {
        header: "Clave de Elector",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna para email
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna para Facebook (opcional)
      columnHelper.accessor("facebook", {
        header: "Facebook",
        cell: (info) => info.getValue() || "-",
        enableGlobalFilter: false,
      }),
      // Columna para otra red social (opcional)
      columnHelper.accessor("otraRedSocial", {
        header: "Otra Red Social",
        cell: (info) => info.getValue() || "-",
        enableGlobalFilter: false,
      }),
      // Columna para estructura territorial
      columnHelper.accessor("estructuraTerritorial", {
        header: "Estructura Territorial",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna para posición en estructura
      columnHelper.accessor("posicionEstructura", {
        header: "Posición Estructura",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna de acciones (editar y eliminar)
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        cell: (props) => (
          <div className="action-column">
            <button 
              className="action-button edit" 
              onClick={() => handleEdit(props.row.original)}
              title="Editar"
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button 
              className="action-button delete" 
              onClick={() => handleDelete(props.row.original.id)}
              title="Eliminar"
            >
              <i className="bi bi-trash3"></i>
            </button>
          </div>
        ),
        enableGlobalFilter: false,
        enableSorting: false,
      }),
    ],
    [columnHelper]
  );

  // Configuración de la tabla con TanStack Table
  const table = useReactTable({
    data: cabezasCirculo,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 12, // Mostrar 12 registros por página
        pageIndex: 0, // Empezar en la primera página
      },
    },
    manualPagination: false,
    enableColumnResizing: false,
  });

  // Función para confirmar y ejecutar la eliminación de un registro
  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este registro?")) {
      deleteMutation.mutate(id);
    }
  };

  // Función para abrir el modal de edición con los datos del registro seleccionado
  const handleEdit = (cabeza) => {
    setSelectedCabeza(cabeza);
  };

  // Función para cerrar el modal de edición
  const handleCloseEdit = () => {
    setSelectedCabeza(null);
  };

  // Función para procesar y enviar la actualización del registro
  const handleUpdateSubmit = async (updatedCabeza) => {
    // Formatear campos numéricos antes de enviar al backend
    const formattedCabeza = {
      ...updatedCabeza,
      telefono: updatedCabeza.telefono ? Number.parseInt(updatedCabeza.telefono) : null,
      noExterior: updatedCabeza.noExterior ? Number.parseInt(updatedCabeza.noExterior) : null,
      noInterior: updatedCabeza.noInterior ? Number.parseInt(updatedCabeza.noInterior) : null,
      codigoPostal: updatedCabeza.codigoPostal ? Number.parseInt(updatedCabeza.codigoPostal) : null,
    };

    updateMutation.mutate({ id: formattedCabeza.id, data: formattedCabeza });
  };

  // Función para formatear fechas en formato YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Función para descargar el archivo Excel
  const handleExportToExcel = async () => {
    try {
      const blob = await exportCabezasCirculoToExcel();
      
      // Crear URL para el blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cabezas-circulo-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccess("Archivo Excel descargado exitosamente");
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      showError("Error al exportar a Excel");
    }
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="neumorphic-crud-container">
        <div className="neumorphic-loader-container">
          <div className="neumorphic-loader"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Mostrar estado de error
  if (isError) {
    return (
      <div className="neumorphic-crud-container">
        <div className="neumorphic-empty-state">
          <span className="empty-icon">⚠️</span>
          <p>Error al cargar los datos: {error?.message}</p>
        </div>
      </div>
    );
  }

  // Función auxiliar para generar números de página visibles en la paginación
  const getVisiblePageNumbers = () => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
    
    let start = Math.max(0, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);
    
    // Ajustar si estamos cerca del inicio o final
    if (currentPage <= delta) {
      end = Math.min(totalPages - 1, 2 * delta);
    }
    if (currentPage >= totalPages - delta - 1) {
      start = Math.max(0, totalPages - 2 * delta - 1);
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Componente de controles de paginación mejorado
  const PaginationControls = () => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;
    const totalRows = table.getFilteredRowModel().rows.length;
    
    const startRow = currentPage * pageSize + 1;
    const endRow = Math.min((currentPage + 1) * pageSize, totalRows);
    
    return (
      <div className="tanstack-pagination-container">
        {/* Fila superior con selector de registros por página */}
        <div className="pagination-top-row">
          <div className="page-size-selector-top">
            <label htmlFor="pageSize">Registros por página:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="page-size-select"
            >
              {[5, 10, 12, 15, 20, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Información de paginación centrada */}
        <div className="pagination-info">
          Mostrando {startRow}-{endRow} de {totalRows} registros
          {totalRows > 0 && (
            <span className="page-info">
              {" "}(Página {currentPage + 1} de {totalPages})
            </span>
          )}
        </div>

        {/* Controles de navegación de páginas */}
        <div className="pagination-controls">
          {/* Botón para ir a la primera página */}
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="pagination-button"
            title="Primera página"
          >
            <i className="bi bi-chevron-double-left"></i>
          </button>

          {/* Botón para página anterior */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="pagination-button"
            title="Página anterior"
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {/* Números de página */}
          <div className="page-numbers">
            {/* Mostrar primera página si no está en el rango visible */}
            {getVisiblePageNumbers()[0] > 0 && (
              <>
                <button 
                  onClick={() => table.setPageIndex(0)}
                  className="page-number"
                >
                  1
                </button>
                {getVisiblePageNumbers()[0] > 1 && (
                  <span className="page-ellipsis">...</span>
                )}
              </>
            )}

            {/* Números de página visibles */}
            {getVisiblePageNumbers().map((pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => table.setPageIndex(pageIndex)}
                className={`page-number ${currentPage === pageIndex ? 'active' : ''}`}
              >
                {pageIndex + 1}
              </button>
            ))}

            {/* Mostrar última página si no está en el rango visible */}
            {getVisiblePageNumbers()[getVisiblePageNumbers().length - 1] < totalPages - 1 && (
              <>
                {getVisiblePageNumbers()[getVisiblePageNumbers().length - 1] < totalPages - 2 && (
                  <span className="page-ellipsis">...</span>
                )}
                <button 
                  onClick={() => table.setPageIndex(totalPages - 1)}
                  className="page-number"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Botón para página siguiente */}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="pagination-button"
            title="Página siguiente"
          >
            <i className="bi bi-chevron-right"></i>
          </button>

          {/* Botón para ir a la última página */}
          <button
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
            className="pagination-button"
            title="Última página"
          >
            <i className="bi bi-chevron-double-right"></i>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="neumorphic-crud-container">
      {/* Barra de controles con búsqueda */}
      <div className="neumorphic-controls">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 w-100">
          <div className="neumorphic-search w-100 w-md-50 position-relative">
            <input
              type="text"
              placeholder="Buscar por Nombre o Clave de Elector..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="neumorphic-input search-input w-100 pe-5"
            />
            <span className="search-icon position-absolute end-0 top-50 translate-middle-y me-2">
              <i className="bi bi-search"></i>
            </span>
          </div>

          {/* Botón de exportar a Excel */}
          <ExcelButton onClick={handleExportToExcel}>
            <i className="bi bi-file-earmark-excel"></i>
            <span>Exportar Excel</span>
          </ExcelButton>
        </div>
      </div>

      {/* Mostrar tabla o estado vacío */}
      {table.getFilteredRowModel().rows.length === 0 ? (
        <div className="neumorphic-empty-state">
          <span className="empty-icon">🔍</span>
          <p>No se encontraron registros que coincidan con su búsqueda</p>
        </div>
      ) : (
        <>
          {/* Tabla con datos */}
          <div className="neumorphic-table-container">
            <table className="neumorphic-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={header.id === "actions" ? "fixed-column" : ""}
                        style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="d-flex align-items-center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {/* Iconos de ordenamiento */}
                            {{
                              asc: <i className="bi bi-arrow-up ms-2" style={{ fontSize: '12px', color: '#ffffff' }}></i>,
                              desc: <i className="bi bi-arrow-down ms-2" style={{ fontSize: '12px', color: '#ffffff' }}></i>,
                            }[header.column.getIsSorted()] ?? 
                            (header.column.getCanSort() ? 
                              <i className="bi bi-arrow-up-down ms-2" style={{ fontSize: '12px', color: '#ffffff', opacity: '0.6' }}></i> : 
                              null
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cell.column.id === "actions" ? "fixed-column" : ""}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación */}
          <PaginationControls />
        </>
      )}

      {/* Modal de edición */}
      {selectedCabeza && (
        <CabezaCirculoEdit 
          cabeza={selectedCabeza} 
          onClose={handleCloseEdit}
        />
      )}
    </div>
  );
};

export default CabezaCirculoCRUD;