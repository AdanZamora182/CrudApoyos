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
import { useToaster } from "../../components/ui/ToasterProvider";
import CabezaCirculoEdit from './CabezaCirculoEdit';
import CabezaCirculoView from './CabezaCirculoView';
import { ExcelButton } from '../../components/buttons/ExcelButton.styles';

// Styled components para tabla
import {
  CrudContainer,
  CrudControls,
  TableContainer,
  Table,
  ActionColumn,
  LoaderContainer,
  Loader,
  EmptyState,
  EmptyIcon,
} from '../../components/tables/Table.styles';
import { EditButton, DeleteButton, ViewButton } from '../../components/tables/ActionButtons.styles';
import { SearchContainer, SearchInput, SearchIcon } from '../../components/tables/SearchBar.styles';
import {
  PaginationContainer,
  PaginationTopRow,
  PageSizeSelector,
  PageSizeSelect,
  PaginationInfo,
  PaginationControls as PaginationControlsWrapper,
  PaginationButton,
  PageNumbers,
  PageNumber,
  PageEllipsis,
} from '../../components/tables/Pagination.styles';

// Clave para persistir el tamaño de página en localStorage
const PAGE_SIZE_KEY = 'cabezasCirculo_pageSize';
const DEFAULT_PAGE_SIZE = 10;

// Función para obtener el tamaño de página guardado
const getSavedPageSize = () => {
  const saved = localStorage.getItem(PAGE_SIZE_KEY);
  return saved ? Number(saved) : DEFAULT_PAGE_SIZE;
};

const CabezaCirculoCRUD = () => {
  // Estado para manejar el registro seleccionado para edición
  const [selectedCabeza, setSelectedCabeza] = useState(null);
  
  // Estado para manejar el registro seleccionado para ver detalles
  const [viewDetailsCabeza, setViewDetailsCabeza] = useState(null);
  
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
      // Columna de acciones (ver, editar y eliminar)
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        cell: (props) => (
          <ActionColumn>
            <ViewButton 
              onClick={() => handleViewDetails(props.row.original)}
              title="Ver Detalles"
            >
              <i className="bi bi-eye"></i>
            </ViewButton>
            <EditButton 
              onClick={() => handleEdit(props.row.original)}
              title="Editar"
            >
              <i className="bi bi-pencil-square"></i>
            </EditButton>
            <DeleteButton 
              onClick={() => handleDelete(props.row.original.id)}
              title="Eliminar"
            >
              <i className="bi bi-trash3"></i>
            </DeleteButton>
          </ActionColumn>
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
        pageSize: getSavedPageSize(), // Usar tamaño guardado o 10 por defecto
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

  // Función para abrir el modal de ver detalles
  const handleViewDetails = (cabeza) => {
    setViewDetailsCabeza(cabeza);
  };

  // Función para cerrar el modal de ver detalles
  const handleCloseViewDetails = () => {
    setViewDetailsCabeza(null);
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
      <CrudContainer>
        <LoaderContainer>
          <Loader />
          <p>Cargando datos...</p>
        </LoaderContainer>
      </CrudContainer>
    );
  }

  // Mostrar estado de error
  if (isError) {
    return (
      <CrudContainer>
        <EmptyState>
          <EmptyIcon>⚠️</EmptyIcon>
          <p>Error al cargar los datos: {error?.message}</p>
        </EmptyState>
      </CrudContainer>
    );
  }

  // Función auxiliar para generar números de página visibles en la paginación
  const getVisiblePageNumbers = () => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();
    // Reducido a 1 para mostrar máximo 3 páginas centrales (mejor para móviles)
    const delta = 1;
    
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

  // Componente de controles de paginación mejorado - diseño minimalista
  const PaginationControls = () => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;
    const totalRows = table.getFilteredRowModel().rows.length;
    
    const startRow = currentPage * pageSize + 1;
    const endRow = Math.min((currentPage + 1) * pageSize, totalRows);
    
    return (
      <PaginationContainer>
        {/* Lado izquierdo: selector de registros e información */}
        <PaginationTopRow>
          <PageSizeSelector>
            <label htmlFor="pageSize">Mostrar:</label>
            <PageSizeSelect
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                table.setPageSize(newSize);
                localStorage.setItem(PAGE_SIZE_KEY, newSize);
              }}
            >
              {[5, 10, 15, 20, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </PageSizeSelect>
          </PageSizeSelector>

          <PaginationInfo>
            {startRow}-{endRow} de {totalRows} Registros
          </PaginationInfo>
        </PaginationTopRow>

        {/* Lado derecho: controles de navegación */}
        <PaginationControlsWrapper>
          <PaginationButton
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title="Primera página"
          >
            <i className="bi bi-chevron-double-left"></i>
          </PaginationButton>

          <PaginationButton
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Página anterior"
          >
            <i className="bi bi-chevron-left"></i>
          </PaginationButton>

          <PageNumbers>
            {getVisiblePageNumbers()[0] > 0 && (
              <>
                <PageNumber onClick={() => table.setPageIndex(0)}>1</PageNumber>
                {getVisiblePageNumbers()[0] > 1 && <PageEllipsis>…</PageEllipsis>}
              </>
            )}

            {getVisiblePageNumbers().map((pageIndex) => (
              <PageNumber
                key={pageIndex}
                onClick={() => table.setPageIndex(pageIndex)}
                className={currentPage === pageIndex ? 'active' : ''}
              >
                {pageIndex + 1}
              </PageNumber>
            ))}

            {getVisiblePageNumbers()[getVisiblePageNumbers().length - 1] < totalPages - 1 && (
              <>
                {getVisiblePageNumbers()[getVisiblePageNumbers().length - 1] < totalPages - 2 && (
                  <PageEllipsis>…</PageEllipsis>
                )}
                <PageNumber onClick={() => table.setPageIndex(totalPages - 1)}>
                  {totalPages}
                </PageNumber>
              </>
            )}
          </PageNumbers>

          <PaginationButton
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Página siguiente"
          >
            <i className="bi bi-chevron-right"></i>
          </PaginationButton>

          <PaginationButton
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
            title="Última página"
          >
            <i className="bi bi-chevron-double-right"></i>
          </PaginationButton>
        </PaginationControlsWrapper>
      </PaginationContainer>
    );
  };

  return (
    <CrudContainer>
      {/* Barra de controles con búsqueda */}
      <CrudControls>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Buscar por Nombre o Clave de Elector..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <SearchIcon className="bi bi-search" />
        </SearchContainer>

        {/* Botón de exportar a Excel */}
        <ExcelButton onClick={handleExportToExcel}>
          <i className="bi bi-file-earmark-excel"></i>
          <span>Exportar Excel</span>
        </ExcelButton>
      </CrudControls>

      {/* Mostrar tabla o estado vacío */}
      {table.getFilteredRowModel().rows.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <p>No se encontraron registros que coincidan con su búsqueda</p>
        </EmptyState>
      ) : (
        <>
          {/* Tabla con datos */}
          <TableContainer>
            <Table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={header.column.columnDef.meta?.headerClassName || ''}
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
                        className={cell.column.columnDef.meta?.cellClassName || ''}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>

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

      {/* Modal de ver detalles */}
      {viewDetailsCabeza && (
        <CabezaCirculoView 
          cabeza={viewDetailsCabeza} 
          onClose={handleCloseViewDetails}
        />
      )}
    </CrudContainer>
  );
};

export default CabezaCirculoCRUD;