import styled from 'styled-components';
import { devices } from '../../styles/breakpoints';

export const TablesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 32px;
  width: 100%;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;

  @media ${devices.lg} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${devices.maxMd} {
    gap: 16px;
    margin-top: 24px;
  }
`;

// TableCard usando div nativo en lugar de MUI Card
export const TableCard = styled.div`
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
    background: linear-gradient(90deg, #10b981, #6366f1, #f59e0b);
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

export const TableHeader = styled.div`
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

export const TableIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${props => props.$color || '#6366f1'};
  color: white;
  box-shadow: 0 6px 16px ${props => props.$color ? `${props.$color}50` : '#6366f150'};
  flex-shrink: 0;

  @media ${devices.maxSm} {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }
`;

export const TableTitle = styled.h3`
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

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

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

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 600px;

  thead {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 2px solid #e2e8f0;

    th {
      padding: 16px 20px;
      text-align: left;
      font-weight: 700;
      color: #475569;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;

      @media ${devices.maxSm} {
        padding: 12px 16px;
        font-size: 11px;
      }
    }
  }

  tbody {
    tr {
      transition: background-color 0.15s ease;
      border-bottom: 1px solid #f1f5f9;

      &:nth-child(even) {
        background: #ffffff;
      }

      &:nth-child(odd) {
        background: #fafbfc;
      }

      &:hover {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      }

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: 16px 20px;
      color: #64748b;
      font-size: 14px;
      vertical-align: middle;

      @media ${devices.maxSm} {
        padding: 12px 16px;
        font-size: 13px;
      }
    }
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  gap: 16px;

  p {
    color: #94a3b8;
    font-size: 15px;
    font-weight: 500;
    margin: 0;
    text-align: center;
  }

  @media ${devices.maxSm} {
    padding: 40px 20px;

    p {
      font-size: 14px;
    }
  }
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  gap: 20px;

  p {
    color: #64748b;
    font-size: 15px;
    font-weight: 500;
    margin: 0;
  }

  @media ${devices.maxSm} {
    padding: 40px 20px;

    p {
      font-size: 14px;
    }
  }
`;

export const PositionBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-weight: 700;
  font-size: 14px;
  margin: 0 auto;
`;

export const ColoniaText = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
`;

export const PostalChip = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
  color: #6366f1;
  font-weight: 600;
  font-size: 13px;
`;

export const TotalText = styled.div`
  font-weight: 700;
  color: #10b981;
  font-size: 16px;
  text-align: center;
`;
