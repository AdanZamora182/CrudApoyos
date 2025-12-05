import styled from 'styled-components';

// Variables de tema - diseño minimalista
const theme = {
  primaryColor: '#5c6bc0',
  textColor: '#374151',
  textMuted: '#6b7280',
  borderColor: '#e5e7eb',
  hoverBg: '#f9fafb',
  stripeBg: '#f8fafc',
  white: '#ffffff',
};

// Contenedor principal del CRUD
export const CrudContainer = styled.div`
  padding-top: 10px;

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
  gap: 12px;
  margin-bottom: 15px;
  position: relative;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

// Estado vacío
export const EmptyState = styled.div`
  text-align: center;
  padding: 50px 20px;
  color: ${theme.textMuted};
  background-color: ${theme.white};
  border: 1px solid ${theme.borderColor};
  border-radius: 8px;
`;

export const EmptyIcon = styled.span`
  font-size: 48px;
  margin-bottom: 20px;
  color: ${theme.primaryColor};
  display: block;
`;

// Contenedor de la tabla con scroll - diseño minimalista
export const TableContainer = styled.div`
  border: 1px solid ${theme.borderColor};
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  overflow-x: auto;
  background-color: ${theme.white};
  position: relative;
`;

// Tabla principal - diseño minimalista
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background-color: ${theme.white};
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

  tbody tr {
    transition: background-color 0.15s ease;

    &:nth-child(even) {
      background-color: ${theme.stripeBg};
    }

    &:hover {
      background-color: ${theme.hoverBg};
    }
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid ${theme.borderColor};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    font-size: 0.85rem;
    color: ${theme.textColor};
    height: auto;

    &.fixed-column {
      position: sticky;
      right: 0;
      left: unset;
      background-color: ${theme.white};
      z-index: 5;
    }
  }

  /* Filas impares - columna fija */
  tbody tr:nth-child(odd) td.fixed-column {
    background-color: ${theme.white};
  }

  /* Filas pares - columna fija */
  tbody tr:nth-child(even) td.fixed-column {
    background-color: ${theme.stripeBg};
  }

  /* Hover en columna fija */
  tbody tr:hover td.fixed-column {
    background-color: ${theme.hoverBg};
  }
`;

// Columna de acciones
export const ActionColumn = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  background-color: rgba(92, 107, 192, 0.06);
  border-radius: 6px;
  border: 1px solid rgba(92, 107, 192, 0.12);
  padding: 4px 7px;
  margin: -4px 0;
`;

// Loader - diseño minimalista
export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  flex-direction: column;
  gap: 15px;
  background-color: ${theme.white};
  border: 1px solid ${theme.borderColor};
  border-radius: 8px;
`;

export const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.borderColor};
  border-top: 3px solid ${theme.primaryColor};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

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
