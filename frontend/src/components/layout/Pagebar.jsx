import styled from 'styled-components';

// Variables de tema
const theme = {
  primaryColor: '#5c6bc0',
  primaryHover: '#4a5ba8',
  primaryActive: '#3949ab',
  secondaryColor: '#26c6da',
  darkColor: '#2c3e50',
  textColor: '#37474f',
  lightColor: '#f5f7fa',
  successColor: '#4caf50',
  successHover: '#45a049',
  warningColor: '#ff9800',
  dangerColor: '#f44336',
  dangerHover: '#d32f2f',
  backgroundColor: '#ffffff',
  borderColor: '#e0e0e0',
  hoverBackground: '#f8f9fa',
  activeBackground: '#e8eaf6',
  shadowSm: '0 1px 3px rgba(0, 0, 0, 0.08)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 20px rgba(0, 0, 0, 0.12)',
};

// Botón base minimalista
export const Button = styled.button`
  border: 1px solid ${theme.borderColor};
  border-radius: 6px;
  padding: 8px 20px;
  font-weight: 500;
  color: ${theme.textColor};
  background-color: ${theme.backgroundColor};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  box-shadow: ${theme.shadowSm};
  letter-spacing: 0.01em;

  &:hover:not(:disabled) {
    background-color: ${theme.hoverBackground};
    box-shadow: ${theme.shadowMd};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${theme.shadowSm};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Botón primario
export const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryHover} 100%);
  color: white;
  border: none;
  box-shadow: ${theme.shadowMd};
  font-weight: 600;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${theme.primaryHover} 0%, ${theme.primaryActive} 100%);
    box-shadow: ${theme.shadowLg};
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${theme.shadowMd};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.25), ${theme.shadowMd};
  }
`;

// Botón secundario
export const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${theme.primaryColor};
  border: 1.5px solid ${theme.primaryColor};
  font-weight: 500;

  &:hover:not(:disabled) {
    background-color: ${theme.activeBackground};
    border-color: ${theme.primaryHover};
    color: ${theme.primaryHover};
  }
`;

// Botón de icono circular
export const IconButton = styled(Button)`
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
  background: linear-gradient(135deg, ${theme.successColor} 0%, #43a047 100%);
  border: none;
  padding: 8px 10px;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadowSm};
  font-weight: 500;

  &:hover {
    background: linear-gradient(135deg, ${theme.successHover} 0%, #388e3c 100%);
    box-shadow: ${theme.shadowMd};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${theme.shadowSm};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
`;

// Botón de acción eliminar
export const DeleteActionButton = styled.button`
  color: white;
  background: linear-gradient(135deg, ${theme.dangerColor} 0%, #e53935 100%);
  border: none;
  padding: 8px 10px;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadowSm};
  font-weight: 500;

  &:hover {
    background: linear-gradient(135deg, ${theme.dangerHover} 0%, #c62828 100%);
    box-shadow: ${theme.shadowMd};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${theme.shadowSm};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2);
  }
`;

// Botón home
export const HomeButton = styled.button`
  background-color: ${theme.backgroundColor};
  color: ${theme.textColor};
  border: 1px solid ${theme.borderColor};
  border-radius: 6px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  height: 38px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: ${theme.shadowSm};
  letter-spacing: 0.01em;

  &:hover {
    background-color: ${theme.hoverBackground};
    box-shadow: ${theme.shadowMd};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${theme.shadowSm};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.15);
  }
`;

// Contenedor de tabs
export const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

// Tab con mismo estilo que HomeButton
export const Tab = styled.button`
  background-color: ${theme.backgroundColor};
  color: ${theme.textColor};
  border: 1px solid ${theme.borderColor};
  border-radius: 6px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 110px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: ${theme.shadowSm};
  letter-spacing: 0.01em;
  justify-content: center;

  &:hover:not(.active) {
    background-color: ${theme.hoverBackground};
    box-shadow: ${theme.shadowMd};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${theme.shadowSm};
  }

  &.active {
    background-color: ${theme.primaryColor};
    color: white;
    border-color: ${theme.primaryColor};
    font-weight: 600;
    box-shadow: ${theme.shadowMd};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.15);
  }
`;

// Exportar componentes
export default {
  Button,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  SmallIconButton,
  EditActionButton,
  DeleteActionButton,
  HomeButton,
  TabsContainer,
  Tab,
};
