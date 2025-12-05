import styled from 'styled-components';
import { breakpoints } from '../../styles/breakpoints.jsx';

// Barra lateral
export const SidebarContainer = styled.aside`
  width: ${props => props.$collapsed ? '60px' : '230px'};
  background-color: white;
  box-shadow: 2px 0 5px ${props => props.theme?.shadows?.light || 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  flex-direction: column;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
  z-index: 100;
  height: 100vh;
  position: sticky;
  top: 0;
  will-change: width;

  /* Comportamiento responsivo mejorado para móviles y tablets */
  @media (max-width: ${breakpoints.md}) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    width: ${props => props.$collapsed ? '0' : '280px'};
    transform: ${props => props.$collapsed ? 'translateX(-100%)' : 'translateX(0)'};
    box-shadow: ${props => props.$collapsed ? 'none' : '4px 0 8px rgba(0, 0, 0, 0.15)'};
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, width;
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme?.spacing?.md || '16px'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(0, 0, 0, 0.1)'};
  height: 60px;
  position: relative;
`;

export const SidebarLogo = styled.img`
  height: 30px;
  margin-right: ${props => props.theme?.spacing?.sm || '8px'};
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const SystemTitle = styled.h2`
  font-size: ${props => props.theme?.typography?.fontSize?.sm || '13px'};
  color: ${props => props.theme?.colors?.primary || '#5c6bc0'};
  white-space: nowrap;
  transition: opacity ${props => props.theme?.transitions?.standard || '0.3s ease'};
  margin: 0;
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || 500};
`;

export const SidebarMenu = styled.nav`
  flex: 1;
  padding: ${props => props.theme?.spacing?.md || '16px'} 0;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme?.spacing?.sm || '8px'} ${props => props.theme?.spacing?.md || '16px'};
  cursor: pointer;
  transition: background-color 0.15s ease,
              color 0.15s ease,
              border-color 0.15s ease;
  color: ${props => props.theme?.colors?.dark || '#2c3e50'};
  position: relative;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  border-left: 3px solid transparent;
  
  ${props => props.$active && `
    background-color: ${props.theme?.colors?.primaryLight || 'rgba(92, 107, 192, 0.1)'};
    color: ${props.theme?.colors?.primary || '#5c6bc0'};
    border-left-color: ${props.theme?.colors?.primary || '#5c6bc0'};
  `}
  
  ${props => props.$logout && `
    color: ${props.theme?.colors?.error || '#e53935'};
    border-top: 1px solid ${props.theme?.colors?.border || 'rgba(0, 0, 0, 0.1)'};
    padding-top: ${props.theme?.spacing?.md || '16px'} !important;
    margin-top: ${props.theme?.spacing?.md || '16px'};
    
    &:hover {
      background-color: rgba(229, 57, 53, 0.1);
      border-left-color: ${props.theme?.colors?.error || '#e53935'};
    }
  `}
  
  &:hover {
    background-color: ${props => props.theme?.colors?.hover || '#ebedf2'};
  }

  &:active {
    background-color: ${props => props.theme?.colors?.primaryLight || 'rgba(92, 107, 192, 0.15)'};
  }
`;

export const MenuIcon = styled.span`
  font-size: ${props => props.theme?.typography?.fontSize?.lg || '18px'};
  min-width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.2s ease;
  margin-right: ${props => props.theme?.spacing?.sm || '8px'};\
  border-radius: 8px;
  position: relative;
  background-color: ${props => props.$active ? 'rgba(92, 107, 192, 0.2)' : 'transparent'};
  transform: ${props => props.$active ? 'scale(1.1)' : 'scale(1)'};

  /* Efecto hover en el icono */
  ${MenuItem}:hover & {
    transform: scale(1.15);
    background-color: rgba(92, 107, 192, 0.15);
  }

  /* Efecto de click */
  ${MenuItem}:active & {
    transform: scale(0.95);
  }
`;

export const MenuText = styled.span`
  white-space: nowrap;
  transition: opacity 0.2s ease 0.05s;
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || 500};
  opacity: 1;
`;

export const SidebarFooter = styled.div`
  padding: ${props => props.theme?.spacing?.md || '16px'};
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(0, 0, 0, 0.1)'};
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$collapsed ? 'center' : 'stretch'};
  transition: align-items 0.2s ease;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme?.spacing?.sm || '8px'};
  padding-bottom: ${props => props.theme?.spacing?.sm || '8px'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(0, 0, 0, 0.1)'};
`;

export const UserName = styled.span`
  font-weight: ${props => props.theme?.typography?.fontWeight?.semibold || 600};
  font-size: ${props => props.theme?.typography?.fontSize?.sm || '13px'};
  color: ${props => props.theme?.colors?.dark || '#2c3e50'};
`;

export const UserRole = styled.span`
  font-size: ${props => props.theme?.typography?.fontSize?.xs || '12px'};
  color: ${props => props.theme?.colors?.textMuted || '#888'};
`;