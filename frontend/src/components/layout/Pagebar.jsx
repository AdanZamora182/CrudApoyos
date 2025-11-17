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

// Botón neumórfico base
export const NeumorphicButton = styled.button`
  border: none;
  border-radius: 50px;
  padding: 8px 20px;
  font-weight: 600;
  color: ${theme.primaryColor};
  background-color: ${theme.backgroundColor};
  box-shadow: 
    5px 5px 10px ${theme.shadowDark},
    -5px -5px 10px ${theme.shadowLight};
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;

  &:hover {
    box-shadow: 
      7px 7px 14px ${theme.shadowDark},
      -7px -7px 14px ${theme.shadowLight};
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 
      inset 5px 5px 10px ${theme.shadowDark},
      inset -5px -5px 10px ${theme.shadowLight};
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Botón primario (con gradiente)
export const PrimaryNeumorphicButton = styled(NeumorphicButton)`
  background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
  color: white;
`;

// Botón de cancelar
export const CancelNeumorphicButton = styled(NeumorphicButton)`
  background-color: ${theme.backgroundColor};
  color: ${theme.darkColor};
`;

// Botón de icono circular
export const IconButton = styled(NeumorphicButton)`
  height: 36px;
  width: 36px;
  padding: 0;
  border-radius: 50%;
  font-size: 16px;
`;

// Botón de icono pequeño
export const SmallIconButton = styled(IconButton)`
  height: 28px;
  width: 28px;
  font-size: 13px;
`;

// Botón de acción editar
export const EditActionButton = styled.button`
  color: white;
  background: linear-gradient(135deg, #4caf50, #45a049);
  border: none;
  padding: 8px 10px;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #45a049, #3d8b40);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// Botón de acción eliminar
export const DeleteActionButton = styled.button`
  color: white;
  background: linear-gradient(135deg, #f44336, #d32f2f);
  border: none;
  padding: 8px 10px;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #d32f2f, #b71c1c);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// Botón home
export const HomeButton = styled.button`
  background-color: ${theme.backgroundColor};
  color: ${theme.darkColor};
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  box-shadow: 
    5px 5px 10px ${theme.shadowDark},
    -5px -5px 10px ${theme.shadowLight};
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  height: 38px;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    color: ${theme.primaryColor};
  }
`;

// Contenedor de tabs
export const TabsContainer = styled.div`
  display: flex;
  gap: 20px;
`;

// Tab neumórfico
export const NeumorphicTab = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 12px;
  background-color: ${theme.backgroundColor};
  color: ${theme.darkColor};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 110px;
  font-size: 14px;
  box-shadow: 
    5px 5px 10px ${theme.shadowDark},
    -5px -5px 10px ${theme.shadowLight};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
  }

  &.active {
    box-shadow: 
      inset 5px 5px 10px ${theme.shadowDark},
      inset -5px -5px 10px ${theme.shadowLight};
    color: ${theme.primaryColor};
  }
`;

// Exportar componentes como default
export default {
  NeumorphicButton,
  PrimaryNeumorphicButton,
  CancelNeumorphicButton,
  IconButton,
  SmallIconButton,
  EditActionButton,
  DeleteActionButton,
  HomeButton,
  TabsContainer,
  NeumorphicTab,
};
