import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { useToaster } from '../../components/ui/ToasterProvider';
import { useResponsive } from '../../hooks/useResponsive';
import { theme } from '../../styles/theme';
import Layout from '../../components/layout/Layout';
import HomePage from './HomePage';

function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { clearMessageHistory } = useToaster();
  const { isMobile } = useResponsive();
  
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    // En móvil, empezar siempre colapsado
    if (isMobile) return true;
    return savedState ? JSON.parse(savedState) : false;
  });

  const [title, setTitle] = useState("Inicio");

  // Efecto para manejar cambios en el tamaño de pantalla
  // Solo se ejecuta cuando isMobile cambia (no cuando collapsed cambia)
  useEffect(() => {
    if (isMobile) {
      // En móvil, cerrar el sidebar al cambiar de vista desktop a móvil
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (!savedState || savedState === 'false') {
        setCollapsed(true);
      }
    }
  }, [isMobile]);

  const handleLogout = () => {
    try {
      clearMessageHistory();
      logout();
      navigate('/login', { replace: true });
      
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }, 100);
    } catch (error) {
      console.error('Error durante logout:', error);
      window.location.href = '/login';
    }
  };

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

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    // Solo guardar en localStorage si no es móvil
    if (!isMobile) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout 
        collapsed={collapsed}
        onToggleSidebar={toggleSidebar}
        user={user}
        onLogout={handleLogout}
        title={title}
      >
        {/* Contenido específico para la página de inicio */}
        {location.pathname === '/menu' && <HomePage />}
        {/* Para todas las demás rutas, usa Outlet */}
        {location.pathname !== '/menu' && <Outlet />}
      </Layout>
    </ThemeProvider>
  );
}

export default Menu;