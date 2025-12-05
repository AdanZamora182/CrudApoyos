import styled from 'styled-components';

// Variables de tema - diseño minimalista (consistente con Table y Pagination)
const theme = {
  primaryColor: '#5c6bc0',
  textColor: '#374151',
  textMuted: '#6b7280',
  borderColor: '#e5e7eb',
  hoverBg: '#f9fafb',
  white: '#ffffff',
};

// Contenedor de búsqueda - diseño minimalista
export const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;

  @media (max-width: 768px) {
    max-width: none;
    flex: 1;
  }
`;

// Input de búsqueda - diseño minimalista
export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 36px 8px 12px;
  border: 1px solid ${theme.borderColor};
  border-radius: 6px;
  font-size: 13px;
  color: ${theme.textColor};
  background-color: ${theme.white};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${theme.textMuted};
  }

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
    padding: 7px 32px 7px 10px;
  }
`;

// Icono de búsqueda
export const SearchIcon = styled.i`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.textMuted};
  font-size: 14px;
  pointer-events: none;
  transition: color 0.2s ease;

  ${SearchContainer}:focus-within & {
    color: ${theme.primaryColor};
  }
`;

export default {
  SearchContainer,
  SearchInput,
  SearchIcon,
};
