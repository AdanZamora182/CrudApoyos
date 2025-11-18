import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllIntegrantesCirculo, 
  deleteIntegranteCirculo, 
  buscarCabezasCirculo,
  exportIntegrantesCirculoToExcel
} from "../../api";
import { useToaster } from "../../components/ui/ToasterProvider"; // Agregar import
import { ExcelButton } from '../../components/buttons/ExcelButton.styles';
import "./IntegranteCirculo.css";
import IntegranteCirculoEdit from './IntegranteCirculoEdit';
import IntegranteCirculoView from './IntegranteCirculoView';

const IntegranteCirculoCRUD = () => {
  const [selectedIntegrante, setSelectedIntegrante] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const { showSuccess, showError } = useToaster();
  const [viewDetailsIntegrante, setViewDetailsIntegrante] = useState(null);
  
  const queryClient = useQueryClient();
  const columnHelper = createColumnHelper();

  // Consulta para obtener todos los registros de integrantes de círculo
  const {
    data: integrantesCirculo = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["integrantesCirculo"],
    queryFn: getAllIntegrantesCirculo,
    staleTime: 5 * 60 * 1000, // Los datos se consideran frescos por 5 minutos
  });

  // Mutación para eliminar un registro de integrante de círculo
  const deleteMutation = useMutation({
    mutationFn: deleteIntegranteCirculo,
    onSuccess: () => {
      // Invalidar la consulta para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["integrantesCirculo"] });
      showSuccess("Registro eliminado exitosamente.");
    },
    onError: (error) => {
      console.error("Error deleting record:", error);
      showError("Error al eliminar el registro.");
    },
  });

  // Función para confirmar y ejecutar la eliminación de un registro
  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este registro?")) {
      deleteMutation.mutate(id);
    }
  };

  // Función para abrir el modal de edición con los datos del registro seleccionado
  const handleEdit = (integrante) => {
    setSelectedIntegrante(integrante);
  };

  const handleCloseEdit = () => {
    setSelectedIntegrante(null);
  };

  // Función para descargar el archivo Excel
  const handleExportToExcel = async () => {
    try {
      const blob = await exportIntegrantesCirculoToExcel();
      
      // Crear URL para el blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `integrantes-circulo-${new Date().toISOString().split('T')[0]}.xlsx`;
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
      // Columna para clave de elector
      columnHelper.accessor("claveElector", {
        header: "Clave de Elector",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna para teléfono
      columnHelper.accessor("telefono", {
        header: "Teléfono",
        cell: (info) => info.getValue(),
        enableGlobalFilter: false,
      }),
      // Columna para líder
      columnHelper.accessor("lider", {
        header: "Líder",
        cell: (info) => {
          const lider = info.getValue();
          return lider ? 
            `${lider.nombre} ${lider.apellidoPaterno} ${lider.apellidoMaterno}` : 
            "-";
        },
        filterFn: "includesString",
      }),
      // Columna para clave de elector del líder
      columnHelper.accessor("lider.claveElector", {
        header: "Clave de Elector Líder",
        cell: (info) => {
          const claveElector = info.getValue();
          return claveElector || "-";
        },
        enableGlobalFilter: false,
      }),
      // Columna de acciones (ver, editar y eliminar)
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        cell: (props) => (
          <div className="action-column">
            <button 
              className="action-button view" 
              onClick={() => handleViewDetails(props.row.original)}
              title="Ver Detalles"
            >
              <i className="bi bi-eye"></i>
            </button>
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
        meta: {
          headerClassName: "fixed-column",
          cellClassName: "fixed-column",
        },
      }),
    ],
    [columnHelper]
  );

  // Configuración de la tabla con TanStack Table
  const table = useReactTable({
    data: integrantesCirculo,
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

            {getVisiblePageNumbers().map((pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => table.setPageIndex(pageIndex)}
                className={`page-number ${currentPage === pageIndex ? 'active' : ''}`}
              >
                {pageIndex + 1}
              </button>
            ))}

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

  // Handler para ver detalles
  const handleViewDetails = (integrante) => {
    setViewDetailsIntegrante(integrante);
  };

  const handleCloseViewDetails = () => {
    setViewDetailsIntegrante(null);
  };

  return (
    <div className="neumorphic-crud-container">
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
        {/* Remover el div de mensajes locales ya que ahora se usa ToasterProvider */}
      </div>

      {table.getFilteredRowModel().rows.length === 0 ? (
        <div className="neumorphic-empty-state">
          <span className="empty-icon">🔍</span>
          <p>No se encontraron registros que coincidan con su búsqueda</p>
        </div>
      ) : (
        <>
          <div className="neumorphic-table-container">
            <table className="neumorphic-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th 
                        key={header.id}
                        className={header.column.columnDef.meta?.headerClassName || ''}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {typeof header.column.columnDef.header === 'function'
                              ? header.column.columnDef.header(header.getContext())
                              : header.column.columnDef.header}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted()] ?? null}
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
                        className={cell.column.columnDef.meta?.cellClassName || ''}
                      >
                        {typeof cell.column.columnDef.cell === 'function'
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.getValue()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginación usando TanStack Table */}
          <PaginationControls />
        </>
      )}

      {/* Modal de edición */}
      {selectedIntegrante && (
        <IntegranteCirculoEdit 
          integrante={selectedIntegrante} 
          onClose={handleCloseEdit}
        />
      )}

      {/* Modal de visualización de detalles */}
      {viewDetailsIntegrante && (
        <IntegranteCirculoView 
          integrante={viewDetailsIntegrante} 
          onClose={handleCloseViewDetails}
        />
      )}
    </div>
  );
};

export default IntegranteCirculoCRUD;