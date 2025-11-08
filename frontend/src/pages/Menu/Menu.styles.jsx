import styled from 'styled-components';
import { breakpoints } from '../../styles/breakpoints.jsx';

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
  
  @media (max-width: ${breakpoints.sm}px) {
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
`;