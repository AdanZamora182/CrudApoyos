import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import './Menu.css';
import logoApoyos from '../../assets/logoApoyos.png';

function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("Inicio"); // Changed from "Panel de Control"
  const [currentComponent, setCurrentComponent] = useState(null);
  
  // Obtener información del usuario de localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // Si no hay usuario en localStorage, redirigir al login
  if (!user) {
    navigate('/login');
    return null;
  }

  // Set the title based on the current route
  useEffect(() => {
    switch(location.pathname) {
      case '/menu':
        setTitle("Inicio"); // Changed from "Panel de Control"
        break;
      case '/cabezas-circulo':
        setTitle("Gestión de Cabezas de Círculo");
        break;
      case '/integrantes-circulo':
        setTitle("Gestión de Integrantes de Círculo");
        break;
      case '/apoyos':
        setTitle("Gestión de Apoyos");
        break;
      case '/dashboard':
        setTitle("Dashboard");
        break;
      default:
        setTitle("Inicio");
    }
  }, [location.pathname]);

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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="layout">
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <img 
            src={logoApoyos} 
            alt="Logo Apoyos" 
            className="sidebar-logo" 
            onClick={toggleSidebar} 
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
          />
          {!collapsed && <h2 className="system-title">Sistema de Gestión</h2>}
        </div>
        
        <div className="sidebar-menu">
          <div 
            className={`menu-item ${location.pathname === '/menu' ? 'active' : ''}`}
            onClick={() => navigateToPage('/menu')}
          >
            <span className="menu-icon">🏠</span>
            {!collapsed && <span className="menu-text">Inicio</span>}
          </div>
          
          <div 
            className={`menu-item ${location.pathname === '/cabezas-circulo' ? 'active' : ''}`}
            onClick={() => navigateToPage('/cabezas-circulo')}
          >
            <span className="menu-icon">👥</span>
            {!collapsed && <span className="menu-text">Cabezas de Círculo</span>}
          </div>
          
          <div 
            className={`menu-item ${location.pathname === '/integrantes-circulo' ? 'active' : ''}`}
            onClick={() => navigateToPage('/integrantes-circulo')}
          >
            <span className="menu-icon">👪</span>
            {!collapsed && <span className="menu-text">Integrantes de Círculo</span>}
          </div>
          
          <div 
            className={`menu-item ${location.pathname === '/apoyos' ? 'active' : ''}`}
            onClick={() => navigateToPage('/apoyos')}
          >
            <span className="menu-icon">🎁</span>
            {!collapsed && <span className="menu-text">Apoyos</span>}
          </div>
          
          <div 
            className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => navigateToPage('/dashboard')}
          >
            <span className="menu-icon">📊</span>
            {!collapsed && <span className="menu-text">Dashboard</span>}
          </div>
        </div>
        
        {/* Footer with user info and logout */}
        <div className="sidebar-footer">
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">{user.nombre}</span>
              <span className="user-role">Administrador</span>
            </div>
          )}
          
          <div 
            className="menu-item logout"
            onClick={handleLogout}
          >
            <span className="menu-icon">🚪</span>
            {!collapsed && <span className="menu-text">Cerrar Sesión</span>}
          </div>
        </div>
      </div>
      
      <div className={`main-content ${collapsed ? 'expanded' : ''}`}>
        <div className="content-header">
          <h1>{title}</h1>
          <div className="user-welcome">
            Bienvenido, {user.nombre}
          </div>
        </div>
        
        <div className="content-body">
          {location.pathname === '/menu' ? (
            <div className="home-section"> {/* Changed from dashboard to home-section */}
              <div className="welcome-banner"> {/* Changed from dashboard-welcome to welcome-banner */}
                <h2>Bienvenido al Sistema de Gestión de Apoyos</h2>
                <p>Seleccione una opción del menú lateral para comenzar a trabajar.</p>
              </div>
              
              <div className="quick-access-cards"> {/* Changed from dashboard-cards to quick-access-cards */}
                <div className="access-card" onClick={() => navigateToPage('/cabezas-circulo')}>
                  <div className="card-icon">👥</div>
                  <h3>Cabezas de Círculo</h3>
                  <p>Gestiona los representantes de los beneficiarios</p>
                </div>
                
                <div className="access-card" onClick={() => navigateToPage('/integrantes-circulo')}>
                  <div className="card-icon">👪</div>
                  <h3>Integrantes de Círculo</h3>
                  <p>Gestiona los beneficiarios de los apoyos</p>
                </div>
                
                <div className="access-card" onClick={() => navigateToPage('/apoyos')}>
                  <div className="card-icon">🎁</div>
                  <h3>Apoyos</h3>
                  <p>Gestiona los apoyos entregados a beneficiarios</p>
                </div>
                
                <div className="access-card" onClick={() => navigateToPage('/dashboard')}>
                  <div className="card-icon">📊</div>
                  <h3>Dashboard</h3>
                  <p>Visualiza estadísticas y métricas del sistema</p>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

export default Menu;