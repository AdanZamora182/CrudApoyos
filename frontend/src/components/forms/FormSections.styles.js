import styled, { createGlobalStyle } from 'styled-components';

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

// Estilos globales para formularios (reemplaza los CSS externos)
export const FormGlobalStyles = createGlobalStyle`
  /* Estilos para labels de formulario */
  .form-label,
  label.form-label {
    display: block;
    font-size: 13px;
    color: #333;
    margin-bottom: 5px;
    font-weight: 500;
  }

  /* Estilos para inputs con efecto de focus morado */
  .form-control-sm:focus,
  input.form-control-sm:focus,
  input[type="text"]:focus,
  input[type="date"]:focus,
  input[type="email"]:focus,
  input[type="number"]:focus {
    border-color: ${theme.primaryColor} !important;
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.2) !important;
  }

  /* Estilos específicos para inputs en formularios */
  .container form input:focus,
  .container form select:focus,
  .container form textarea:focus {
    border-color: ${theme.primaryColor};
    outline: none;
    box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.2);
  }

  /* Efecto de hover para inputs */
  .form-control:hover:not(:focus),
  .form-control-sm:hover:not(:focus) {
    border-color: rgba(92, 107, 192, 0.4);
  }

  /* Input group container */
  .input-group {
    display: flex;
    align-items: stretch;
    height: 33.5px;
  }

  /* Input dentro de input-group */
  .input-group .form-control {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    height: 33.5px !important;
    min-height: 33.5px !important;
    max-height: 33.5px !important;
    line-height: 1.5;
    padding: 6px 8px;
    border-right: none;
    border-color: #dee2e6;
  }

  /* Estilos para input inválido dentro de input-group */
  .input-group .form-control.is-invalid {
    border-color: #dc3545 !important;
    border-right: none !important;
  }

  .input-group .form-control.is-invalid:focus {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
  }

  /* Cuando el input es inválido, también colorear el botón del dropdown */
  .input-group:has(.form-control.is-invalid) .btn-outline-secondary {
    border-color: #dc3545 !important;
    border-left-color: #e0e0e0 !important;
  }

  /* Input solo (sin botón) dentro de input-group */
  .input-group .form-control:only-child,
  .input-group > input:only-child {
    border-right: 1px solid #dee2e6 !important;
    border-top-right-radius: 0.375rem !important;
    border-bottom-right-radius: 0.375rem !important;
  }

  /* Input solo inválido dentro de input-group */
  .input-group .form-control.is-invalid:only-child {
    border-right: 1px solid #dc3545 !important;
    border-color: #dc3545 !important;
  }

  /* Cuando hay un botón presente, ajustar los bordes del input */
  .input-group:has(.btn) > .form-control {
    border-right: none;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  /* Botón del input-group (dropdown de colonias) */
  .input-group .btn-outline-secondary {
    border-color: #dee2e6;
    color: #6c757d;
    height: 33.5px !important;
    min-height: 33.5px !important;
    max-height: 33.5px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-width: 1px;
    border-style: solid;
    font-size: 13px;
    border-radius: 0 0.375rem 0.375rem 0;
    transition: all 0.15s ease-in-out;
    border-left: 1px solid #e0e0e0;
    outline: none !important;
    box-shadow: none !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  .input-group .btn-outline-secondary:hover {
    background-color: #6c757d;
    border-color: #6c757d;
    color: white;
    outline: none !important;
    box-shadow: none !important;
  }

  .input-group .btn-outline-secondary:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: #dee2e6 !important;
    background-color: #fff !important;
    color: #6c757d !important;
  }

  .input-group .btn-outline-secondary:active {
    background-color: #6c757d;
    border-color: #6c757d;
    color: white;
    outline: none !important;
    box-shadow: none !important;
  }

  /* Botón dentro de input-group */
  .input-group .btn {
    height: 33.5px !important;
    min-height: 33.5px !important;
    max-height: 33.5px !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-left: none;
  }
`;

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

// Contenedor de filas del formulario
export const FormRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
`;

// Columna del formulario
export const FormCol = styled.div`
  flex: ${props => props.flex || 1};
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

// Botón para toggle del dropdown
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
  }

  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: #dee2e6 !important;
    background-color: #fff !important;
    color: #6c757d !important;
  }
`;

// Sección de líder (para IntegranteCirculoForm)
export const LeaderSection = styled.div`
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  input:focus {
    border-color: ${theme.primaryColor} !important;
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.2) !important;
    background-color: white !important;
  }
`;

// Placeholder del líder
export const LeaderPlaceholder = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 5px;
  background-color: transparent;
`;

// Lista de resultados de búsqueda
export const SearchResults = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid ${theme.primaryColor};
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  position: absolute;
  z-index: 1060;
  width: 100%; /* Se ajusta al 100% del contenedor padre */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  top: 100%;
  left: 0;
  border-top: none;

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

  /* Ajuste responsivo para pantallas pequeñas */
  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 12px;
  }
`;

// Item de resultado de búsqueda
export const SearchResultItem = styled.li`
  padding: 10px;
  cursor: pointer;
  white-space: normal; /* Cambiar de nowrap a normal para permitir wrap en móviles */
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 33.5px;
  height: auto; /* Cambiar de height fijo a auto */
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  word-break: break-word; /* Permitir que el texto se divida en líneas */

  &:hover {
    background-color: rgba(92, 107, 192, 0.1);
    color: ${theme.primaryColor};
  }

  &:last-child {
    border-bottom: none;
  }

  /* Ajuste responsivo para pantallas pequeñas */
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px;
    line-height: 1.3;
  }
