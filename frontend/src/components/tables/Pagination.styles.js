import styled from 'styled-components';

// Variables de tema
const theme = {
  primaryColor: '#5c6bc0',
  secondaryColor: '#26c6da',
  darkColor: '#2c3e50',
  lightColor: '#f5f7fa',
  successColor: '#4caf50',
  warningColor: '#ff9800',
  dangerColor: '#f44336',
  backgroundColor: '#f0f2f5',
  shadowLight: '#ffffff',
  shadowDark: '#d1d9e6',
};

// Contenedor principal de paginación
export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  padding: 20px;
  background-color: transparent;
  border-radius: 15px;
  box-shadow: none;

  @media (max-width: 768px) {
    padding: 15px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

// Fila superior con selector de tamaño de página
export const PaginationTopRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

// Selector de tamaño de página
export const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${theme.darkColor};
  white-space: nowrap;

  label {
    font-weight: 500;
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

// Select de tamaño de página
export const PageSizeSelect = styled.select`
  padding: 4px 6px;
  border: 1px solid rgba(92, 107, 192, 0.2);
  border-radius: 6px;
  background-color: white;
  color: ${theme.darkColor};
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    2px 2px 4px ${theme.shadowDark},
    -2px -2px 4px ${theme.shadowLight};
  min-width: 45px;
  width: 50px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${theme.primaryColor};
    box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.15);
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 3px 4px;
    min-width: 40px;
    width: 45px;
  }
`;

// Información de paginación
export const PaginationInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: ${theme.darkColor};
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

// Info de página
export const PageInfo = styled.span`
  font-size: 12px;
  color: #666;
  margin-top: 2px;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

// Controles de paginación
export const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

// Botón de paginación
export const PaginationButton = styled.button`
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 8px;
  background-color: ${theme.backgroundColor};
  color: ${theme.darkColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 
    3px 3px 6px ${theme.shadowDark},
    -3px -3px 6px ${theme.shadowLight};
  font-size: 14px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      4px 4px 8px ${theme.shadowDark},
      -4px -4px 8px ${theme.shadowLight};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 
      inset 2px 2px 4px ${theme.shadowDark},
      inset -2px -2px 4px ${theme.shadowLight};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 13px;
  }
`;

// Contenedor de números de página
export const PageNumbers = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

// Número de página
export const PageNumber = styled.button`
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 8px;
  background-color: ${theme.backgroundColor};
  color: ${theme.darkColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 
    3px 3px 6px ${theme.shadowDark},
    -3px -3px 6px ${theme.shadowLight};
  font-size: 14px;
  font-weight: 500;

  &:hover:not(.active) {
    transform: translateY(-2px);
    box-shadow: 
      4px 4px 8px ${theme.shadowDark},
      -4px -4px 8px ${theme.shadowLight};
  }

  &.active {
    background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
    color: white;
    box-shadow: 
      inset 2px 2px 4px rgba(0, 0, 0, 0.2),
      inset -2px -2px 4px rgba(255, 255, 255, 0.1);
    transform: none;

    &:hover {
      transform: none;
    }
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 13px;
  }
`;

// Elipsis de página
export const PageEllipsis = styled.span`
  padding: 0 5px;
  color: ${theme.darkColor};
  font-size: 14px;
  font-weight: 500;
`;

export default {
  PaginationContainer,
  PaginationTopRow,
  PageSizeSelector,
  PageSizeSelect,
  PaginationInfo,
  PageInfo,
  PaginationControls,
  PaginationButton,
  PageNumbers,
  PageNumber,
  PageEllipsis,
};
