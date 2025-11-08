import styled from 'styled-components';
import { breakpoints } from '../../styles/breakpoints.jsx';

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

  @media (max-width: ${breakpoints.md}) {
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
  gap: ${props => props.theme?.spacing?.md || '16px'};

  @media (max-width: ${breakpoints.md}) {
    padding: 0 ${props => props.theme?.spacing?.md || '16px'};
    height: 56px;
  }

  @media (max-width: ${breakpoints.sm}) {
    padding: 0 ${props => props.theme?.spacing?.sm || '8px'};
    height: 52px;
  }
`;

export const NavbarTitle = styled.h1`
  font-size: ${props => props.theme?.typography?.fontSize?.xl || '20px'};
  color: ${props => props.theme?.colors?.dark || '#2c3e50'};
  white-space: normal;
  margin: 0;
  font-weight: ${props => props.theme?.typography?.fontWeight?.semibold || 600};
  flex: 1;
  line-height: 1.3;

  @media (max-width: ${breakpoints.md}) {
    font-size: ${props => props.theme?.typography?.fontSize?.lg || '16px'};
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: ${props => props.theme?.typography?.fontSize?.md || '14px'};
    line-height: 1.2;
  }
`;

export const UserWelcome = styled.div`
  font-size: ${props => props.theme?.typography?.fontSize?.sm || '13px'};
  color: ${props => props.theme?.colors?.textLight || '#666'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || 500};
  white-space: nowrap;
  
  @media (max-width: ${breakpoints.lg}px) {
    font-size: ${props => props.theme?.typography?.fontSize?.xs || '12px'};
  }
`;

export const ContentBody = styled.div`
  flex: 1;
  padding: ${props => props.theme?.spacing?.lg || '24px'};
  overflow-y: auto;
  background-color: ${props => props.theme?.colors?.light || '#f5f7fa'};

  @media (max-width: ${breakpoints.sm}) {
    padding: ${props => props.theme?.spacing?.md || '16px'};
  }
`;