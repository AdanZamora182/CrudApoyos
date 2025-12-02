import styled, { keyframes } from 'styled-components';

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

// Animaciones
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const modalIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

// Modal overlay (fondo oscuro)
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

// Contenedor del contenido del modal
export const ModalContent = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: ${theme.backgroundColor};
  border-radius: 20px;
  padding: 0;
  box-shadow: 
    20px 20px 60px rgba(0, 0, 0, 0.2),
    -20px -20px 60px rgba(255, 255, 255, 0.1);
  animation: ${modalIn} 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  max-height: 90vh;

  &.large-modal {
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
  }
`;

// Cabecera del modal
export const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${theme.backgroundColor};
  padding: 12px 25px 10px 25px;
  border-radius: 20px 20px 0 0;
  border-bottom: 1px solid rgba(209, 217, 230, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-height: 50px;

  h3 {
    margin: 0;
    color: ${theme.primaryColor};
    font-size: 1.3rem;
    font-weight: 600;
    line-height: 1.2;
  }
`;

// Botón de cerrar del modal
export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: ${theme.darkColor};
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(244, 67, 54, 0.1);
    color: ${theme.dangerColor};
  }

  &:focus {
    outline: none;
  }
`;

// Wrapper del contenido del modal (área scrollable)
export const ModalContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px 25px 25px 25px;
  max-height: calc(90vh - 60px);
  scrollbar-width: thin;
  scrollbar-color: ${theme.primaryColor} ${theme.backgroundColor};

  /* Estilos del scrollbar para WebKit */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.backgroundColor};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.primaryColor};
    border-radius: 10px;
    opacity: 0.7;

    &:hover {
      background: #4a5ba8;
      opacity: 1;
    }
  }
`;

// Cuerpo del modal (alias para compatibilidad)
export const ModalBody = styled(ModalContentWrapper)``;

// Contenedor de botones del modal
export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

// Formulario de edición (equivalente a .edit-form)
export const EditForm = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

// Contenedor de secciones del modal (equivalente a .modal-sections)
export const ModalSections = styled.div`
  flex: 1;
  overflow: visible;
  padding-bottom: 20px;
`;

// Sección del modal con estilo neumórfico (equivalente a .modal-section)
export const ModalSection = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 
    inset 3px 3px 7px ${theme.shadowDark},
    inset -3px -3px 7px ${theme.shadowLight};
`;

// Título de sección del modal (equivalente a .section-title)
export const ModalSectionTitle = styled.h5`
  color: ${theme.primaryColor};
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 16px;
  border-bottom: 1px solid rgba(92, 107, 192, 0.2);
  padding-bottom: 8px;
`;

export default {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalContentWrapper,
  ModalBody,
  ModalButtonContainer,
  EditForm,
  ModalSections,
  ModalSection,
  ModalSectionTitle,
};
