import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Box, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
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
} from '../../components/dashboard/Graphs.styles';

const GraphBars = () => {
  const currentYear = new Date().getFullYear();
  const [apoyosPorMes, setApoyosPorMes] = useState([]);
  const [apoyosPorTipo, setApoyosPorTipo] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('todos');
  const [loading, setLoading] = useState(true);

  // Gradientes modernos para las gráficas
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

  useEffect(() => {
    fetchApoyosPorMes();
  }, []);

  useEffect(() => {
    fetchApoyosPorTipo();
  }, [selectedMonth]);

  const fetchApoyosPorMes = async () => {
    try {
      const data = await getApoyosByMonth(currentYear);
      setApoyosPorMes(data);
    } catch (error) {
      console.error('Error al cargar apoyos por mes:', error);
    }
  };

  const fetchApoyosPorTipo = async () => {
    try {
      setLoading(true);
      const month = selectedMonth === 'todos' ? null : selectedMonth;
      const data = await getApoyosByType(currentYear, month);
      setApoyosPorTipo(data);
    } catch (error) {
      console.error('Error al cargar apoyos por tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Tooltip moderno con gradientes
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
            padding: '16px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '14px', marginBottom: '6px' }}>
            {label}
          </p>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: payload[0].fill || '#3b82f6',
                boxShadow: `0 0 8px ${payload[0].fill || '#3b82f6'}`,
              }}
            />
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
              Cantidad: <span style={{ fontWeight: 700, color: '#3b82f6', fontSize: '15px' }}>{payload[0].value}</span>
            </p>
          </Box>
        </Box>
      );
    }
    return null;
  };

  // Tooltip para gráfica de tipos con porcentaje y diseño mejorado
  const CustomTooltipWithPercentage = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
            padding: '16px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            minWidth: '180px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '14px', marginBottom: '8px' }}>
            {label}
          </p>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: payload[0].fill || '#3b82f6',
                  boxShadow: `0 0 8px ${payload[0].fill || '#3b82f6'}`,
                }}
              />
              <span style={{ color: '#64748b', fontSize: '13px' }}>
                Cantidad: <span style={{ fontWeight: 700, color: '#3b82f6', fontSize: '14px' }}>{data.cantidad}</span>
              </span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '18px' }}>
              <Chip
                label={`${data.porcentaje}%`}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '12px',
                  height: '22px',
                }}
              />
            </Box>
          </Box>
        </Box>
      );
    }
    return null;
  };

  // Etiquetas personalizadas para las barras
  const renderCustomLabel = (props) => {
    const { x, y, width, height, value } = props;
    if (value === 0) return null;
    
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill="#64748b"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
      >
        {value}
      </text>
    );
  };

  return (
    <ChartContainer>
      {/* Gráfica 1: Cantidad de Apoyos Entregados por Mes */}
      <ChartCard>
        <ChartHeader>
          <ChartIconWrapper color="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)">
            <Calendar size={26} />
          </ChartIconWrapper>
          <ChartTitle>Apoyos Entregados por Mes ({currentYear})</ChartTitle>
        </ChartHeader>
        <ChartContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={apoyosPorMes}
              margin={{ top: 30, right: 30, left: 20, bottom: 70 }}
            >
              <defs>
                {coloresMeses.map((color, index) => (
                  <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis
                dataKey="mes"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
              <Legend
                wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 600 }}
                iconType="circle"
              />
              <Bar
                dataKey="cantidad"
                name="Cantidad de Apoyos"
                radius={[0, 0, 0, 0]}
                maxBarSize={60}
              >
                <LabelList dataKey="cantidad" content={renderCustomLabel} />
                {apoyosPorMes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gradient${index % coloresMeses.length})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContent>
      </ChartCard>

      {/* Gráfica 2: Distribución de Apoyos por Tipo */}
      <ChartCard>
        <ChartHeader>
          <ChartIconWrapper color="linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)">
            <TrendingUp size={26} />
          </ChartIconWrapper>
          <ChartTitle>Distribución por Tipo de Apoyo ({currentYear})</ChartTitle>
        </ChartHeader>
        <FilterContainer>
          <FormControl fullWidth size="small">
            <InputLabel id="month-select-label">Filtrar por mes</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              label="Filtrar por mes"
              onChange={handleMonthChange}
            >
              {meses.map((mes) => (
                <MenuItem key={mes.value} value={mes.value}>
                  {mes.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FilterContainer>
        <ChartContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  border: '4px solid #e2e8f0',
                  borderTop: '4px solid #6366f1',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </Box>
          ) : apoyosPorTipo.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: 400,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  fontSize: 48,
                  opacity: 0.3,
                }}
              >
                📊
              </Box>
              <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 500 }}>
                No hay datos disponibles para el período seleccionado
              </p>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={apoyosPorTipo}
                layout="vertical"
                margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
              >
                <defs>
                  {coloresTipos.map((color, index) => (
                    <linearGradient key={index} id={`gradientTipo${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.95} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis
                  type="number"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  dataKey="tipo"
                  type="category"
                  width={140}
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip content={<CustomTooltipWithPercentage />} cursor={{ fill: 'rgba(236, 72, 153, 0.08)' }} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '14px', fontWeight: 600 }}
                  iconType="circle"
                />
                <Bar
                  dataKey="cantidad"
                  name="Cantidad"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={50}
                >
                  <LabelList
                    dataKey="cantidad"
                    position="right"
                    fill="#64748b"
                    fontSize={12}
                    fontWeight={600}
                  />
                  {apoyosPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradientTipo${index % coloresTipos.length})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContent>
      </ChartCard>
    </ChartContainer>
  );
};

export default GraphBars;
