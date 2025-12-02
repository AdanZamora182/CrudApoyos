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
export const ViewModalOverlay = styled.div`
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
export const ViewModalContent = styled.div`
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
export const ViewModalHeader = styled.div`
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

// Botón de cerrar del modal (en header)
export const ViewModalCloseButton = styled.button`
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

// Contenedor de detalles (área scrollable)
export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 10px 20px 10px;
  max-height: 75vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${theme.primaryColor} ${theme.backgroundColor};

  /* Custom scrollbar para WebKit */
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

// Sección de detalles con estilo neumórfico
export const DetailsSection = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 
    inset 3px 3px 7px ${theme.shadowDark},
    inset -3px -3px 7px ${theme.shadowLight};
`;

// Título de sección
export const SectionTitle = styled.h4`
  color: ${theme.primaryColor};
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 16px;
  border-bottom: 1px solid rgba(92, 107, 192, 0.2);
  padding-bottom: 8px;
`;

// Grid de detalles
export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 10px;

  &.wide-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

// Item de detalle
export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border-left: 3px solid ${theme.primaryColor};
`;

// Label del detalle
export const DetailLabel = styled.span`
  font-size: 12px;
  color: ${theme.darkColor};
  font-weight: 600;
  margin-bottom: 4px;
`;

// Valor del detalle
export const DetailValue = styled.span`
  font-size: 14px;
  color: ${theme.primaryColor};
`;

// Mensaje cuando no hay líder
export const NoLeaderMessage = styled.p`
  text-align: center;
  font-style: italic;
  color: #888;
  padding: 15px 0;
  margin: 0;
`;

// Footer del modal
export const ViewModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-right: 15px;
  padding-bottom: 15px;
`;

// Botón de cerrar en footer
export const CloseButton = styled.button`
  background-color: ${theme.primaryColor};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4a5ba8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.3);
  }

  i {
    font-size: 14px;
  }
`;

export default {
  ViewModalOverlay,
  ViewModalContent,
  ViewModalHeader,
  ViewModalCloseButton,
  DetailsContainer,
  DetailsSection,
  SectionTitle,
  DetailsGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  NoLeaderMessage,
  ViewModalFooter,
  CloseButton,
};
