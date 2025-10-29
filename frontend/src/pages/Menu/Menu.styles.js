import styled from 'styled-components';

// Layout principal
export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme?.colors?.light || '#f5f7fa'};
  width: 100%;
`;

// Barra lateral
export const SidebarContainer = styled.aside`
  width: ${props => props.$collapsed ? '60px' : '230px'};
  background-color: white;
  box-shadow: 2px 0 5px ${props => props.theme?.shadows?.light || 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  flex-direction: column;
  transition: width ${props => props.theme?.transitions?.standard || '0.3s ease'};
  overflow-x: hidden;
  z-index: 100;
  height: 100vh;
  position: sticky;
  top: 0;
  
  /* Comportamiento responsivo mejorado */
  ${props => props.$isMobile && `
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1000;
    width: ${props.$collapsed ? '0' : '280px'};
    transform: ${props.$collapsed ? 'translateX(-100%)' : 'translateX(0)'};
  `}
  
  @media (max-width: ${props => props.theme?.breakpoints?.tablet || '768px'}) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1000;
    transform: ${props => props.$collapsed ? 'translateX(-100%)' : 'translateX(0)'};
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
  transition: all ${props => props.theme?.transitions?.standard || '0.3s ease'};
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
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
  transition: all ${props => props.theme?.transitions?.standard || '0.3s ease'};
  color: ${props => props.theme?.colors?.dark || '#2c3e50'};
  position: relative;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  
  ${props => props.$active && `
    background-color: ${props.theme?.colors?.primaryLight || 'rgba(92, 107, 192, 0.1)'};
    color: ${props.theme?.colors?.primary || '#5c6bc0'};
    border-left: 3px solid ${props.theme?.colors?.primary || '#5c6bc0'};
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
`;

export const MenuIcon = styled.span`
  font-size: ${props => props.theme?.typography?.fontSize?.lg || '16px'};
  min-width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all ${props => props.theme?.transitions?.standard || '0.3s ease'};
  margin-right: ${props => props.theme?.spacing?.sm || '8px'};
`;

export const MenuText = styled.span`
  white-space: nowrap;
  transition: opacity ${props => props.theme?.transitions?.standard || '0.3s ease'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || 500};
`;

export const SidebarFooter = styled.div`
  padding: ${props => props.theme?.spacing?.md || '16px'};
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(0, 0, 0, 0.1)'};
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$collapsed ? 'center' : 'stretch'};
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

// Contenido principal
export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all ${props => props.theme?.transitions?.standard || '0.3s ease'};
  width: ${props => props.$collapsed ? 
    'calc(100% - 60px)' : 
    'calc(100% - 230px)'
  };
  margin-left: 0;
  
  @media (max-width: ${props => props.theme?.breakpoints?.tablet || '768px'}) {
    width: 100%;
  }
`;

export const NavbarContainer = styled.header`
  height: 60px;
  padding: 0 ${props => props.theme?.spacing?.lg || '24px'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 90;
  width: 100%;
  flex-shrink: 0;
  
  /* Ajustes específicos para móviles */
  ${props => props.$isMobile && `
    padding: 0 ${props.theme?.spacing?.md || '16px'};
    justify-content: flex-start;
  `}
  
  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '600px'}) {
    padding: 0 ${props => props.theme?.spacing?.md || '16px'};
    height: 50px;
  }
`;

export const NavbarTitle = styled.h1`
  font-size: ${props => props.theme?.typography?.fontSize?.xl || '20px'};
  color: ${props => props.theme?.colors?.dark || '#2c3e50'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  font-weight: ${props => props.theme?.typography?.fontWeight?.semibold || 600};
  
  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '600px'}) {
    font-size: ${props => props.theme?.typography?.fontSize?.lg || '16px'};
  }
`;

export const UserWelcome = styled.div`
  font-size: ${props => props.theme?.typography?.fontSize?.sm || '13px'};
  color: ${props => props.theme?.colors?.textLight || '#666'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || 500};
  
  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '600px'}) {
    font-size: ${props => props.theme?.typography?.fontSize?.xs || '12px'};
  }
`;

export const ContentBody = styled.div`
  flex: 1;
  padding: ${props => props.theme?.spacing?.lg || '24px'};
  overflow-y: auto;
  background-color: ${props => props.theme?.colors?.light || '#f5f7fa'};
  
  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '600px'}) {
    padding: ${props => props.theme?.spacing?.md || '16px'};
  }
`;

export const HomeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme?.spacing?.xl || '32px'};
  max-width: 1200px;
  margin: 0 auto;
`;

export const WelcomeBanner = styled.div`
  background: white;
  padding: ${props => props.theme?.spacing?.xl || '32px'};
  border-radius: ${props => props.theme?.borderRadius?.lg || '16px'};
  text-align: center;
  box-shadow: ${props => props.theme?.shadows?.card || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  
  h2 {
    font-size: ${props => props.theme?.typography?.fontSize?.xl || '20px'};
    margin-bottom: ${props => props.theme?.spacing?.sm || '8px'};
    color: ${props => props.theme?.colors?.primary || '#5c6bc0'};
  }
  
  p {
    font-size: ${props => props.theme?.typography?.fontSize?.md || '14px'};
    color: ${props => props.theme?.colors?.textLight || '#666'};
    max-width: 600px;
    margin: 0 auto;
  }
`;

export const QuickAccessCards = styled.div`
  display: grid;
  grid-template-columns: ${props => {
    if (props.$gridColumns === 1) return '1fr';
    if (props.$gridColumns === 2) return 'repeat(2, 1fr)';
    if (props.$gridColumns === 4) return 'repeat(auto-fit, minmax(250px, 1fr))';
    return 'repeat(auto-fit, minmax(250px, 1fr))';
  }};
  gap: ${props => props.theme?.spacing?.lg || '24px'};
  
  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '600px'}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme?.spacing?.md || '16px'};
  }
