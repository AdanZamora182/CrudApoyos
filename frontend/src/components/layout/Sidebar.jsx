import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import logoApoyos from '../../assets/logoApoyos.png';
import {
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
  UserRole
} from './Sidebar.styles';

const Sidebar = ({ collapsed, onToggle, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, getResponsiveValue } = useResponsive();

  const menuItems = [
    { 
      path: '/menu', 
      icon: '🏠', 
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

  const navigateToPage = (path) => {
    if (user) {
      navigate(path);
      // Cerrar sidebar en móviles después de navegar
      if (isMobile) {
        setTimeout(() => onToggle(), 150);
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <SidebarContainer $collapsed={collapsed}>
      <SidebarHeader>
        <SidebarLogo
          src={logoApoyos}
          alt="Logo Apoyos"
          onClick={onToggle}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        />
        {!collapsed && (
          <SystemTitle>Sistema de Gestión</SystemTitle>
        )}
      </SidebarHeader>

      <SidebarMenu>
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            $active={location.pathname === item.path}
            $collapsed={collapsed}
            onClick={() => navigateToPage(item.path)}
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
        
        <MenuItem $logout onClick={onLogout} $collapsed={collapsed}>
          <MenuIcon>
            <i className="bi bi-box-arrow-right"></i>
          </MenuIcon>
          {!collapsed && <MenuText>{getResponsiveValue('Salir', 'Salir', 'Cerrar Sesión')}</MenuText>}
        </MenuItem>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