`;

// Contenedor del líder seleccionado
export const SelectedLiderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Input del líder seleccionado
export const SelectedLiderInput = styled.input`
  flex-grow: 1;
  background-color: rgba(92, 107, 192, 0.05);
  font-weight: 500;
  color: ${theme.primaryColor};
`;

// Input de beneficiario seleccionado para desktop
export const SelectedBeneficiaryInput = styled.input`
  background-color: #f3f6ff;
  border-left: 3px solid ${theme.primaryColor};
  font-weight: 500;
  padding-right: 35px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;

  /* Tablet y móviles grandes */
  @media (max-width: 992px) {
    font-size: 0.8125rem;
    padding-right: 32px !important;
  }

  /* Móviles */
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.5rem 30px 0.5rem 0.75rem !important;
    line-height: 1.3;
    white-space: normal;
    min-height: 2.5rem;
  }

  /* Móviles pequeños */
  @media (max-width: 576px) {
    font-size: 0.6875rem;
    padding: 0.45rem 28px 0.45rem 0.65rem !important;
    min-height: 3rem;
    line-height: 1.2;
  }
`;

// Contenedor mobile para beneficiario seleccionado
export const MobileBeneficiaryContainer = styled.div`
  background-color: #f3f6ff;
  border-left: 3px solid ${theme.primaryColor};
  font-weight: 500;
  padding-right: 35px;
  min-height: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 0.875rem;
  line-height: 1.4;
  border-radius: 0.25rem;
  padding: 0.625rem 2.5rem 0.625rem 0.75rem;
  position: relative;
`;

// Nombre del beneficiario (línea principal)
export const BeneficiaryName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #2c3e50;
  font-size: 0.875rem;
  line-height: 1.35;

  @media (max-width: 576px) {
    font-size: 0.8125rem;
  }
`;

// Clave de elector del beneficiario
export const BeneficiaryClaveElector = styled.div`
  font-size: 0.8125rem;
  color: #6c757d;
  margin-bottom: 0.15rem;

  @media (max-width: 576px) {
    font-size: 0.75rem;
  }
`;

// Tipo de beneficiario (Cabeza/Integrante)
export const BeneficiaryType = styled.div`
  font-size: 0.75rem;
  color: #495057;
  margin-top: 0.2rem;
  font-weight: 400;

  @media (max-width: 576px) {
    font-size: 0.7rem;
  }
`;

// Wrapper responsivo para beneficiario
export const ResponsiveBeneficiaryWrapper = styled.div`
  position: relative;
  width: 100%;

  .desktop-view {
    display: block;
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  .mobile-view {
    display: none;
    
    @media (max-width: 768px) {
      display: block;
    }
  }
`;

// Botón para remover líder
export const RemoveLiderButton = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #9e9e9e;
  font-size: 16px;
  cursor: pointer;
  padding: 2px;
  opacity: 0.7;
  transition: all 0.2s ease;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;

  &:hover {
    opacity: 1;
    background-color: rgba(158, 158, 158, 0.1);
    color: #757575;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(158, 158, 158, 0.3);
  }

  i {
    font-size: 23px;
    font-weight: normal;
  }
`;

// Contenedor de beneficiarios (para ApoyoForm)
export const BeneficiaryContainer = styled.div`
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  input:focus {
    border-color: ${theme.primaryColor} !important;
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.2) !important;
    background-color: white !important;
  }
`;

// Wrapper para beneficiario seleccionado
export const SelectedBeneficiaryWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Placeholder de beneficiario vacío
export const EmptyBeneficiaryPlaceholder = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 5px;
  background-color: transparent;
`;

// Contenedor de beneficiario seleccionado
export const SelectedBeneficiaryContainer = styled.div`
  /* Contenedor para mantener estructura */
`;

// Botón para remover beneficiario
export const RemoveBeneficiaryButton = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #9e9e9e;
  font-size: 16px;
  cursor: pointer;
  padding: 2px;
  opacity: 0.7;
  transition: all 0.2s ease;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;

  &:hover {
    opacity: 1;
    background-color: rgba(158, 158, 158, 0.1);
    color: #757575;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(158, 158, 158, 0.3);
  }

  i {
    font-size: 23px;
    font-weight: normal;
  }
`;

// Texto de error
export const ErrorText = styled.span`
  display: block;
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.25rem;

  i {
    margin-right: 0.25rem;
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

// Contenedor de acciones del formulario
export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`;

// Alerta compacta
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
  FormGlobalStyles,
  FormContainer,
  FormSection,
  SectionHeading,
  FormRow,
  FormCol,
  ColoniaDropdownContainer,
  ColoniaDropdown,
  ColoniaDropdownItem,
  DropdownToggleButton,
  LeaderSection,
  LeaderPlaceholder,
  SearchResults,
  SearchResultItem,
  SelectedLiderContainer,
  SelectedLiderInput,
  SelectedBeneficiaryInput,
  RemoveLiderButton,
  BeneficiaryContainer,
  SelectedBeneficiaryWrapper,
  EmptyBeneficiaryPlaceholder,
  SelectedBeneficiaryContainer,
  RemoveBeneficiaryButton,
  ErrorText,
  FormButton,
  PrimaryButton,
  SecondaryButton,
  ButtonContainer,
  FormActions,
  CompactAlert,
  MobileBeneficiaryContainer,
  BeneficiaryName,
  BeneficiaryClaveElector,
  BeneficiaryType,
  ResponsiveBeneficiaryWrapper,
};
