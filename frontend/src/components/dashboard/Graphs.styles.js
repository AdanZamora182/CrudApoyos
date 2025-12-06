import styled from 'styled-components';
import { devices } from '../../styles/breakpoints';

export const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 24px;
  width: 100%;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;

  @media ${devices.lg} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${devices.maxMd} {
    gap: 16px;
    margin-top: 16px;
  }
`;

// ChartCard usando div nativo en lugar de MUI Card
export const ChartCard = styled.div`
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  }

  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  @media ${devices.maxMd} {
    padding: 20px;
    border-radius: 16px;
  }

  @media ${devices.maxSm} {
    padding: 16px;
    border-radius: 12px;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  @media ${devices.maxSm} {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

export const ChartIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${props => props.$color || '#3b82f6'};
  color: white;
  box-shadow: 0 6px 16px ${props => props.$color ? `${props.$color}50` : '#3b82f650'};
  flex-shrink: 0;

  @media ${devices.maxSm} {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }
`;

export const ChartTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  letter-spacing: -0.02em;

  @media ${devices.maxMd} {
    font-size: 1.1rem;
  }

  @media ${devices.maxSm} {
    font-size: 0.95rem;
  }
`;

export const ChartContent = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;

  /* Personalizar scrollbar */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #cbd5e1, #94a3b8);
    border-radius: 6px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, #94a3b8, #64748b);
  }
`;

export const FilterContainer = styled.div`
  margin-bottom: 24px;
  max-width: 320px;

  .form-select {
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    background-color: #fff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;

    &:hover {
      border-color: #94a3b8;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
    }

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
      outline: none;
    }
  }

  @media ${devices.maxSm} {
    max-width: 100%;
  }
`;

// Estilos para el spinner de carga
export const LoadingSpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

export const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Estado vacío
export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
  gap: 16px;

  .empty-icon {
    font-size: 48px;
    opacity: 0.3;
  }

  p {
    color: #94a3b8;
    font-size: 15px;
    font-weight: 500;
    margin: 0;
  }
`;
