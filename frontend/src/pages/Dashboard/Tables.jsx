import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Form } from 'react-bootstrap';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getTopColoniasMasApoyos, getTopColoniasMenosApoyos } from '../../api/dashboardApi';
import {
  TablesContainer,
  TableCard,
  TableHeader,
  TableTitle,
  TableIconWrapper,
  FilterContainer,
  StyledTable,
  TableWrapper,
  EmptyState,
  LoadingState,
  PositionBadge,
  ColoniaText,
  PostalChip,
  TotalText,
} from '../../components/dashboard/Tables.styles';

const DashboardTables = () => {
  const currentYear = new Date().getFullYear();
  const [selectedMonthMas, setSelectedMonthMas] = useState('todos');
  const [selectedMonthMenos, setSelectedMonthMenos] = useState('todos');

  // Query para colonias con más apoyos
  const { data: dataColoniasMas = [], isLoading: loadingMas } = useQuery({
    queryKey: ['topColoniasMas', currentYear, selectedMonthMas],
    queryFn: () => {
      const month = selectedMonthMas === 'todos' ? null : selectedMonthMas;
      return getTopColoniasMasApoyos(currentYear, month);
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Query para colonias con menos apoyos
  const { data: dataColoniasMenos = [], isLoading: loadingMenos } = useQuery({
    queryKey: ['topColoniasMenos', currentYear, selectedMonthMenos],
    queryFn: () => {
      const month = selectedMonthMenos === 'todos' ? null : selectedMonthMenos;
      return getTopColoniasMenosApoyos(currentYear, month);
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const meses = [
    { value: 'todos', label: 'Todos los meses' },
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  // Column helper tipado para mejor estructura
  const columnHelper = createColumnHelper();

  // Columnas definidas con createColumnHelper para mejor tipado y estructura
  const columns = useMemo(
    () => [
      columnHelper.accessor('posicion', {
        header: 'Pos.',
        cell: (info) => <PositionBadge>{info.getValue()}</PositionBadge>,
        size: 60,
        enableSorting: true,
      }),
      columnHelper.accessor('colonia', {
        header: 'Colonia',
        cell: (info) => <ColoniaText>{info.getValue()}</ColoniaText>,
        size: 200,
        enableSorting: true,
      }),
      columnHelper.accessor('codigoPostal', {
        header: 'C.P.',
        cell: (info) => <PostalChip>{info.getValue() || 'N/A'}</PostalChip>,
        size: 80,
        enableSorting: false,
      }),
      columnHelper.accessor('totalApoyos', {
        header: 'Total',
        cell: (info) => <TotalText>{info.getValue().toLocaleString()}</TotalText>,
        size: 80,
        enableSorting: true,
      }),
    ],
    [columnHelper]
  );

  // Estado de ordenamiento para cada tabla
  const [sortingMas, setSortingMas] = useState([]);
  const [sortingMenos, setSortingMenos] = useState([]);

  // Tabla con más apoyos
  const tableMas = useReactTable({
    data: dataColoniasMas,
    columns,
    state: {
      sorting: sortingMas,
    },
    onSortingChange: setSortingMas,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Tabla con menos apoyos
  const tableMenos = useReactTable({
    data: dataColoniasMenos,
    columns,
    state: {
      sorting: sortingMenos,
    },
    onSortingChange: setSortingMenos,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const renderTableContent = (table, loading, data) => {
    if (loading) {
      return (
        <LoadingState>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando datos...</p>
        </LoadingState>
      );
    }

    if (data.length === 0) {
      return (
        <EmptyState>
          <div style={{ fontSize: 48, opacity: 0.3 }}>📊</div>
          <p>No hay datos disponibles para el período seleccionado</p>
        </EmptyState>
      );
    }

    return (
      <TableWrapper>
        <StyledTable className="table table-hover">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
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
                  <td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    );
  };

  return (
    <TablesContainer>
      {/* Tabla 1: Top Colonias con Más Apoyos */}
      <TableCard>
        <TableHeader>
          <TableIconWrapper $color="linear-gradient(135deg, #10b981 0%, #059669 100%)">
            <TrendingUp size={26} />
          </TableIconWrapper>
          <TableTitle>Top 7 Colonias con Más Apoyos ({currentYear})</TableTitle>
        </TableHeader>
        <FilterContainer>
          <Form.Select
            value={selectedMonthMas}
            onChange={(e) => setSelectedMonthMas(e.target.value)}
            className="form-select-sm"
          >
            {meses.map((mes) => (
              <option key={mes.value} value={mes.value}>
                {mes.label}
              </option>
            ))}
          </Form.Select>
        </FilterContainer>
        {renderTableContent(tableMas, loadingMas, dataColoniasMas)}
      </TableCard>

      {/* Tabla 2: Top Colonias con Menos Apoyos */}
      <TableCard>
        <TableHeader>
          <TableIconWrapper $color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
            <TrendingDown size={26} />
          </TableIconWrapper>
          <TableTitle>Top 7 Colonias con Menos Apoyos ({currentYear})</TableTitle>
        </TableHeader>
        <FilterContainer>
          <Form.Select
            value={selectedMonthMenos}
            onChange={(e) => setSelectedMonthMenos(e.target.value)}
            className="form-select-sm"
          >
            {meses.map((mes) => (
              <option key={mes.value} value={mes.value}>
                {mes.label}
              </option>
            ))}
          </Form.Select>
        </FilterContainer>
        {renderTableContent(tableMenos, loadingMenos, dataColoniasMenos)}
      </TableCard>
    </TablesContainer>
  );
};

export default DashboardTables;
