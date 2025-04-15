import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';
import logoApoyos from '../../assets/logoApoyos.png';

function Menu() {
  const navigate = useNavigate();
  
  // Obtener información del usuario de localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // Si no hay usuario en localStorage, redirigir al login
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Función segura para navegar verificando la sesión
  const navigateToPage = (path) => {
    // Verificar que la sesión sigue activa antes de navegar
    if (localStorage.getItem('user')) {
      navigate(path);
    } else {
      // Si no hay sesión, redirigir al login
      navigate('/login');
    }
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <div className="logo-container">
          <img src={logoApoyos} alt="Logo Apoyos" className="menu-logo" />
          <h1>Sistema de Gestión de Apoyos</h1>
        </div>
        <div className="user-info">
          <span>Bienvenido, {user.nombre}</span>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
      </div>

      <div className="menu-content">
        <div className="menu-welcome">
          <h2>Panel de Control</h2>
          <p>Selecciona una opción para comenzar:</p>
        </div>

        <div className="menu-cards">
          {/* Cabezas de Círculo */}
          <div 
            className="menu-card"
            onClick={(e) => {
              e.preventDefault();
              navigateToPage('/cabezas-circulo');
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-icon">👥</div>
            <h3>Cabezas de Círculo</h3>
            <p>Gestiona los representantes de los beneficiarios</p>
          </div>

          {/* Integrantes de Círculo */}
          <div 
            className="menu-card"
            onClick={() => navigateToPage('/integrantes-circulo')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-icon">👪</div>
            <h3>Integrantes de Círculo</h3>
            <p>Gestiona los beneficiarios de los apoyos</p>
          </div>

          {/* Apoyos */}
          <div 
            className="menu-card"
            onClick={() => navigateToPage('/apoyos')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-icon">🎁</div>
            <h3>Apoyos</h3>
            <p>Gestiona los apoyos entregados a beneficiarios</p>
          </div>

          {/* Reportes */}
          <div 
            className="menu-card reports"
            onClick={() => navigateToPage('/reportes')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-icon">📊</div>
            <h3>Reportes</h3>
            <p>Genera informes y estadísticas</p>
          </div>
        </div>
      </div>

      <footer className="menu-footer">
        <p>&copy; 2025 Sistema de Gestión de Apoyos | Uso exclusivo para el personal de MARHK</p>
      </footer>
    </div>
  );
}

export default Menu;