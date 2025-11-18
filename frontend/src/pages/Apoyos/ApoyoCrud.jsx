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
  updateApoyo, 
  buscarCabezasCirculo, 
  buscarIntegrantesCirculo,
  exportApoyosToExcel
} from "../../api";
import "./ApoyoForm.css";
import { useToaster } from "../../components/ui/ToasterProvider"; // Agregar import
import { ExcelButton } from '../../components/buttons/ExcelButton.styles';

const ApoyoCRUD = () => {
  // Estado para manejar el registro seleccionado para edición
  const [selectedApoyo, setSelectedApoyo] = useState(null);
  
  // Estado para el filtro global de búsqueda en la tabla
  const [globalFilter, setGlobalFilter] = useState("");
  
  // Reemplazar estado de mensaje local con ToasterProvider
  const { showSuccess, showError } = useToaster();

  const [viewDetailsApoyo, setViewDetailsApoyo] = useState(null);
  const [searchBeneficiarioQuery, setSearchBeneficiarioQuery] = useState("");
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [selectedNewBeneficiario, setSelectedNewBeneficiario] = useState(null);
  
  // Hooks de TanStack Query para manejo de estado del servidor
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

  // Mutación para actualizar un registro de apoyo
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateApoyo(id, data),
    onSuccess: () => {
      // Invalidar la consulta para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["apoyos"] });
      showSuccess("Apoyo actualizado exitosamente.");
      setSelectedApoyo(null); // Cerrar el modal de edición
      setSelectedNewBeneficiario(null); // Reset selected beneficiary
    },
    onError: (error) => {
      console.error("Error updating apoyo:", error);
      showError("Error al actualizar el apoyo.");
    },
  });

  // Modified handleEdit function to reset the beneficiary search state
  const handleEdit = (apoyo) => {
    setSelectedApoyo(apoyo);
    setSelectedNewBeneficiario(null);
    setSearchBeneficiarioQuery("");
    setBeneficiarios([]);
  };

  // Input validation for specific fields
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    
    // Field-specific validations
    switch (field) {
      case 'cantidad':
        // Only allow numbers
        if (value !== '' && !/^\d+$/.test(value)) {
          return;
        }
        break;
      default:
        break;
    }

    // Update the state
    setSelectedApoyo({ ...selectedApoyo, [field]: value });
  };

  // Add this handler for beneficiary search when editing
  const handleSearchBeneficiarios = async (e) => {
    const query = e.target.value;
    setSearchBeneficiarioQuery(query);
    if (query.length > 2) {
      try {
        const [cabezas, integrantes] = await Promise.all([
          buscarCabezasCirculo(query),
          buscarIntegrantesCirculo(query),
        ]);
        setBeneficiarios([
          ...cabezas.map((cabeza) => ({ ...cabeza, tipo: "cabeza" })),
          ...integrantes.map((integrante) => ({ ...integrante, tipo: "integrante" })),
        ]);
      } catch (error) {
        console.error("Error al buscar beneficiarios:", error);
      }
    } else {
      setBeneficiarios([]);
    }
  };

  // Add handler for selecting a new beneficiary
  const handleSelectNewBeneficiario = (beneficiario) => {
    setSelectedNewBeneficiario(beneficiario);
    setSearchBeneficiarioQuery(""); // Clear the search query
    setBeneficiarios([]); // Clear the search results
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

  // Update handleUpdateSubmit function to handle custom tipo apoyo
  const handleUpdateSubmit = async (updatedApoyo) => {
    // Create a copy of the updated apoyo to modify
    const apoyoToUpdate = { ...updatedApoyo };
    
    // If a new beneficiary was selected, update the apoyo data
    if (selectedNewBeneficiario) {
      // Reset both beneficiary types first
      apoyoToUpdate.persona = null;
      apoyoToUpdate.cabeza = null;
      
      // Set the appropriate beneficiary based on type
      if (selectedNewBeneficiario.tipo === "integrante") {
        apoyoToUpdate.persona = { id: selectedNewBeneficiario.id };
      } else if (selectedNewBeneficiario.tipo === "cabeza") {
        apoyoToUpdate.cabeza = { id: selectedNewBeneficiario.id };
      }
    }

    // Handle custom tipo apoyo if "Otro" is selected
    if (apoyoToUpdate.tipoApoyo === "Otro" && apoyoToUpdate.tipoApoyoCustom) {
      apoyoToUpdate.tipoApoyo = apoyoToUpdate.tipoApoyoCustom.trim();
      delete apoyoToUpdate.tipoApoyoCustom; // Remove the custom field before sending to API
    }

    // Ensure cantidad is a number
    if (apoyoToUpdate.cantidad) {
      apoyoToUpdate.cantidad = parseInt(apoyoToUpdate.cantidad, 10);
    }

    updateMutation.mutate({ id: apoyoToUpdate.id, data: apoyoToUpdate });
  };

  // Format date for display (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleViewDetails = (apoyo) => {
    // Create a copy to avoid modifying the original
    const apoyoDetails = { ...apoyo };
    
    // For Integrantes de Circulo, fetch their associated Cabeza de Circulo
    if (apoyo.persona && apoyo.persona.lider) {
      // The persona's lider data is already included in the API response
      apoyoDetails.lider = apoyo.persona.lider;
    }
    
    setViewDetailsApoyo(apoyoDetails);
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

      {/* Edit Modal */}
      {selectedApoyo && (
        <div className="neumorphic-modal">
          <div className="neumorphic-modal-content large-modal">
            <div className="modal-header">
              <h3>Editar Apoyo</h3>
              <button 
                className="close" 
                onClick={() => setSelectedApoyo(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateSubmit(selectedApoyo);
                }}
                className="edit-form"
              >
                <div className="modal-sections">
                  <div className="modal-section">
                    <h4 className="section-title">Información del Apoyo</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Cantidad</label>
                        <input
                          type="number"
                          className="neumorphic-input"
                          value={selectedApoyo.cantidad || ''}
                          onChange={(e) => setSelectedApoyo({ ...selectedApoyo, cantidad: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Tipo de Apoyo</label>
                        <select
                          className="neumorphic-input"
                          value={selectedApoyo.tipoApoyo || ''}
                          onChange={(e) => setSelectedApoyo({ ...selectedApoyo, tipoApoyo: e.target.value })}
                          required
                        >
                          <option value="">Seleccione una opción</option>
                          {predefinedOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {selectedApoyo.tipoApoyo === "Otro" && (
                          <div className="custom-input-container">
                            <input
                              type="text"
                              placeholder="Especifique el tipo de apoyo"
                              value={selectedApoyo.tipoApoyoCustom || ''}
                              onChange={(e) => setSelectedApoyo({
                                ...selectedApoyo,
                                tipoApoyoCustom: e.target.value,
                              })}
                              className="custom-input"
                              autoComplete="off"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Fecha de Entrega</label>
                        <input
                          type="date"
                          className="neumorphic-input"
                          value={formatDate(selectedApoyo.fechaEntrega) || ''}
                          onChange={(e) => setSelectedApoyo({ ...selectedApoyo, fechaEntrega: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Current beneficiary information */}
                  <div className="modal-section">
                    <h4 className="section-title">Beneficiario Actual</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <p>
                          {selectedApoyo.persona
                            ? `${selectedApoyo.persona.nombre} ${selectedApoyo.persona.apellidoPaterno} ${selectedApoyo.persona.apellidoMaterno} - Integrante de Círculo`
                            : selectedApoyo.cabeza
                              ? `${selectedApoyo.cabeza.nombre} ${selectedApoyo.cabeza.apellidoPaterno} ${selectedApoyo.cabeza.apellidoMaterno} - Cabeza de Círculo`
                              : "No hay beneficiario asignado"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cambiar Beneficiario section with increased height */}
                  <div className="modal-section">
                    <h4 className="section-title">Cambiar Beneficiario</h4>
                    <div className="beneficiary-edit-section">
                      <div className="form-row">
                        <div className="form-group" style={{ position: "relative" }}>
                          <label>Buscar Nuevo Beneficiario</label>
                          <input
                            type="text"
                            className="neumorphic-input"
                            placeholder="Nombre o Clave de Elector"
                            value={searchBeneficiarioQuery}
                            onChange={handleSearchBeneficiarios}
                            autoComplete="off"
                          />
                          {beneficiarios.length > 0 && (
                            <ul className="search-results">
                              {beneficiarios.map((beneficiario) => (
                                <li
                                  key={`${beneficiario.tipo}-${beneficiario.id}`}
                                  onClick={() => handleSelectNewBeneficiario(beneficiario)}
                                  className="search-result-item"
                                >
                                  {`${beneficiario.nombre} ${beneficiario.apellidoPaterno} ${beneficiario.apellidoMaterno} - ${beneficiario.claveElector} (${beneficiario.tipo === "cabeza" ? "Cabeza de Círculo" : "Integrante de Círculo"})`}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      
                      <div className="selected-beneficiary-container">
                        {selectedNewBeneficiario && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Nuevo Beneficiario Seleccionado</label>
                              <input
                                type="text"
                                className="neumorphic-input selected-beneficiary"
                                value={`${selectedNewBeneficiario.nombre} ${selectedNewBeneficiario.apellidoPaterno} ${selectedNewBeneficiario.apellidoMaterno} - ${selectedNewBeneficiario.claveElector}`}
                                readOnly
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="neumorphic-button cancel" onClick={() => setSelectedApoyo(null)}>
                    <i className="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                  <button type="submit" className="neumorphic-button primary">
                    <i className="bi bi-floppy me-2"></i>Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewDetailsApoyo && (
        <div className="neumorphic-modal">
          <div className="neumorphic-modal-content large-modal">
            <div className="modal-header">
              <h3>Detalles del Apoyo</h3>
              <button 
                className="close" 
                onClick={() => setViewDetailsApoyo(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="details-container">
              {/* Información del Apoyo */}
              <div className="details-section">
                <h4>Información del Apoyo</h4>
                <div className="details-grid wide-grid">
                  <div className="detail-item">
                    <span className="detail-label">ID</span>
                    <span className="detail-value">{viewDetailsApoyo.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tipo de Apoyo</span>
                    <span className="detail-value">{viewDetailsApoyo.tipoApoyo}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Cantidad</span>
                    <span className="detail-value">{viewDetailsApoyo.cantidad}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha de Entrega</span>
                    <span className="detail-value">{formatDate(viewDetailsApoyo.fechaEntrega)}</span>
                  </div>
                </div>
              </div>
              
              {/* Información del Beneficiario */}
              <div className="details-section">
                <h4>Información del Beneficiario</h4>
                {viewDetailsApoyo.persona ? (
                  <div className="details-grid wide-grid">
                    <div className="detail-item">
                      <span className="detail-label">Tipo</span>
                      <span className="detail-value">Integrante de Círculo</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Nombre Completo</span>
                      <span className="detail-value">
                        {`${viewDetailsApoyo.persona.nombre} ${viewDetailsApoyo.persona.apellidoPaterno} ${viewDetailsApoyo.persona.apellidoMaterno}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Clave de Elector</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.claveElector}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.telefono}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dirección</span>
                      <span className="detail-value">
                        {`${viewDetailsApoyo.persona.calle} #${viewDetailsApoyo.persona.noExterior}
                         ${viewDetailsApoyo.persona.noInterior ? ", Int: " + viewDetailsApoyo.persona.noInterior : ""}, 
                         Col. ${viewDetailsApoyo.persona.colonia}, CP: ${viewDetailsApoyo.persona.codigoPostal}`}
                      </span>
                    </div>
                  </div>
                ) : viewDetailsApoyo.cabeza ? (
                  <div className="details-grid wide-grid">
                    <div className="detail-item">
                      <span className="detail-label">Tipo</span>
                      <span className="detail-value">Cabeza de Círculo</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Nombre Completo</span>
                      <span className="detail-value">
                        {`${viewDetailsApoyo.cabeza.nombre} ${viewDetailsApoyo.cabeza.apellidoPaterno} ${viewDetailsApoyo.cabeza.apellidoMaterno}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Clave de Elector</span>
                      <span className="detail-value">{viewDetailsApoyo.cabeza.claveElector}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono</span>
                      <span className="detail-value">{viewDetailsApoyo.cabeza.telefono}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dirección</span>
                      <span className="detail-value">
                        {`${viewDetailsApoyo.cabeza.calle} #${viewDetailsApoyo.cabeza.noExterior}
                         ${viewDetailsApoyo.cabeza.noInterior ? ", Int: " + viewDetailsApoyo.cabeza.noInterior : ""}, 
                         Col. ${viewDetailsApoyo.cabeza.colonia}, CP: ${viewDetailsApoyo.cabeza.codigoPostal}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estructura Territorial</span>
                      <span className="detail-value">{viewDetailsApoyo.cabeza.estructuraTerritorial || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Posición en Estructura</span>
                      <span className="detail-value">{viewDetailsApoyo.cabeza.posicionEstructura || "N/A"}</span>
                    </div>
                  </div>
                ) : (
                  <p>No se encontró información del beneficiario</p>
                )}
              </div>
              
              {/* Show Cabeza de Círculo details if the beneficiary is an Integrante with a leader */}
              {viewDetailsApoyo.persona && viewDetailsApoyo.persona.lider && (
                <div className="details-section">
                  <h4>Cabeza de Círculo Asociada</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Nombre Completo</span>
                      <span className="detail-value">
                        {`${viewDetailsApoyo.persona.lider.nombre} ${viewDetailsApoyo.persona.lider.apellidoPaterno} ${viewDetailsApoyo.persona.lider.apellidoMaterno}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Clave de Elector</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.lider.claveElector}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.lider.telefono}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estructura Territorial</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.lider.estructuraTerritorial || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Posición en Estructura</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.lider.posicionEstructura || "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="modal-footer">
                <button 
                  className="close modal-close-button" 
                  onClick={() => setViewDetailsApoyo(null)}
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

export default ApoyoCRUD;