import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useResponsive } from '../../hooks/useResponsive';
import Button from '../../components/ui/Button';
import {
  HomeSection,
  WelcomeBanner,
  QuickAccessCards,
  AccessCard,
  CardIcon,
  LogoutSection
} from './Menu.styles.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getResponsiveValue, isMobile } = useResponsive();

  const navigateToPage = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    try {
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error durante logout:', error);
      window.location.href = '/login';
    }
  };

  return (
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
          style={{ 
            maxWidth: isMobile ? '100%' : '250px', 
            margin: '0 auto',
            display: 'flex'
          }}
        >
          {getResponsiveValue('Cerrar Sesión', 'Cerrar Sesión', 'Cerrar Sesión')}
        </Button>
      </LogoutSection>
    </HomeSection>
  );
};

export default HomePage;