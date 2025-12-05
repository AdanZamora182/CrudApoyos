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

// Contenedor principal del CRUD con estilo neumórfico
export const CrudContainer = styled.div`
  padding: 20px;
  border-radius: 8px;
  background-color: ${theme.backgroundColor};
  box-shadow: 
    inset 5px 5px 10px ${theme.shadowDark},
    inset -5px -5px 10px ${theme.shadowLight};

  &.full-screen {
    min-height: auto;
    height: 100%;
  }
`;

// Controles superiores (búsqueda y acciones)
export const CrudControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

// Estado vacío
export const EmptyState = styled.div`
  text-align: center;
  padding: 50px 20px;
  color: #888;
`;

export const EmptyIcon = styled.span`
  font-size: 48px;
  margin-bottom: 20px;
  color: ${theme.primaryColor};
  display: block;
`;

// Contenedor de la tabla con scroll
export const TableContainer = styled.div`
  border-radius: 6px;
  overflow: hidden;
  overflow-x: auto;
  box-shadow: 
    5px 5px 10px ${theme.shadowDark},
    -5px -5px 10px ${theme.shadowLight};
  position: relative;
`;

// Tabla principal
export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: ${theme.backgroundColor};
  table-layout: auto;

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th {
    padding: 8px 12px;
    text-align: left;
    background: ${theme.primaryColor};
    color: white;
    font-weight: 500;
    white-space: nowrap;
    min-width: 100px;
    font-size: 0.9rem;

    &.fixed-column {
      position: sticky;
      right: 0;
      left: unset;
      z-index: 20;
      width: 90px;
      min-width: 90px;
    }
  }

  tr {
    transition: all 0.2s ease;

    &:nth-child(even) {
      background-color: rgba(92, 107, 192, 0.03);
    }

    &:hover {
      background-color: rgba(92, 107, 192, 0.07);
    }
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(209, 217, 230, 0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    font-size: 0.85rem;
    height: auto;

    &.fixed-column {
      position: sticky;
      right: 0;
      left: unset;
      background-color: ${theme.backgroundColor};
      z-index: 5;
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    }
  }
`;

// Columna de acciones
export const ActionColumn = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

// Loader
export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  flex-direction: column;
  gap: 15px;
`;

export const Loader = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${theme.shadowDark};
  border-top: 4px solid ${theme.primaryColor};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Estilos para headers ordenables
export const SortableHeader = styled.th`
  cursor: pointer;
  user-select: none;
`;

export default {
  CrudContainer,
  CrudControls,
  EmptyState,
  EmptyIcon,
  TableContainer,
  Table,
  ActionColumn,
  LoaderContainer,
  Loader,
  SortableHeader,
};
