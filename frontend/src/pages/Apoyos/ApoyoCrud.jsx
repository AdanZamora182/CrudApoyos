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
  getApoyos, 
  deleteApoyo, 
  buscarCabezasCirculo, 
  buscarIntegrantesCirculo,
  exportApoyosToExcel
} from "../../api";
import "./ApoyoForm.css";
import { useToaster } from "../../components/ui/ToasterProvider"; // Agregar import
import { ExcelButton } from '../../components/buttons/ExcelButton.styles';
import ApoyoEdit from './ApoyoEdit';
import ApoyoView from './ApoyoView';

const ApoyoCRUD = () => {
  const [selectedApoyo, setSelectedApoyo] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const { showSuccess, showError } = useToaster();
  const [viewDetailsApoyo, setViewDetailsApoyo] = useState(null);
  
  const queryClient = useQueryClient();
  const columnHelper = createColumnHelper();

  // Consulta para obtener todos los registros de apoyos
  const {
    data: apoyos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["apoyos"],
    queryFn: async () => {
      const response = await getApoyos();
      return response.sort((a, b) => b.id - a.id);
    },
    staleTime: 5 * 60 * 1000, // Los datos se consideran frescos por 5 minutos
  });

  // Mutación para eliminar un registro de apoyo
  const deleteMutation = useMutation({
    mutationFn: deleteApoyo,
    onSuccess: () => {
      // Invalidar la consulta para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["apoyos"] });
      showSuccess("Apoyo eliminado exitosamente.");
    },
    onError: (error) => {
      console.error("Error deleting apoyo:", error);
      showError("Error al eliminar el apoyo.");
    },
  });

  // Función para confirmar y ejecutar la eliminación de un registro
  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este apoyo?")) {
      deleteMutation.mutate(id);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (apoyo) => {
    setSelectedApoyo(apoyo);
  };

  const handleCloseEdit = () => {
    setSelectedApoyo(null);
  };

  // Función para descargar el archivo Excel
  const handleExportToExcel = async () => {
    try {
      const blob = await exportApoyosToExcel();
      
      // Crear URL para el blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `apoyos-${new Date().toISOString().split('T')[0]}.xlsx`;
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
      // Columna para tipo de apoyo
      columnHelper.accessor("tipoApoyo", {
        header: "Tipo de Apoyo",
        cell: (info) => info.getValue(),
        filterFn: "includesString",
      }),
      // Columna para cantidad
      columnHelper.accessor("cantidad", {
        header: "Cantidad",
        cell: (info) => info.getValue(),
        enableGlobalFilter: false,
      }),
      // Columna para fecha de entrega con formato
      columnHelper.accessor("fechaEntrega", {
        header: "Fecha de Entrega",
        cell: (info) => {
          const date = info.getValue();
          return date ? new Date(date).toISOString().split('T')[0] : "";
        },
        enableGlobalFilter: false,
      }),
      // Columna para beneficiario
      columnHelper.accessor((row) => {
        return row.persona 
          ? `${row.persona.nombre} ${row.persona.apellidoPaterno} ${row.persona.apellidoMaterno}`
          : row.cabeza
            ? `${row.cabeza.nombre} ${row.cabeza.apellidoPaterno} ${row.cabeza.apellidoMaterno}`
            : "No asignado";
      }, {
        id: "beneficiario",
        header: "Beneficiario",
        filterFn: "includesString",
      }),
      // Columna para tipo de beneficiario
      columnHelper.accessor((row) => {
        return row.persona 
          ? "Integrante de Círculo" 
          : row.cabeza 
            ? "Cabeza de Círculo" 
            : "-";
      }, {
        id: "tipoBeneficiario",
        header: "Tipo de Beneficiario",
        enableGlobalFilter: false,
      }),
      // Columna para clave de elector
      columnHelper.accessor((row) => {
        return row.persona 
          ? row.persona.claveElector 
          : row.cabeza 
            ? row.cabeza.claveElector 
            : "-";
      }, {
        id: "claveElector",
        header: "Clave de Elector",
        filterFn: "includesString",
      }),
      // Columna para teléfono
      columnHelper.accessor((row) => {
        return row.persona 
          ? row.persona.telefono 
          : row.cabeza 
            ? row.cabeza.telefono 
            : "-";
      }, {
        id: "telefono",
        header: "Teléfono",
        enableGlobalFilter: false,
      }),
      // Columna para calle
      columnHelper.accessor((row) => {
        return row.persona 
          ? row.persona.calle 
          : row.cabeza 
            ? row.cabeza.calle 
            : "-";
      }, {
        id: "calle",
        header: "Calle",
        filterFn: "includesString",
      }),
      // Columna para número exterior
      columnHelper.accessor((row) => {
        return row.persona 
          ? row.persona.noExterior 
          : row.cabeza 
            ? row.cabeza.noExterior 
            : "-";
      }, {
        id: "noExterior",
        header: "No. Exterior",
        enableGlobalFilter: false,
      }),
      // Columna para número interior
      columnHelper.accessor((row) => {
        return row.persona 
          ? (row.persona.noInterior || "-") 
          : row.cabeza 
            ? (row.cabeza.noInterior || "-") 
            : "-";
      }, {
        id: "noInterior",
        header: "No. Interior",
        enableGlobalFilter: false,
      }),
      // Columna para colonia
      columnHelper.accessor((row) => {
        return row.persona 
          ? row.persona.colonia 
          : row.cabeza 
            ? row.cabeza.colonia 
            : "-";
      }, {
        id: "colonia",
        header: "Colonia",
        filterFn: "includesString",
      }),
      // Columna para código postal
      columnHelper.accessor((row) => {
        return row.persona 
          ? row.persona.codigoPostal 
          : row.cabeza 
            ? row.cabeza.codigoPostal 
            : "-";
      }, {
        id: "codigoPostal",
        header: "Código Postal",
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
    data: apoyos,
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

  // Add the predefined options list (same as in ApoyoForm)
  const predefinedOptions = [
    "Tinaco",
    "Silla de ruedas",
    "Calentador Solar",
    "Muletas",
    "Bastón",
    "Jitomate",
    "Pepino",
    "Juguete",
    "Despensa",
    "Oxímetro",
    "Baumanómetro",
    "Frijol",
    "Ropa",
    "Calzado",
    "Otro",
  ];

  // Función para ver detalles de un apoyo
  const handleViewDetails = (apoyo) => {
    const apoyoDetails = { ...apoyo };
    
    if (apoyo.persona && apoyo.persona.lider) {
      apoyoDetails.lider = apoyo.persona.lider;
    }
    
    setViewDetailsApoyo(apoyoDetails);
  };

  const handleCloseViewDetails = () => {
    setViewDetailsApoyo(null);
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

  return (
    <div className="neumorphic-crud-container">
      <div className="neumorphic-controls">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 w-100">
          <div className="neumorphic-search w-100 w-md-50 position-relative">
            <input
              type="text"
              placeholder="Buscar por Tipo de Apoyo o Beneficiario..."
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

      {table.getFilteredRowModel().rows.length === 0 ? (
        <div className="neumorphic-empty-state">
          <span className="empty-icon">🔍</span>
          <p>No se encontraron apoyos que coincidan con su búsqueda</p>
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
      {selectedApoyo && (
        <ApoyoEdit 
          apoyo={selectedApoyo} 
          onClose={handleCloseEdit}
        />
      )}

      {/* Modal de visualización de detalles */}
      {viewDetailsApoyo && (
        <ApoyoView 
          apoyo={viewDetailsApoyo} 
          onClose={handleCloseViewDetails}
        />
      )}
    </div>
  );
};

export default ApoyoCRUD;