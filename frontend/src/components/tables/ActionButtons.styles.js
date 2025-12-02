import styled, { css } from 'styled-components';

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

// Botón base de acción
export const ActionButton = styled.button`
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${theme.backgroundColor};
  color: ${theme.darkColor};
  box-shadow: 
    2px 2px 4px ${theme.shadowDark},
    -2px -2px 4px ${theme.shadowLight};
  font-size: 0.8rem;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 
      inset 2px 2px 5px ${theme.shadowDark},
      inset -2px -2px 5px ${theme.shadowLight};
    transform: translateY(0);
  }

  i {
    font-size: 14px;
    color: white;
  }
`;

// Botón de editar
export const EditButton = styled(ActionButton)`
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  padding: 8px 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #45a049, #3d8b40);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// Botón de eliminar
export const DeleteButton = styled(ActionButton)`
  background: linear-gradient(135deg, #f44336, #d32f2f);
  color: white;
  padding: 8px 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #d32f2f, #b71c1c);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// Botón de ver detalles
export const ViewButton = styled(ActionButton)`
  background: linear-gradient(135deg, #0dcaf0, #0a95a0);
  color: white;
  padding: 8px 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(13, 202, 240, 0.1);

  &:hover {
    background: linear-gradient(135deg, #0a95a0, #0dcaf0);
    box-shadow: 0 4px 8px rgba(13, 202, 240, 0.15);
  }
`;

export default {
  ActionButton,
  EditButton,
  DeleteButton,
  ViewButton,
};
