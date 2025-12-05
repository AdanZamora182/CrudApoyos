import styled from 'styled-components';

// Variables de tema
const theme = {
  primaryColor: '#5c6bc0',
  textColor: '#374151',
  textMuted: '#6b7280',
  borderColor: '#e5e7eb',
  hoverBg: '#f9fafb',
  activeBg: '#5c6bc0',
  activeText: '#ffffff',
};

// Contenedor principal de paginación - diseño horizontal unificado
export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #ffffff;
  border: 1px solid ${theme.borderColor};
  border-radius: 8px;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  @media (max-width: 768px) {
    padding: 10px;
    gap: 10px;
  }
`;

// Fila izquierda con selector de tamaño de página e info
export const PaginationTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 900px) {
    width: 100%;
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: 12px;
    justify-content: space-between;
    width: 100%;
  }
`;

// Selector de tamaño de página
export const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${theme.textMuted};
  white-space: nowrap;

  label {
    font-weight: 400;
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

// Select de tamaño de página
export const PageSizeSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid ${theme.borderColor};
  border-radius: 6px;
  background-color: #ffffff;
  color: ${theme.textColor};
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s ease;
  min-width: 60px;

  &:hover {
    border-color: ${theme.primaryColor};
  }

  &:focus {
    outline: none;
    border-color: ${theme.primaryColor};
    box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.1);
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 5px 8px;
    min-width: 55px;
  }
`;

// Información de paginación
export const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: ${theme.textMuted};
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

// Info de página
export const PageInfo = styled.span`
  font-size: 13px;
  color: ${theme.textMuted};

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

// Controles de paginación - lado derecho
export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 900px) {
    width: 100%;
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: 2px;
  }
`;

// Botón de paginación (flechas)
export const PaginationButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${theme.borderColor};
  border-radius: 6px;
  background-color: #ffffff;
  color: ${theme.textColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;

  &:hover:not(:disabled) {
    background-color: ${theme.hoverBg};
    border-color: ${theme.primaryColor};
    color: ${theme.primaryColor};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: ${theme.hoverBg};
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
`;

// Contenedor de números de página
export const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 0 4px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    gap: 1px;
    margin: 0 2px;
  }
`;

// Número de página
export const PageNumber = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  background-color: transparent;
  color: ${theme.textColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
  font-weight: 500;

  &:hover:not(.active) {
    background-color: ${theme.hoverBg};
    border-color: ${theme.borderColor};
  }

  &.active {
    background-color: ${theme.activeBg};
    color: ${theme.activeText};
    border-color: ${theme.activeBg};
  }

  @media (max-width: 480px) {
    min-width: 28px;
    height: 28px;
    padding: 0 6px;
    font-size: 12px;
  }
`;

// Elipsis de página
export const PageEllipsis = styled.span`
  padding: 0 6px;
  color: ${theme.textMuted};
  font-size: 13px;
  display: flex;
  align-items: center;

  @media (max-width: 480px) {
    padding: 0 4px;
    font-size: 12px;
  }
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
