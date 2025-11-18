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
  updateIntegranteCirculo, 
  buscarCabezasCirculo,
  exportIntegrantesCirculoToExcel
} from "../../api";
import { useToaster } from "../../components/ui/ToasterProvider"; // Agregar import
import { ExcelButton } from '../../components/buttons/ExcelButton.styles';
import "./IntegranteCirculo.css";
import IntegranteCirculoEdit from './IntegranteCirculoEdit';

const IntegranteCirculoCRUD = () => {
  // Estado para manejar el registro seleccionado para edición
  const [selectedIntegrante, setSelectedIntegrante] = useState(null);
  
  // Estado para el filtro global de búsqueda en la tabla
  const [globalFilter, setGlobalFilter] = useState("");
  
  // Reemplazar estado de mensaje local con ToasterProvider
  const { showSuccess, showError } = useToaster();

  // Add these new state variables for leader search and selection
  const [searchLiderQuery, setSearchLiderQuery] = useState("");
  const [searchLiderResults, setSearchLiderResults] = useState([]);

  // Add new state for view details modal
  const [viewDetailsIntegrante, setViewDetailsIntegrante] = useState(null);
  
  // Hooks de TanStack Query para manejo de estado del servidor
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

  // Mutación para actualizar un registro de integrante de círculo
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateIntegranteCirculo(id, data),
    onSuccess: () => {
      // Invalidar la consulta para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["integrantesCirculo"] });
      showSuccess("Registro actualizado exitosamente.");
      setSelectedIntegrante(null); // Cerrar el modal de edición
    },
    onError: (error) => {
      console.error("Error updating record:", error);
      showError("Error al actualizar el registro.");
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

  // Input validation for specific fields
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    
    // Field-specific validations
    switch (field) {
      case 'telefono':
        // Only allow numbers, max 10 characters
        if (value !== '' && (!/^\d+$/.test(value) || value.length > 10)) {
          return;
        }
        break;
      case 'codigoPostal':
        // Only allow numbers, max 5 characters
        if (value !== '' && (!/^\d+$/.test(value) || value.length > 5)) {
          return;
        }
        break;
      case 'noExterior':
      case 'noInterior':
        // Only allow numbers
        if (value !== '' && !/^\d+$/.test(value)) {
          return;
        }
        break;
      case 'claveElector':
        // Max 18 characters
        if (value.length > 18) {
          return;
        }
        break;
      default:
        break;
    }

    // Update the state
    setSelectedIntegrante({ ...selectedIntegrante, [field]: value });
  };

  // Add this function to handle searching for Cabezas de Círculo
  const handleSearchLider = async (e) => {
    const query = e.target.value;
    setSearchLiderQuery(query);
    
    if (query.length > 2) {
      try {
        const results = await buscarCabezasCirculo(query);
        setSearchLiderResults(results);
      } catch (error) {
        console.error("Error al buscar cabezas de círculo:", error);
      }
    } else {
      setSearchLiderResults([]);
    }
  };

  // Add this function to handle selecting a new leader
  const handleSelectLider = (cabeza) => {
    setSelectedIntegrante({
      ...selectedIntegrante,
      lider: cabeza
    });
    setSearchLiderQuery("");
    setSearchLiderResults([]);
  };

  // Add this function to handle removing a leader
  const handleRemoveLider = () => {
    setSelectedIntegrante({
      ...selectedIntegrante,
      lider: null
    });
  };

  // Función para procesar y enviar la actualización del registro
  const handleUpdateSubmit = async (updatedIntegrante) => {
    // Parse numeric fields
    const formattedIntegrante = {
      ...updatedIntegrante,
      telefono: updatedIntegrante.telefono ? Number.parseInt(updatedIntegrante.telefono) : null,
      noExterior: updatedIntegrante.noExterior ? Number.parseInt(updatedIntegrante.noExterior) : null,
      noInterior: updatedIntegrante.noInterior ? Number.parseInt(updatedIntegrante.noInterior) : null,
      codigoPostal: updatedIntegrante.codigoPostal ? Number.parseInt(updatedIntegrante.codigoPostal) : null,
      // Properly format the lider field - if there's a lider object, keep only its id
      lider: updatedIntegrante.lider ? { id: updatedIntegrante.lider.id } : null
    };

    updateMutation.mutate({ id: formattedIntegrante.id, data: formattedIntegrante });
  };

  // Format date for display (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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

  // Add handler for viewing details
  const handleViewDetails = (integrante) => {
    setViewDetailsIntegrante(integrante);
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

      {/* Modal de detalles (mantener como está) */}
      {viewDetailsIntegrante && (
        <div className="neumorphic-modal" onClick={() => setViewDetailsIntegrante(null)}>
          <div className="neumorphic-modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalles Completos</h3>
              <button 
                className="close" 
                onClick={() => setViewDetailsIntegrante(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="details-container">
              <div className="details-section">
                <h4 className="section-title">Información del Integrante de Círculo</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">{viewDetailsIntegrante.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nombre Completo:</span>
                    <span className="detail-value">{`${viewDetailsIntegrante.nombre} ${viewDetailsIntegrante.apellidoPaterno} ${viewDetailsIntegrante.apellidoMaterno}`}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha de Nacimiento:</span>
                    <span className="detail-value">{formatDate(viewDetailsIntegrante.fechaNacimiento)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Teléfono:</span>
                    <span className="detail-value">{viewDetailsIntegrante.telefono}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Dirección:</span>
                    <span className="detail-value">
                      {`${viewDetailsIntegrante.calle} ${viewDetailsIntegrante.noExterior}${viewDetailsIntegrante.noInterior ? `, Int. ${viewDetailsIntegrante.noInterior}` : ''}, ${viewDetailsIntegrante.colonia}, C.P. ${viewDetailsIntegrante.codigoPostal}`}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Clave de Elector:</span>
                    <span className="detail-value">{viewDetailsIntegrante.claveElector}</span>
                  </div>
                </div>
              </div>
              
              {viewDetailsIntegrante.lider ? (
                <div className="details-section">
                  <h4 className="section-title">Información del Líder (Cabeza de Círculo)</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Nombre Completo:</span>
                      <span className="detail-value">{`${viewDetailsIntegrante.lider.nombre} ${viewDetailsIntegrante.lider.apellidoPaterno} ${viewDetailsIntegrante.lider.apellidoMaterno}`}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fecha de Nacimiento:</span>
                      <span className="detail-value">{formatDate(viewDetailsIntegrante.lider.fechaNacimiento)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.telefono}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dirección:</span>
                      <span className="detail-value">
                        {`${viewDetailsIntegrante.lider.calle} ${viewDetailsIntegrante.lider.noExterior}${viewDetailsIntegrante.lider.noInterior ? `, Int. ${viewDetailsIntegrante.lider.noInterior}` : ''}, ${viewDetailsIntegrante.lider.colonia}, C.P. ${viewDetailsIntegrante.lider.codigoPostal}${viewDetailsIntegrante.lider.municipio ? `, ${viewDetailsIntegrante.lider.municipio}` : ''}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Clave de Elector:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.claveElector}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.email || "-"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Redes Sociales:</span>
                      <span className="detail-value">
                        {viewDetailsIntegrante.lider.facebook ? `Facebook: ${viewDetailsIntegrante.lider.facebook}` : ''}
                        {viewDetailsIntegrante.lider.facebook && viewDetailsIntegrante.lider.otraRedSocial ? ' | ' : ''}
                        {viewDetailsIntegrante.lider.otraRedSocial ? `Otra: ${viewDetailsIntegrante.lider.otraRedSocial}` : ''}
                        {!viewDetailsIntegrante.lider.facebook && !viewDetailsIntegrante.lider.otraRedSocial ? '-' : ''}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estructura Territorial:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.estructuraTerritorial || "-"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Posición en Estructura:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.posicionEstructura || "-"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="details-section">
                  <h4 className="section-title">Información del Líder</h4>
                  <p className="no-leader-message">Este integrante no tiene un líder (Cabeza de Círculo) asignado.</p>
                </div>
              )}
              
              <div className="modal-footer">
                <button 
                  className="close modal-close-button" 
                  onClick={() => setViewDetailsIntegrante(null)}
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    width: 'auto',
                    height: 'auto',
                    fontSize: '14px'
                  }}
                >
                  <i className="bi bi-check-circle me-2"></i>Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegranteCirculoCRUD;