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

// Contenedor de búsqueda neumórfico
export const SearchContainer = styled.div`
  flex: 1;
  max-width: 500px;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

// Input neumórfico base
export const NeumorphicInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  background-color: ${theme.backgroundColor};
  box-shadow: 
    inset 5px 5px 10px ${theme.shadowDark},
    inset -5px -5px 10px ${theme.shadowLight};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 
      inset 7px 7px 14px ${theme.shadowDark},
      inset -7px -7px 14px ${theme.shadowLight};
  }
`;

// Input de búsqueda (extiende el input neumórfico)
export const SearchInput = styled(NeumorphicInput)`
  width: 100%;
  padding-right: 40px;
`;

// Icono de búsqueda
export const SearchIcon = styled.i`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.primaryColor};
  font-size: 0.9rem;
`;

export default {
  SearchContainer,
  NeumorphicInput,
  SearchInput,
  SearchIcon,
};
