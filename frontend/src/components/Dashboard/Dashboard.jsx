import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  // Mock data - replace with real API calls later
  const [dashboardData, setDashboardData] = useState({
    totalCabezasCirculo: 0,
    totalIntegrantesCirculo: 0,
    totalApoyosEntregados: 0,
    promedioApoyosPorMes: 0,
    apoyosPorTipo: [],
    apoyosPorMes: [],
    coloniasConMasApoyos: [],
    coloniasConMenosApoyos: [],
    apoyosPorTipoPorMes: {}, // New data structure for monthly breakdown
    coloniasPorMes: {} // New data structure for monthly colony breakdown
  });

  // Add state for month filters
  const [selectedMonth, setSelectedMonth] = useState('todos');
  const [selectedMonthMasApoyos, setSelectedMonthMasApoyos] = useState('todos');
  const [selectedMonthMenosApoyos, setSelectedMonthMenosApoyos] = useState('todos');

  // Generate mock data
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      const mockData = {
        totalCabezasCirculo: 156,
        totalIntegrantesCirculo: 892,
        totalApoyosEntregados: 2345,
        promedioApoyosPorMes: 195,
        apoyosPorTipo: [
          { tipo: 'Despensa', cantidad: 567, porcentaje: 24.2 },
          { tipo: 'Tinaco', cantidad: 234, porcentaje: 10.0 },
          { tipo: 'Silla de ruedas', cantidad: 189, porcentaje: 8.1 },
          { tipo: 'Calentador Solar', cantidad: 156, porcentaje: 6.7 },
          { tipo: 'Muletas', cantidad: 145, porcentaje: 6.2 },
          { tipo: 'Jitomate', cantidad: 134, porcentaje: 5.7 },
          { tipo: 'Pepino', cantidad: 123, porcentaje: 5.2 },
          { tipo: 'Juguete', cantidad: 112, porcentaje: 4.8 },
          { tipo: 'Oxímetro', cantidad: 98, porcentaje: 4.2 },
          { tipo: 'Frijol', cantidad: 87, porcentaje: 3.7 },
          { tipo: 'Ropa', cantidad: 76, porcentaje: 3.2 },
          { tipo: 'Calzado', cantidad: 65, porcentaje: 2.8 },
          { tipo: 'Bastón', cantidad: 54, porcentaje: 2.3 },
          { tipo: 'Baumanómetro', cantidad: 43, porcentaje: 1.8 },
          { tipo: 'Otros', cantidad: 462, porcentaje: 19.7 }
        ],
        apoyosPorMes: [
          { mes: 'Enero', cantidad: 198 },
          { mes: 'Febrero', cantidad: 176 },
          { mes: 'Marzo', cantidad: 234 },
          { mes: 'Abril', cantidad: 189 },
          { mes: 'Mayo', cantidad: 267 },
          { mes: 'Junio', cantidad: 223 },
          { mes: 'Julio', cantidad: 245 },
          { mes: 'Agosto', cantidad: 198 },
          { mes: 'Septiembre', cantidad: 156 },
          { mes: 'Octubre', cantidad: 201 },
          { mes: 'Noviembre', cantidad: 134 },
          { mes: 'Diciembre', cantidad: 124 }
        ],
        coloniasConMasApoyos: [
          { colonia: 'Centro', apoyos: 289 },
          { colonia: 'Las Flores', apoyos: 245 },
          { colonia: 'Villa Hermosa', apoyos: 198 },
          { colonia: 'San José', apoyos: 167 },
          { colonia: 'El Progreso', apoyos: 134 },
          { colonia: 'Lomas Altas', apoyos: 123 },
          { colonia: 'Jardines', apoyos: 98 }
        ],
        coloniasConMenosApoyos: [
          { colonia: 'La Esperanza', apoyos: 12 },
          { colonia: 'Nuevo Amanecer', apoyos: 15 },
          { colonia: 'Vista Bella', apoyos: 18 },
          { colonia: 'San Antonio', apoyos: 21 },
          { colonia: 'El Mirador', apoyos: 24 },
          { colonia: 'Las Palmas', apoyos: 27 },
          { colonia: 'Buen Pastor', apoyos: 30 }
        ],
        // Mock data for monthly breakdown by type
        apoyosPorTipoPorMes: {
          'Enero': [
            { tipo: 'Despensa', cantidad: 48, porcentaje: 24.2 },
            { tipo: 'Tinaco', cantidad: 20, porcentaje: 10.1 },
            { tipo: 'Silla de ruedas', cantidad: 16, porcentaje: 8.1 },
            { tipo: 'Calentador Solar', cantidad: 13, porcentaje: 6.6 },
            { tipo: 'Muletas', cantidad: 12, porcentaje: 6.1 },
            { tipo: 'Jitomate', cantidad: 11, porcentaje: 5.6 },
            { tipo: 'Pepino', cantidad: 10, porcentaje: 5.1 },
            { tipo: 'Juguete', cantidad: 9, porcentaje: 4.5 },
            { tipo: 'Oxímetro', cantidad: 8, porcentaje: 4.0 },
            { tipo: 'Frijol', cantidad: 7, porcentaje: 3.5 },
            { tipo: 'Ropa', cantidad: 6, porcentaje: 3.0 },
            { tipo: 'Calzado', cantidad: 5, porcentaje: 2.5 },
            { tipo: 'Bastón', cantidad: 4, porcentaje: 2.0 },
            { tipo: 'Baumanómetro', cantidad: 4, porcentaje: 2.0 },
            { tipo: 'Otros', cantidad: 41, porcentaje: 20.7 }
          ],
          'Febrero': [
            { tipo: 'Despensa', cantidad: 42, porcentaje: 23.9 },
            { tipo: 'Tinaco', cantidad: 18, porcentaje: 10.2 },
            { tipo: 'Silla de ruedas', cantidad: 14, porcentaje: 8.0 },
            { tipo: 'Calentador Solar', cantidad: 12, porcentaje: 6.8 },
            { tipo: 'Muletas', cantidad: 11, porcentaje: 6.3 },
            { tipo: 'Jitomate', cantidad: 10, porcentaje: 5.7 },
            { tipo: 'Pepino', cantidad: 9, porcentaje: 5.1 },
            { tipo: 'Juguete', cantidad: 8, porcentaje: 4.5 },
            { tipo: 'Oxímetro', cantidad: 7, porcentaje: 4.0 },
            { tipo: 'Frijol', cantidad: 6, porcentaje: 3.4 },
            { tipo: 'Ropa', cantidad: 6, porcentaje: 3.4 },
            { tipo: 'Calzado', cantidad: 5, porcentaje: 2.8 },
            { tipo: 'Bastón', cantidad: 4, porcentaje: 2.3 },
            { tipo: 'Baumanómetro', cantidad: 3, porcentaje: 1.7 },
            { tipo: 'Otros', cantidad: 34, porcentaje: 19.3 }
          ],
          // Add more months as needed - this is just sample data
        },
        coloniasPorMes: {
          'todos': {
            masApoyos: [
              { colonia: 'Centro', apoyos: 289 },
              { colonia: 'Las Flores', apoyos: 245 },
              { colonia: 'Villa Hermosa', apoyos: 198 },
              { colonia: 'San José', apoyos: 167 },
              { colonia: 'El Progreso', apoyos: 134 },
              { colonia: 'Lomas Altas', apoyos: 123 },
              { colonia: 'Jardines', apoyos: 98 }
            ],
            menosApoyos: [
              { colonia: 'La Esperanza', apoyos: 12 },
              { colonia: 'Nuevo Amanecer', apoyos: 15 },
              { colonia: 'Vista Bella', apoyos: 18 },
              { colonia: 'San Antonio', apoyos: 21 },
              { colonia: 'El Mirador', apoyos: 24 },
              { colonia: 'Las Palmas', apoyos: 27 },
              { colonia: 'Buen Pastor', apoyos: 30 }
            ]
          },
          'Enero': {
            masApoyos: [
              { colonia: 'Centro', apoyos: 24 },
              { colonia: 'Las Flores', apoyos: 20 },
              { colonia: 'Villa Hermosa', apoyos: 16 },
              { colonia: 'San José', apoyos: 14 },
              { colonia: 'El Progreso', apoyos: 11 },
              { colonia: 'Lomas Altas', apoyos: 10 },
              { colonia: 'Jardines', apoyos: 8 }
            ],
            menosApoyos: [
              { colonia: 'La Esperanza', apoyos: 1 },
              { colonia: 'Nuevo Amanecer', apoyos: 1 },
              { colonia: 'Vista Bella', apoyos: 2 },
              { colonia: 'San Antonio', apoyos: 2 },
              { colonia: 'El Mirador', apoyos: 2 },
              { colonia: 'Las Palmas', apoyos: 2 },
              { colonia: 'Buen Pastor', apoyos: 3 }
            ]
          },
          'Febrero': {
            masApoyos: [
              { colonia: 'Centro', apoyos: 22 },
              { colonia: 'Las Flores', apoyos: 18 },
              { colonia: 'Villa Hermosa', apoyos: 15 },
              { colonia: 'San José', apoyos: 13 },
              { colonia: 'El Progreso', apoyos: 10 },
              { colonia: 'Lomas Altas', apoyos: 9 },
              { colonia: 'Jardines', apoyos: 7 }
            ],
            menosApoyos: [
              { colonia: 'La Esperanza', apoyos: 1 },
              { colonia: 'Nuevo Amanecer', apoyos: 1 },
              { colonia: 'Vista Bella', apoyos: 1 },
              { colonia: 'San Antonio', apoyos: 2 },
              { colonia: 'El Mirador', apoyos: 2 },
              { colonia: 'Las Palmas', apoyos: 2 },
              { colonia: 'Buen Pastor', apoyos: 2 }
            ]
          }
          // Add more months as needed - this is just sample data
        }
      };
      setDashboardData(mockData);
    }, 500);
  }, []);

  // Color palette for charts
  const chartColors = [
    '#5c6bc0', '#26c6da', '#66bb6a', '#ff7043', '#ab47bc',
    '#29b6f6', '#ffa726', '#ef5350', '#42a5f5', '#9ccc65',
    '#8d6e63', '#bdbdbd', '#78909c', '#ffb74d', '#f06292'
  ];

  // Calculate max value for bar charts
  const maxApoyosPorMes = Math.max(...dashboardData.apoyosPorMes.map(item => item.cantidad));

  // Get filtered data for pie chart based on selected month
  const getFilteredApoyosPorTipo = () => {
    if (selectedMonth === 'todos') {
      return dashboardData.apoyosPorTipo;
    }
    return dashboardData.apoyosPorTipoPorMes[selectedMonth] || [];
  };

  // Get filtered data for colony tables based on selected months
  const getFilteredColoniasMasApoyos = () => {
    const data = dashboardData.coloniasPorMes[selectedMonthMasApoyos];
    return data ? data.masApoyos : dashboardData.coloniasConMasApoyos;
  };

  const getFilteredColoniasMenosApoyos = () => {
    const data = dashboardData.coloniasPorMes[selectedMonthMenosApoyos];
    return data ? data.menosApoyos : dashboardData.coloniasConMenosApoyos;
  };

  // Available months for filter
  const monthsOptions = [
    { value: 'todos', label: 'Todos los meses (2025)' },
    { value: 'Enero', label: 'Enero 2025' },
    { value: 'Febrero', label: 'Febrero 2025' },
    { value: 'Marzo', label: 'Marzo 2025' },
    { value: 'Abril', label: 'Abril 2025' },
    { value: 'Mayo', label: 'Mayo 2025' },
    { value: 'Junio', label: 'Junio 2025' },
    { value: 'Julio', label: 'Julio 2025' },
    { value: 'Agosto', label: 'Agosto 2025' },
    { value: 'Septiembre', label: 'Septiembre 2025' },
    { value: 'Octubre', label: 'Octubre 2025' },
    { value: 'Noviembre', label: 'Noviembre 2025' },
    { value: 'Diciembre', label: 'Diciembre 2025' }
  ];

  const filteredApoyosPorTipo = getFilteredApoyosPorTipo();
  const filteredColoniasMasApoyos = getFilteredColoniasMasApoyos();
  const filteredColoniasMenosApoyos = getFilteredColoniasMenosApoyos();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard - Resumen General</h1>
      
      {/* Summary Cards */}
      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="card-icon" style={{color: '#5c6bc0'}}>
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="card-content">
            <div className="card-title">Total Cabezas de Círculo</div>
            <div className="card-value">{dashboardData.totalCabezasCirculo.toLocaleString()}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{color: '#26c6da'}}>
            <i className="bi bi-person-circle"></i>
          </div>
          <div className="card-content">
            <div className="card-title">Total Integrantes de Círculo</div>
            <div className="card-value">{dashboardData.totalIntegrantesCirculo.toLocaleString()}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{color: '#66bb6a'}}>
            <i className="bi bi-gift-fill"></i>
          </div>
          <div className="card-content">
            <div className="card-title">Total Apoyos Entregados</div>
            <div className="card-value">{dashboardData.totalApoyosEntregados.toLocaleString()}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{color: '#ff7043'}}>
            <i className="bi bi-calendar3"></i>
          </div>
          <div className="card-content">
            <div className="card-title">Promedio Apoyos/Mes</div>
            <div className="card-value">{dashboardData.promedioApoyosPorMes}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts">
        {/* Apoyos por Mes Chart */}
        <div className="chart-container chart-container-mes">
          <h3 className="chart-title">Apoyos Entregados por Mes (2025)</h3>
          <div className="month-chart-container mes-chart-adjust">
            <div className="bar-chart mes-bar-chart">
              {dashboardData.apoyosPorMes.map((item, index) => (
                <div key={index} className="bar-container">
                  <div className="bar-label">{item.mes}</div>
                  <div className="bar-outer">
                    <div 
                      className="bar-inner" 
                      style={{
                        width: `${(item.cantidad / maxApoyosPorMes) * 100}%`,
                        backgroundColor: chartColors[index % chartColors.length]
                      }}
                    ></div>
                    <div className="bar-value">{item.cantidad}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Apoyos por Tipo (Bar Chart) with Month Filter */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Distribución de Apoyos por Tipo</h3>
            <div className="chart-filter">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="month-filter-select"
              >
                {monthsOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="tipo-apoyos-chart-container" style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
            minHeight: '280px',
            maxHeight: 'none',
            overflow: 'visible'
          }}>
            <div className="tipo-apoyos-bar-chart" style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              height: 'auto',
              gap: `${Math.max(2, Math.floor(250 / filteredApoyosPorTipo.length))}px`
            }}>
              {filteredApoyosPorTipo.map((item, index) => (
                <div key={index} className="tipo-apoyo-bar-container" style={{
                  height: `${Math.max(10, Math.floor(240 / filteredApoyosPorTipo.length))}px`,
                  marginBottom: '1px'
                }}>
                  <div className="tipo-apoyo-bar-label">{item.tipo}</div>
                  <div className="tipo-apoyo-bar-outer">
                    <div 
                      className="tipo-apoyo-bar-inner" 
                      style={{
                        width: `${item.porcentaje}%`,
                        backgroundColor: chartColors[index % chartColors.length]
                      }}
                    ></div>
                    <div className="tipo-apoyo-bar-value">{item.porcentaje}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="dashboard-charts">
        {/* Colonias con Más Apoyos */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Top 7 Colonias con Más Apoyos</h3>
            <div className="chart-filter">
              <select 
                value={selectedMonthMasApoyos} 
                onChange={(e) => setSelectedMonthMasApoyos(e.target.value)}
                className="month-filter-select"
              >
                {monthsOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="recent-table">
            <table>
              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Colonia</th>
                  <th>Total Apoyos</th>
                </tr>
              </thead>
              <tbody>
                {filteredColoniasMasApoyos.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.colonia}</td>
                    <td>{item.apoyos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Colonias con Menos Apoyos */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Top 7 Colonias con Menos Apoyos</h3>
            <div className="chart-filter">
              <select 
                value={selectedMonthMenosApoyos} 
                onChange={(e) => setSelectedMonthMenosApoyos(e.target.value)}
                className="month-filter-select"
              >
                {monthsOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="recent-table">
            <table>
              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Colonia</th>
                  <th>Total Apoyos</th>
                </tr>
              </thead>
              <tbody>
                {filteredColoniasMenosApoyos.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.colonia}</td>
                    <td>{item.apoyos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
