import styled from 'styled-components';

// Variables de tema (equivalentes a :root del CSS)
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
  formReducedScale: 0.9,
};

// Contenedor principal del formulario
export const FormContainer = styled.div`
  background: transparent;
`;

// Sección con fondo de contraste
export const FormSection = styled.div`
  background-color: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  margin-bottom: 1rem;
`;

// Encabezados de sección
export const SectionHeading = styled.h5`
  color: ${theme.primaryColor};
  font-weight: 600;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 15px;
`;

// Contenedor del dropdown de colonias
export const ColoniaDropdownContainer = styled.div`
  position: relative;
`;

// Lista del dropdown de colonias
export const ColoniaDropdown = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid ${theme.primaryColor};
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  position: absolute;
  z-index: 1060;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  top: 100%;
  left: 0;
  border-top: none;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.primaryColor};
    border-radius: 3px;
    opacity: 0.7;

    &:hover {
      background: #4a5ba8;
      opacity: 1;
    }
  }
`;

// Items del dropdown de colonias
export const ColoniaDropdownItem = styled.li`
  padding: 10px 14px;
  cursor: pointer;
  font-size: 13px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgba(92, 107, 192, 0.1);
    color: ${theme.primaryColor};
  }

  &:last-child {
    border-bottom: none;
  }
`;

// Botón personalizado para mostrar/ocultar dropdown
export const DropdownToggleButton = styled.button`
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  font-size: 12px !important;
  padding: 4px 8px !important;
  border-color: #dee2e6 !important;
  background-color: #fff !important;
  color: #6c757d !important;
  outline: none !important;
  box-shadow: none !important;

  &:hover {
    background-color: #6c757d !important;
    border-color: #6c757d !important;
    color: white !important;
    outline: none !important;
    box-shadow: none !important;
  }

  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: #dee2e6 !important;
    background-color: #fff !important;
    color: #6c757d !important;
  }

  &:active {
    background-color: #6c757d !important;
    border-color: #6c757d !important;
    color: white !important;
    outline: none !important;
    box-shadow: none !important;
  }

  &:focus:not(:focus-visible) {
    outline: none !important;
    box-shadow: none !important;
    border-color: #dee2e6 !important;
    background-color: #fff !important;
    color: #6c757d !important;
  }

  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    border-color: #dee2e6 !important;
    background-color: #fff !important;
    color: #6c757d !important;
  }

  &:not(:hover):not(:active) {
    border-color: #dee2e6 !important;
    background-color: #fff !important;
    color: #6c757d !important;
  }
`;

// Botones del formulario
export const FormButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Botón primario
export const PrimaryButton = styled(FormButton)`
  background-color: ${theme.primaryColor};
  color: white;

  &:hover:not(:disabled) {
    background-color: #4a5ba8;
  }
`;

// Botón secundario
export const SecondaryButton = styled(FormButton)`
  background-color: #ddd;
  color: #333;

  &:hover:not(:disabled) {
    background-color: #ccc;
  }
`;

// Contenedor de botones
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`;

// Alerta de error compacta
export const CompactAlert = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f1aeb5;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.5rem;
  display: inline-block;
  font-size: 0.95rem;

  .alert-icon {
    color: #d32f2f;
    margin-right: 0.5rem;
  }
`;

export default {
  FormContainer,
  FormSection,
  SectionHeading,
  ColoniaDropdownContainer,
  ColoniaDropdown,
  ColoniaDropdownItem,
  DropdownToggleButton,
  FormButton,
  PrimaryButton,
  SecondaryButton,
  ButtonContainer,
  CompactAlert,
};