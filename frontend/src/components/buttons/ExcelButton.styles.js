import styled from 'styled-components';

const theme = {
  successColor: '#28a745',
  successHover: '#218838',
  successActive: '#1e7e34',
  shadowSm: '0 1px 3px rgba(0, 0, 0, 0.08)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

export const ExcelButton = styled.button`
  background-color: ${theme.successColor};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${theme.shadowSm};

  &:hover:not(:disabled) {
    background-color: ${theme.successHover};
    box-shadow: ${theme.shadowMd};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    background-color: ${theme.successActive};
    transform: translateY(0);
    box-shadow: ${theme.shadowSm};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }

  i {
    font-size: 16px;
  }

  @media (max-width: 576px) {
    span {
      display: none;
    }
  }

  @media (min-width: 577px) {
    span {
      display: inline;
    }
  }
`;

export default ExcelButton;
