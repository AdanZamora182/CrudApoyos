import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
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
import { useToaster } from "../../components/ui/ToasterProvider";
import { ExcelButton } from '../../components/buttons/ExcelButton.styles';
import ApoyoEdit from './ApoyoEdit';
import ApoyoView from './ApoyoView';

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
import { ViewButton, EditButton, DeleteButton } from '../../components/tables/ActionButtons.styles';
import { SearchContainer, SearchInput, SearchIcon } from '../../components/tables/SearchBar.styles';
import {
  PaginationContainer,
  PaginationTopRow,
  PageSizeSelector,
  PageSizeSelect,
  PaginationInfo,
  PageInfo,
  PaginationControls as PaginationControlsWrapper,
  PaginationButton,
  PageNumbers,
  PageNumber,
  PageEllipsis,
} from '../../components/tables/Pagination.styles';

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
      <PaginationContainer>
        {/* Fila superior con selector de registros por página */}
        <PaginationTopRow>
          <PageSizeSelector>
            <label htmlFor="pageSize">Registros por página:</label>
            <PageSizeSelect
              id="pageSize"
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 12, 15, 20, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </PageSizeSelect>
          </PageSizeSelector>
        </PaginationTopRow>

        {/* Información de paginación centrada */}
        <PaginationInfo>
          Mostrando {startRow}-{endRow} de {totalRows} registros
          {totalRows > 0 && (
            <PageInfo>
              {" "}(Página {currentPage + 1} de {totalPages})
            </PageInfo>
          )}
        </PaginationInfo>

        {/* Controles de navegación de páginas */}
        <PaginationControlsWrapper>
          {/* Botón para ir a la primera página */}
          <PaginationButton
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title="Primera página"
          >
            <i className="bi bi-chevron-double-left"></i>
          </PaginationButton>

          {/* Botón para página anterior */}
          <PaginationButton
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Página anterior"
          >
            <i className="bi bi-chevron-left"></i>
          </PaginationButton>

          {/* Números de página */}
          <PageNumbers>
            {/* Mostrar primera página si no está en el rango visible */}
            {getVisiblePageNumbers()[0] > 0 && (
              <>
                <PageNumber 
                  onClick={() => table.setPageIndex(0)}
                >
                  1
                </PageNumber>
                {getVisiblePageNumbers()[0] > 1 && (
                  <PageEllipsis>...</PageEllipsis>
                )}
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
                  <PageEllipsis>...</PageEllipsis>
                )}
                <PageNumber 
                  onClick={() => table.setPageIndex(totalPages - 1)}
                >
                  {totalPages}
                </PageNumber>
              </>
            )}
          </PageNumbers>

          {/* Botón para página siguiente */}
          <PaginationButton
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Página siguiente"
          >
            <i className="bi bi-chevron-right"></i>
          </PaginationButton>

          {/* Botón para ir a la última página */}
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
      <CrudControls>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Buscar por Tipo de Apoyo o Beneficiario..."
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

      {table.getFilteredRowModel().rows.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <p>No se encontraron apoyos que coincidan con su búsqueda</p>
        </EmptyState>
      ) : (
        <>
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
    </CrudContainer>
  );
};

export default ApoyoCRUD;