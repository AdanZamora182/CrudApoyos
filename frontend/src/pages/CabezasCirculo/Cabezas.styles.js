import styled from 'styled-components';
import Card from '../../components/ui/Card';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xl || '32px'};
`;

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing?.md || '16px'};
`;

export const HomeButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.sm || '12px'};
  padding: ${({ theme }) => `${theme.spacing?.sm || '12px'} ${theme.spacing?.lg || '24px'}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius?.md || '12px'};
  background: ${({ theme }) => theme.colors?.white || '#ffffff'};
  color: ${({ theme }) => theme.colors?.dark || '#1f2937'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.medium || 500};
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions?.standard || 'all 0.2s ease-in-out'};

  &:hover {
    color: ${({ theme }) => theme.colors?.primary || '#5c6bc0'};
    transform: translateY(-2px);
  }
`;

export const TabsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.sm || '12px'};
`;

export const TabButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.sm || '12px'};
  padding: ${({ theme }) => `${theme.spacing?.sm || '12px'} ${theme.spacing?.lg || '24px'}`};
  border-radius: ${({ theme }) => theme.borderRadius?.md || '12px'};
  border: 1px solid transparent;
  background: ${({ $active, theme }) =>
    $active ? theme.colors?.primary || '#5c6bc0' : theme.colors?.white || '#ffffff'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors?.white || '#ffffff' : theme.colors?.dark || '#1f2937'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.medium || 500};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions?.standard || 'all 0.2s ease-in-out'};
  box-shadow: ${({ $active, theme }) =>
    $active ? `0 12px 26px ${(theme.colors?.primary || '#5c6bc0')}33` : '0 8px 20px rgba(15, 23, 42, 0.08)'};

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors?.primaryLight || '#e4eafe'};
  }

  span {
    white-space: nowrap;
  }
`;

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xl || '32px'};
`;

export const FormCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing?.xl || '32px'};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.lg || '24px'};

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || '768px'}) {
    padding: ${({ theme }) => theme.spacing?.lg || '24px'};
  }
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.md || '16px'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || '16px'};
  padding: ${({ theme }) => theme.spacing?.lg || '24px'};
  background: ${({ theme }) => theme.colors?.backgroundLight || '#f9fafb'};

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || '768px'}) {
    padding: ${({ theme }) => theme.spacing?.md || '16px'};
  }
`;

export const SectionTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors?.primary || '#5c6bc0'};
  font-size: ${({ theme }) => theme.typography?.fontSize?.lg || '20px'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold || 600};
`;

export const FieldsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing?.md || '16px'};
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

export const DropdownWrapper = styled.div`
  position: relative;
`;

export const SuggestionsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing?.xs || '8px'});
  left: 0;
  right: 0;
  max-height: 240px;
  overflow-y: auto;
  border-radius: ${({ theme }) => theme.borderRadius?.md || '12px'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  background: ${({ theme }) => theme.colors?.white || '#ffffff'};
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.12);
  z-index: 10;

  li {
    padding: ${({ theme }) => `${theme.spacing?.sm || '12px'} ${theme.spacing?.md || '16px'}`};
    cursor: pointer;
    transition: background-color ${({ theme }) => theme.transitions?.fast || '0.15s ease-in-out'};

    &:hover {
      background-color: ${({ theme }) => theme.colors?.primaryLight || '#e7ecff'};
      color: ${({ theme }) => theme.colors?.primary || '#5c6bc0'};
    }
  }
`;

export const TableCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing?.xl || '32px'};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.lg || '24px'};

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || '768px'}) {
    padding: ${({ theme }) => theme.spacing?.lg || '24px'};
  }
`;

export const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.md || '16px'};
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing?.xl || '32px'};
  text-align: center;
  color: ${({ theme }) => theme.colors?.textMuted || '#6b7280'};
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.lg || '24px'};
`;

export const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.md || '16px'};
`;

export const ModalGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing?.md || '16px'};
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;
