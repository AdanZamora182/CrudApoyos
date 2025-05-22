import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  // Static mock data for the dashboard
  const mockData = {
    totalCabezas: 124,
    totalIntegrantes: 876,
    totalApoyos: 543,
    tiposApoyo: [
      { tipo: 'Tinaco', cantidad: 120 },
      { tipo: 'Despensa', cantidad: 200 },
      { tipo: 'Calentador Solar', cantidad: 30 },
      { tipo: 'Silla de ruedas', cantidad: 45 },
      { tipo: 'Otros', cantidad: 148 }
    ],
    apoyosPorMes: [
      { mes: 'Ene', cantidad: 45 },
      { mes: 'Feb', cantidad: 52 },
      { mes: 'Mar', cantidad: 49 },
      { mes: 'Abr', cantidad: 60 },
      { mes: 'May', cantidad: 45 },
      { mes: 'Jun', cantidad: 55 },
      { mes: 'Jul', cantidad: 70 },
      { mes: 'Ago', cantidad: 63 },
      { mes: 'Sep', cantidad: 42 },
      { mes: 'Oct', cantidad: 40 },
      { mes: 'Nov', cantidad: 22 },
      { mes: 'Dic', cantidad: 0 }
    ],
    topEstructuras: [
      { nombre: 'Zona Norte', cantidad: 156 },
      { nombre: 'Zona Sur', cantidad: 142 },
      { nombre: 'Zona Este', cantidad: 98 },
      { nombre: 'Zona Oeste', cantidad: 85 },
      { nombre: 'Zona Centro', cantidad: 62 }
    ],
    ultimosApoyos: [
      { id: 1, tipo: 'Despensa', beneficiario: 'María Rodríguez', fecha: '2023-11-05' },
      { id: 2, tipo: 'Tinaco', beneficiario: 'José García', fecha: '2023-11-05' },
      { id: 3, tipo: 'Silla de ruedas', beneficiario: 'Antonio López', fecha: '2023-11-04' },
      { id: 4, tipo: 'Calentador Solar', beneficiario: 'Laura Martínez', fecha: '2023-11-03' },
      { id: 5, tipo: 'Despensa', beneficiario: 'Carlos Fernández', fecha: '2023-11-03' }
    ]
  };

  // Helper function to create a simple bar chart
  const renderBarChart = (data, valueKey, labelKey) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]));
    
    return (
      <div className="dashboard-chart bar-chart">
        {data.map((item, index) => (
          <div className="bar-container" key={index}>
            <div className="bar-label">{item[labelKey]}</div>
            <div className="bar-outer">
              <div 
                className="bar-inner" 
                style={{ 
                  width: `${(item[valueKey] / maxValue) * 100}%`,
                  backgroundColor: `hsl(${210 + index * 30}, 70%, 60%)`
                }}
              ></div>
              <span className="bar-value">{item[valueKey]}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Revert to simpler pie chart visualization
  const renderPieChart = (data, valueKey, labelKey) => {
    const total = data.reduce((acc, item) => acc + item[valueKey], 0);
    
    return (
      <div className="dashboard-chart pie-chart">
        <div className="pie-legend">
          {data.map((item, index) => (
            <div className="legend-item" key={index}>
              <div 
                className="legend-color" 
                style={{ backgroundColor: `hsl(${210 + index * 30}, 70%, 60%)` }}
              ></div>
              <div className="legend-label">
                {item[labelKey]} ({Math.round((item[valueKey] / total) * 100)}%)
              </div>
              <div className="legend-value">{item[valueKey]}</div>
            </div>
          ))}
        </div>
        
        {/* Simple circle visualization instead of complex pie chart */}
        <div className="pie-visual-container">
          <div className="pie-circle">
            {data.map((item, index) => (
              <div 
                key={index}
                className="color-dot"
                style={{
                  backgroundColor: `hsl(${210 + index * 30}, 70%, 60%)`,
                  width: `${Math.max((item[valueKey] / total) * 120, 10)}px`, 
                  height: `${Math.max((item[valueKey] / total) * 120, 10)}px`,
                }}
                title={`${item[labelKey]}: ${item[valueKey]} (${Math.round((item[valueKey] / total) * 100)}%)`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render the dashboard
  return (
    <div className="dashboard-container">
      {/* Removed the h1 element with "Panel de Control" text */}
      
      {/* Summary cards */}
      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <div className="card-title">Cabezas de Círculo</div>
            <div className="card-value">{mockData.totalCabezas}</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">👪</div>
          <div className="card-content">
            <div className="card-title">Integrantes</div>
            <div className="card-value">{mockData.totalIntegrantes}</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">🎁</div>
          <div className="card-content">
            <div className="card-title">Apoyos Entregados</div>
            <div className="card-value">{mockData.totalApoyos}</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <div className="card-title">Promedio Mensual</div>
            <div className="card-value">
              {Math.round(mockData.apoyosPorMes.reduce((acc, month) => acc + month.cantidad, 0) / 12)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts section */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <h2 className="chart-title">Apoyos por Tipo</h2>
          {renderPieChart(mockData.tiposApoyo, 'cantidad', 'tipo')}
        </div>
        
        <div className="chart-container">
          <h2 className="chart-title">Apoyos por Mes</h2>
          <div className="month-chart-container">
            {renderBarChart(mockData.apoyosPorMes, 'cantidad', 'mes')}
          </div>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-container">
          <h2 className="chart-title">Apoyos por Estructura Territorial</h2>
          {renderBarChart(mockData.topEstructuras, 'cantidad', 'nombre')}
        </div>
        
        <div className="chart-container">
          <h2 className="chart-title">Últimos Apoyos Entregados</h2>
          <div className="recent-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Beneficiario</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {mockData.ultimosApoyos.map(apoyo => (
                  <tr key={apoyo.id}>
                    <td>{apoyo.id}</td>
                    <td>{apoyo.tipo}</td>
                    <td>{apoyo.beneficiario}</td>
                    <td>{apoyo.fecha}</td>
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
