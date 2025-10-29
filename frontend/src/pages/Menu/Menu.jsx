import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import logoApoyos from '../../assets/logoApoyos.png';
import { useAuth } from '../../hooks/useAuth';
import { useToaster } from '../../components/ui/ToasterProvider';
import { useResponsive } from '../../hooks/useResponsive';
import { theme } from '../../styles/theme';
import Button from '../../components/ui/Button';
import {
  LayoutContainer,
  SidebarContainer,
  SidebarHeader,
  SidebarLogo,
  SystemTitle,
  SidebarMenu,
  MenuItem,
  MenuIcon,
  MenuText,
  SidebarFooter,
  UserInfo,
  UserName,
  UserRole,
  MainContent,
  NavbarContainer,
  NavbarTitle,
  UserWelcome,
  ContentBody,
  HomeSection,
  WelcomeBanner,
  QuickAccessCards,
  AccessCard,
  CardIcon,
  LogoutSection
} from './Menu.styles';

function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { clearMessageHistory } = useToaster();
  const { isMobile, isTablet, getResponsiveValue } = useResponsive();
  
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    // En móvil, empezar siempre colapsado
    if (isMobile) return true;
    return savedState ? JSON.parse(savedState) : false;
  });
  
  const [title, setTitle] = useState("Inicio");

  // Efecto para manejar el colapso automático en móviles
  useEffect(() => {
    if (isMobile && !collapsed) {
      setCollapsed(true);
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

  const navigateToPage = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    // Solo guardar en localStorage si no es móvil
    if (!isMobile) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    }
  };

  const menuItems = [
    { 
      path: '/menu', 
      icon: getResponsiveValue('🏠', '🏠', '🏠'), 
      text: getResponsiveValue('Inicio', 'Inicio', 'Inicio') 
    },
    { 
      path: '/cabezas-circulo', 
      icon: '👥', 
      text: getResponsiveValue('Cabezas', 'Cabezas de Círculo', 'Cabezas de Círculo') 
    },
    { 
      path: '/integrantes-circulo', 
      icon: '👪', 
      text: getResponsiveValue('Integrantes', 'Integrantes', 'Integrantes de Círculo') 
    },
    { 
      path: '/apoyos', 
      icon: '🎁', 
      text: 'Apoyos' 
    },
    { 
      path: '/dashboard', 
      icon: '📊', 
      text: 'Dashboard' 
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <LayoutContainer>
        {/* Overlay para móviles cuando el sidebar está abierto */}
        {isMobile && !collapsed && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 99,
            }}
            onClick={() => setCollapsed(true)}
          />
        )}

        {/* Sidebar */}
        <SidebarContainer $collapsed={collapsed} $isMobile={isMobile}>
          <SidebarHeader>
            <SidebarLogo 
              src={logoApoyos} 
              alt="Logo Apoyos"
              onClick={toggleSidebar}
              title={collapsed ? "Expandir menú" : "Colapsar menú"}
            />
            {!collapsed && (
              <SystemTitle>{getResponsiveValue('Gestión', 'Sistema Gestión', 'Sistema de Gestión')}</SystemTitle>
            )}
          </SidebarHeader>

          <SidebarMenu>
            {menuItems.map((item) => (
              <MenuItem
                key={item.path}
                $active={location.pathname === item.path}
                $collapsed={collapsed}
                onClick={() => {
                  navigateToPage(item.path);
                  // Cerrar sidebar en móviles después de navegar
                  if (isMobile) setCollapsed(true);
                }}
              >
                <MenuIcon>{item.icon}</MenuIcon>
                {!collapsed && <MenuText>{item.text}</MenuText>}
              </MenuItem>
            ))}
          </SidebarMenu>

          <SidebarFooter $collapsed={collapsed}>
            {!collapsed && (
              <UserInfo>
                <UserName>{user?.nombre}</UserName>
                <UserRole>{getResponsiveValue('Admin', 'Admin', 'Administrador')}</UserRole>
              </UserInfo>
            )}
            
            <MenuItem $logout onClick={handleLogout} $collapsed={collapsed}>
              <MenuIcon>
                <i className="bi bi-box-arrow-right"></i>
              </MenuIcon>
              {!collapsed && <MenuText>{getResponsiveValue('Salir', 'Salir', 'Cerrar Sesión')}</MenuText>}
            </MenuItem>
          </SidebarFooter>
        </SidebarContainer>

        {/* Main Content */}
        <MainContent $collapsed={collapsed}>
          <NavbarContainer $isMobile={isMobile}>
            {/* Botón de menú hamburguesa para móviles */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  marginRight: '10px',
                  color: theme.colors.primary,
                }}
              >
                <i className="bi bi-list"></i>
              </button>
            )}
            <NavbarTitle>{getResponsiveValue(
              title.length > 15 ? title.substring(0, 15) + '...' : title,
              title.length > 25 ? title.substring(0, 25) + '...' : title,
              title
            )}</NavbarTitle>
            {!isMobile && (
              <UserWelcome>
                Bienvenid@, {user?.nombre}
              </UserWelcome>
            )}
          </NavbarContainer>

          {location.pathname === '/menu' ? (
            <ContentBody>
              <HomeSection>
                <WelcomeBanner>
                  <h2>{getResponsiveValue(
                    'Sistema de Apoyos',
                    'Sistema de Gestión de Apoyos',
                    'Bienvenido al Sistema de Gestión de Apoyos'
                  )}</h2>
                  <p>{getResponsiveValue(
                    'Selecciona una opción del menú.',
                    'Selecciona una opción del menú para comenzar.',
                    'Seleccione una opción del menú lateral para comenzar a trabajar.'
                  )}</p>
                </WelcomeBanner>
                
                <QuickAccessCards $gridColumns={getResponsiveValue(1, 2, 4)}>
                  <AccessCard onClick={() => navigateToPage('/cabezas-circulo')}>
                    <CardIcon>👥</CardIcon>
                    <h3>{getResponsiveValue('Cabezas', 'Cabezas de Círculo', 'Cabezas de Círculo')}</h3>
                    <p>{getResponsiveValue(
                      'Gestiona representantes',
                      'Gestiona los representantes',
                      'Gestiona los representantes de los beneficiarios'
                    )}</p>
                  </AccessCard>
                  
                  <AccessCard onClick={() => navigateToPage('/integrantes-circulo')}>
                    <CardIcon>👪</CardIcon>
                    <h3>{getResponsiveValue('Integrantes', 'Integrantes', 'Integrantes de Círculo')}</h3>
                    <p>{getResponsiveValue(
                      'Gestiona beneficiarios',
                      'Gestiona los beneficiarios',
                      'Gestiona los beneficiarios de los apoyos'
                    )}</p>
                  </AccessCard>
                  
                  <AccessCard onClick={() => navigateToPage('/apoyos')}>
                    <CardIcon>🎁</CardIcon>
                    <h3>Apoyos</h3>
                    <p>{getResponsiveValue(
                      'Gestiona apoyos',
                      'Gestiona apoyos entregados',
                      'Gestiona los apoyos entregados a beneficiarios'
                    )}</p>
                  </AccessCard>
                  
                  <AccessCard onClick={() => navigateToPage('/dashboard')}>
                    <CardIcon>📊</CardIcon>
                    <h3>Dashboard</h3>
                    <p>{getResponsiveValue(
                      'Ve estadísticas',
                      'Visualiza estadísticas',
                      'Visualiza estadísticas y métricas del sistema'
                    )}</p>
                  </AccessCard>
                </QuickAccessCards>
                
                <LogoutSection>
                  <Button 
                    variant="danger"
                    onClick={handleLogout}
                    icon="bi bi-box-arrow-right"
                  >
                    {getResponsiveValue('Cerrar Sesión', 'Cerrar Sesión', 'Cerrar Sesión')}
                  </Button>
                </LogoutSection>
              </HomeSection>
            </ContentBody>
          ) : (
            <ContentBody>
              <Outlet />
            </ContentBody>
          )}
        </MainContent>
      </LayoutContainer>
    </ThemeProvider>
  );
}

export default Menu;