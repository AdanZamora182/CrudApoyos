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
import { getAllCabezasCirculo, deleteCabezaCirculo, updateCabezaCirculo } from "../../api";
import "./CabezaCirculo.css";

const CabezaCirculoCRUD = () => {
  // Estado para manejar el registro seleccionado para edición
  const [selectedCabeza, setSelectedCabeza] = useState(null);
  
  // Estado para el filtro global de búsqueda en la tabla
  const [globalFilter, setGlobalFilter] = useState("");
  
  // Estado para mostrar mensajes de éxito o error al usuario
  const [message, setMessage] = useState({ type: "", text: "" });
  
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
      setMessage({ type: "success", text: "Registro eliminado exitosamente." });
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    },
    onError: (error) => {
      console.error("Error deleting record:", error);
      setMessage({ type: "error", text: "Error al eliminar el registro." });
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    },
  });

  // Mutación para actualizar un registro de cabeza de círculo
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCabezaCirculo(id, data),
    onSuccess: () => {
      // Invalidar la consulta para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["cabezasCirculo"] });
      setMessage({ type: "success", text: "Registro actualizado exitosamente." });
      setSelectedCabeza(null); // Cerrar el modal de edición
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    },
    onError: (error) => {
      console.error("Error updating record:", error);
      setMessage({ type: "error", text: "Error al actualizar el registro." });
      setTimeout(() => setMessage({ type: "", text: "" }), 10000);
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

  // Función para manejar cambios en los campos del formulario de edición con validaciones
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    
    // Validaciones específicas por campo
    switch (field) {
      case 'telefono':
        // Solo permitir números y máximo 10 dígitos
        if (value !== '' && (!/^\d+$/.test(value) || value.length > 10)) {
          return;
        }
        break;
      case 'codigoPostal':
        // Solo permitir números y máximo 5 dígitos
        if (value !== '' && (!/^\d+$/.test(value) || value.length > 5)) {
          return;
        }
        break;
      case 'noExterior':
      case 'noInterior':
        // Solo permitir números para números de casa
        if (value !== '' && !/^\d+$/.test(value)) {
          return;
        }
        break;
      case 'claveElector':
        // Máximo 18 caracteres para clave de elector
        if (value.length > 18) {
          return;
        }
        break;
      default:
        break;
    }

    // Actualizar el estado del registro seleccionado
    setSelectedCabeza({ ...selectedCabeza, [field]: value });
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
      {/* Barra de controles con búsqueda y mensajes */}
      <div className="neumorphic-controls">
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

        {/* Mostrar mensajes de éxito o error */}
        {message.text && (
          <div className="inline-message-container">
            <div className={`inline-message inline-message-${message.type}`}>
              {message.type === "success" ? "✅ " : "⚠️ "}
              {message.text}
            </div>
          </div>
        )}
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

      {/* Modal de edición con estilo sobrio */}
      {selectedCabeza && (
        <div className="neumorphic-modal">
          <div className="neumorphic-modal-content large-modal">
            {/* Cabecera del modal */}
            <div className="modal-header">
              <h3>Editar Registro</h3>
              <button 
                className="close" 
                onClick={() => setSelectedCabeza(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            {/* Contenido del modal con formulario de edición */}
            <div className="modal-content-wrapper sober-form">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateSubmit(selectedCabeza);
                }}
                className="edit-form"
              >
                <div className="modal-sections">
                  {/* Sección de información personal */}
                  <div className="sober-section">
                    <h4 className="sober-section-title">Información Personal</h4>
                    <div className="form-row">
                      <div className="form-group" style={{ flex: "1.2" }}>
                        <label>Nombre(s)</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.nombre || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, nombre: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1" }}>
                        <label>Apellido Paterno</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.apellidoPaterno || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, apellidoPaterno: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1" }}>
                        <label>Apellido Materno</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.apellidoMaterno || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, apellidoMaterno: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group" style={{ flex: "1" }}>
                        <label>Fecha de Nacimiento</label>
                        <input
                          type="date"
                          className="sober-input"
                          value={formatDate(selectedCabeza.fechaNacimiento) || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, fechaNacimiento: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: "0.8" }}>
                        <label>Teléfono</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.telefono || ''}
                          onChange={(e) => handleInputChange(e, 'telefono')}
                          maxLength="10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección de dirección */}
                  <div className="sober-section">
                    <h4 className="sober-section-title">Dirección</h4>
                    <div className="form-row">
                      <div className="form-group" style={{ flex: "2" }}>
                        <label>Calle</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.calle || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, calle: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1.5" }}>
                        <label>Colonia</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.colonia || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, colonia: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group" style={{ flex: "0.7" }}>
                        <label>No. Exterior</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.noExterior || ''}
                          onChange={(e) => handleInputChange(e, 'noExterior')}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: "0.7" }}>
                        <label>No. Interior</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.noInterior || ''}
                          onChange={(e) => handleInputChange(e, 'noInterior')}
                        />
                      </div>
                      <div className="form-group" style={{ flex: "0.8" }}>
                        <label>Código Postal</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.codigoPostal || ''}
                          onChange={(e) => handleInputChange(e, 'codigoPostal')}
                          maxLength="5"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1.2" }}>
                        <label>Municipio</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.municipio || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, municipio: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección de información electoral y contacto */}
                  <div className="sober-section">
                    <h4 className="sober-section-title">Información Electoral y Contacto</h4>
                    <div className="form-row">
                      <div className="form-group" style={{ flex: "1.2" }}>
                        <label>Clave de Elector</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.claveElector || ''}
                          onChange={(e) => handleInputChange(e, 'claveElector')}
                          maxLength="18"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1.5" }}>
                        <label>Email</label>
                        <input
                          type="email"
                          className="sober-input"
                          value={selectedCabeza.email || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group" style={{ flex: "1" }}>
                        <label>Facebook</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.facebook || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, facebook: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1" }}>
                        <label>Otra Red Social</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.otraRedSocial || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, otraRedSocial: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección de estructura */}
                  <div className="sober-section">
                    <h4 className="sober-section-title">Estructura</h4>
                    <div className="form-row">
                      <div className="form-group" style={{ flex: "1" }}>
                        <label>Estructura Territorial</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.estructuraTerritorial || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, estructuraTerritorial: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1" }}>
                        <label>Posición en Estructura</label>
                        <input
                          type="text"
                          className="sober-input"
                          value={selectedCabeza.posicionEstructura || ''}
                          onChange={(e) => setSelectedCabeza({ ...selectedCabeza, posicionEstructura: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción del formulario */}
                <div className="sober-form-actions">
                  <button type="button" className="sober-button sober-button-secondary" onClick={() => setSelectedCabeza(null)}>
                    <i className="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="sober-button sober-button_primary"
                    disabled={updateMutation.isPending}
                  >
                    <i className="bi bi-floppy me-2"></i>
                    {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CabezaCirculoCRUD;