`;

export const AccessCard = styled.div`
  background: white;
  padding: ${props => props.theme?.spacing?.lg || '24px'};
  border-radius: ${props => props.theme?.borderRadius?.lg || '16px'};
  text-align: center;
  cursor: pointer;
  transition: all ${props => props.theme?.transitions?.standard || '0.3s ease'};
  box-shadow: ${props => props.theme?.shadows?.card || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme?.shadows?.hover || '0 8px 15px rgba(0, 0, 0, 0.1)'};
    border-color: ${props => props.theme?.colors?.primary || '#5c6bc0'};
  }
  
  h3 {
    font-size: ${props => props.theme?.typography?.fontSize?.lg || '16px'};
    margin-bottom: ${props => props.theme?.spacing?.sm || '8px'};
    color: ${props => props.theme?.colors?.primary || '#5c6bc0'};
  }
  
  p {
    font-size: ${props => props.theme?.typography?.fontSize?.sm || '13px'};
    color: ${props => props.theme?.colors?.textLight || '#666'};
    line-height: 1.5;
  }
`;

export const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme?.spacing?.md || '16px'};
  background-color: ${props => props.theme?.colors?.primaryLight || 'rgba(92, 107, 192, 0.1)'};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto ${props => props.theme?.spacing?.md || '16px'};
  transition: transform ${props => props.theme?.transitions?.standard || '0.3s ease'};
  
  ${AccessCard}:hover & {
    transform: scale(1.1);
  }
`;

export const LogoutSection = styled.div`
  text-align: center;
  margin-top: ${props => props.theme?.spacing?.xl || '32px'};
  padding: ${props => props.theme?.spacing?.lg || '24px'};
  background: white;
  border-radius: ${props => props.theme?.borderRadius?.lg || '16px'};
  box-shadow: ${props => props.theme?.shadows?.card || '0 4px 6px rgba(0, 0, 0, 0.1)'};
`;
