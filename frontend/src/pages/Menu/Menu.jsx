import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import './Menu.css';
import logoApoyos from '../../assets/logoApoyos.png';

function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para controlar si la barra lateral está colapsada o expandida
  // Se carga desde localStorage o usa el valor por defecto (false)
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  
  // Estado para el título de la página actual
  const [title, setTitle] = useState("Inicio");
  const [currentComponent, setCurrentComponent] = useState(null);
  
  // Obtener información del usuario autenticado desde localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // Verificación de seguridad: redirigir al login si no hay usuario autenticado
  if (!user) {
    navigate('/login');
    return null;
  }

  // Efecto para actualizar el título según la ruta actual
  useEffect(() => {
    switch(location.pathname) {
      case '/menu':
        setTitle("Inicio");
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

  // Función para cerrar sesión y limpiar datos del usuario
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Función de navegación segura que verifica la sesión antes de navegar
  const navigateToPage = (path) => {
    // Verificar que la sesión sigue activa antes de navegar
    if (localStorage.getItem('user')) {
      navigate(path);
    } else {
      // Si no hay sesión, redirigir al login
      navigate('/login');
    }
  };

  // Función para alternar entre menú colapsado y expandido
  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    // Guardar el estado en localStorage para persistencia
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  // Estructura principal del componente con layout responsivo
  return (
    <div className="layout responsive-layout">
      {/* Barra lateral de navegación */}
      <div className={`sidebar responsive-sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Cabecera de la barra lateral con logo y título */}
        <div className="sidebar-header responsive-sidebar-header">
          <img 
            src={logoApoyos} 
            alt="Logo Apoyos" 
            className="sidebar-logo responsive-sidebar-logo" 
            onClick={toggleSidebar} 
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
          />
          {!collapsed && <h2 className="system-title responsive-system-title">Sistema de Gestión</h2>}
        </div>
        
        {/* Menú de navegación principal */}
        <div className="sidebar-menu">
          {/* Opción de menú: Inicio */}
          <div 
            className={`menu-item ${location.pathname === '/menu' ? 'active' : ''}`}
            onClick={() => navigateToPage('/menu')}
          >
            <span className="menu-icon">🏠</span>
            {!collapsed && <span className="menu-text">Inicio</span>}
          </div>
          
          {/* Opción de menú: Cabezas de Círculo */}
          <div 
            className={`menu-item ${location.pathname === '/cabezas-circulo' ? 'active' : ''}`}
            onClick={() => navigateToPage('/cabezas-circulo')}
          >
            <span className="menu-icon">👥</span>
            {!collapsed && <span className="menu-text">Cabezas de Círculo</span>}
          </div>
          
          {/* Opción de menú: Integrantes de Círculo */}
          <div 
            className={`menu-item ${location.pathname === '/integrantes-circulo' ? 'active' : ''}`}
            onClick={() => navigateToPage('/integrantes-circulo')}
          >
            <span className="menu-icon">👪</span>
            {!collapsed && <span className="menu-text">Integrantes de Círculo</span>}
          </div>
          
          {/* Opción de menú: Apoyos */}
          <div 
            className={`menu-item ${location.pathname === '/apoyos' ? 'active' : ''}`}
            onClick={() => navigateToPage('/apoyos')}
          >
            <span className="menu-icon">🎁</span>
            {!collapsed && <span className="menu-text">Apoyos</span>}
          </div>
          
          {/* Opción de menú: Dashboard */}
          <div 
            className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => navigateToPage('/dashboard')}
          >
            <span className="menu-icon">📊</span>
            {!collapsed && <span className="menu-text">Dashboard</span>}
          </div>
        </div>
        
        {/* Pie de la barra lateral con información del usuario y opción de cerrar sesión */}
        <div className="sidebar-footer responsive-sidebar-footer">
          {/* Información del usuario autenticado */}
          {!collapsed && (
            <div className="user-info responsive-user-info">
              <span className="user-name responsive-user-name">{user.nombre}</span>
              <span className="user-role responsive-user-role">Administrador</span>
            </div>
          )}
          
          {/* Botón para cerrar sesión */}
          <div 
            className="menu-item logout responsive-logout"
            onClick={handleLogout}
          >
            <span className="menu-icon responsive-menu-icon">
              <i className="bi bi-box-arrow-right"></i>
            </span>
            {!collapsed && <span className="menu-text responsive-menu-text">Cerrar Sesión</span>}
          </div>
        </div>
      </div>
      
      {/* Área de contenido principal */}
      <div className={`main-content responsive-main-content ${collapsed ? 'expanded' : ''}`}>
        {/* Cabecera del contenido con título y saludo de bienvenida */}
        <div className="content-header responsive-content-header">
          <h1 className="responsive-title">{title}</h1>
          <div className="user-welcome responsive-user-welcome">
            Bienvenid@, {user.nombre}
          </div>
        </div>
        
        {/* Cuerpo del contenido */}
        <div className="content-body responsive-content-body">
          {/* Contenido específico para la página de inicio */}
          {location.pathname === '/menu' ? (
            <div className="home-section responsive-home-section">
              {/* Banner de bienvenida */}
              <div className="welcome-banner responsive-welcome-banner">
                <h2>Bienvenido al Sistema de Gestión de Apoyos</h2>
                <p>Seleccione una opción del menú lateral para comenzar a trabajar.</p>
              </div>
              
              {/* Tarjetas de acceso rápido a las diferentes secciones */}
              <div className="quick-access-cards responsive-quick-access-cards">
                {/* Tarjeta: Cabezas de Círculo */}
                <div className="access-card responsive-access-card" onClick={() => navigateToPage('/cabezas-circulo')}>
                  <div className="card-icon responsive-card-icon">👥</div>
                  <h3>Cabezas de Círculo</h3>
                  <p>Gestiona los representantes de los beneficiarios</p>
                </div>
                
                {/* Tarjeta: Integrantes de Círculo */}
                <div className="access-card responsive-access-card" onClick={() => navigateToPage('/integrantes-circulo')}>
                  <div className="card-icon responsive-card-icon">👪</div>
                  <h3>Integrantes de Círculo</h3>
                  <p>Gestiona los beneficiarios de los apoyos</p>
                </div>
                
                {/* Tarjeta: Apoyos */}
                <div className="access-card responsive-access-card" onClick={() => navigateToPage('/apoyos')}>
                  <div className="card-icon responsive-card-icon">🎁</div>
                  <h3>Apoyos</h3>
                  <p>Gestiona los apoyos entregados a beneficiarios</p>
                </div>
                
                {/* Tarjeta: Dashboard */}
                <div className="access-card responsive-access-card" onClick={() => navigateToPage('/dashboard')}>
                  <div className="card-icon responsive-card-icon">📊</div>
                  <h3>Dashboard</h3>
                  <p>Visualiza estadísticas y métricas del sistema</p>
                </div>
              </div>
              
              {/* Sección con botón adicional de cerrar sesión en la página de inicio */}
              <div className="logout-section">
                <button 
                  className="btn btn-danger logout-button responsive-logout-button" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            // Para otras rutas, renderizar el componente correspondiente usando React Router Outlet
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

export default Menu;