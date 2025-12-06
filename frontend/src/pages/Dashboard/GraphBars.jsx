import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Form } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Calendar, TrendingUp } from 'lucide-react';
import { getApoyosByMonth, getApoyosByType } from '../../api/dashboardApi';
import {
  ChartContainer,
  ChartCard,
  ChartHeader,
  ChartTitle,
  ChartIconWrapper,
  ChartContent,
  FilterContainer,
  LoadingSpinnerWrapper,
  Spinner,
  EmptyStateWrapper,
} from '../../components/dashboard/Graphs.styles';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraphBars = () => {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState('todos');

  // Query para apoyos por mes
  const { data: apoyosPorMes = [], isLoading: loadingMes } = useQuery({
    queryKey: ['apoyosByMonth', currentYear],
    queryFn: () => getApoyosByMonth(currentYear),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Query para apoyos por tipo (con filtro de mes)
  const { data: apoyosPorTipo = [], isLoading: loadingTipo } = useQuery({
    queryKey: ['apoyosByType', currentYear, selectedMonth],
    queryFn: () => {
      const month = selectedMonth === 'todos' ? null : selectedMonth;
      return getApoyosByType(currentYear, month);
    },
    staleTime: 3 * 60 * 1000,
    retry: 2,
  });

  // Colores para las gráficas
  const coloresMeses = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6'
  ];

  const coloresTipos = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#f59e0b', '#22c55e', '#14b8a6'
  ];

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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Datos para la gráfica de apoyos por mes
  const chartDataMes = useMemo(() => ({
    labels: apoyosPorMes.map(item => item.mes),
    datasets: [
      {
        label: 'Cantidad de Apoyos',
        data: apoyosPorMes.map(item => item.cantidad),
        backgroundColor: coloresMeses.map(color => `${color}CC`),
        borderColor: coloresMeses,
        borderWidth: 2,
        borderRadius: 0,
        borderSkipped: false,
      },
    ],
  }), [apoyosPorMes]);

  // Opciones para la gráfica de apoyos por mes
  const optionsMes = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 400,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 13,
            weight: '600',
          },
          color: '#64748b',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: 'rgba(226, 232, 240, 0.8)',
        borderWidth: 1,
        padding: 16,
        cornerRadius: 12,
        boxPadding: 6,
        titleFont: {
          size: 14,
          weight: '700',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context) => `Cantidad: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
            weight: '500',
          },
          maxRotation: 45,
          minRotation: 45,
        },
        border: {
          color: '#cbd5e1',
        },
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '500',
          },
          padding: 8,
        },
        border: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  }), []);

  // Datos para la gráfica de apoyos por tipo (horizontal)
  const chartDataTipo = useMemo(() => ({
    labels: apoyosPorTipo.map(item => item.tipo),
    datasets: [
      {
        label: 'Cantidad',
        data: apoyosPorTipo.map(item => item.cantidad),
        backgroundColor: apoyosPorTipo.map((_, index) => `${coloresTipos[index % coloresTipos.length]}CC`),
        borderColor: apoyosPorTipo.map((_, index) => coloresTipos[index % coloresTipos.length]),
        borderWidth: 2,
        borderRadius: 0,
        borderSkipped: false,
      },
    ],
  }), [apoyosPorTipo]);

  // Opciones para la gráfica de apoyos por tipo (horizontal)
  const optionsTipo = useMemo(() => ({
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 400,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 13,
            weight: '600',
          },
          color: '#64748b',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: 'rgba(226, 232, 240, 0.8)',
        borderWidth: 1,
        padding: 16,
        cornerRadius: 12,
        boxPadding: 6,
        titleFont: {
          size: 14,
          weight: '700',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const item = apoyosPorTipo[dataIndex];
            return [
              `Cantidad: ${context.parsed.x}`,
              `Porcentaje: ${item?.porcentaje || 0}%`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '500',
          },
          padding: 8,
        },
        border: {
          display: false,
        },
        beginAtZero: true,
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#475569',
          font: {
            size: 12,
            weight: '600',
          },
          padding: 8,
        },
        border: {
          color: '#cbd5e1',
        },
      },
    },
  }), [apoyosPorTipo]);

  // Componente de loading
  const LoadingSpinner = () => (
    <LoadingSpinnerWrapper>
      <Spinner />
    </LoadingSpinnerWrapper>
  );

  // Componente de estado vacío
  const EmptyState = () => (
    <EmptyStateWrapper>
      <span className="empty-icon">📊</span>
      <p>No hay datos disponibles para el período seleccionado</p>
    </EmptyStateWrapper>
  );

  return (
    <ChartContainer>
      {/* Gráfica 1: Cantidad de Apoyos Entregados por Mes */}
      <ChartCard>
        <ChartHeader>
          <ChartIconWrapper $color="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)">
            <Calendar size={26} />
          </ChartIconWrapper>
          <ChartTitle>Apoyos Entregados por Mes ({currentYear})</ChartTitle>
        </ChartHeader>
        <ChartContent>
          {loadingMes ? (
            <LoadingSpinner />
          ) : (
            <div style={{ height: 400, width: '100%' }}>
              <Bar data={chartDataMes} options={optionsMes} />
            </div>
          )}
        </ChartContent>
      </ChartCard>

      {/* Gráfica 2: Distribución de Apoyos por Tipo */}
      <ChartCard>
        <ChartHeader>
          <ChartIconWrapper $color="linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)">
            <TrendingUp size={26} />
          </ChartIconWrapper>
          <ChartTitle>Distribución por Tipo de Apoyo ({currentYear})</ChartTitle>
        </ChartHeader>
        <FilterContainer>
          <Form.Select
            value={selectedMonth}
            onChange={handleMonthChange}
            aria-label="Filtrar por mes"
          >
            {meses.map((mes) => (
              <option key={mes.value} value={mes.value}>
                {mes.label}
              </option>
            ))}
          </Form.Select>
        </FilterContainer>
        <ChartContent>
          {loadingTipo ? (
            <LoadingSpinner />
          ) : apoyosPorTipo.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{ height: 400, width: '100%' }}>
              <Bar data={chartDataTipo} options={optionsTipo} />
            </div>
          )}
        </ChartContent>
      </ChartCard>
    </ChartContainer>
  );
};

export default GraphBars;
