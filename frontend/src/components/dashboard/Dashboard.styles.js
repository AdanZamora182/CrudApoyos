import styled from 'styled-components';
import { devices } from '../../styles/breakpoints';

export const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;

  @media ${devices.maxMd} {
    padding: 16px;
  }

  @media ${devices.maxSm} {
    padding: 12px;
  }
`;

export const DashboardHeader = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 8px 0;
  }

  p {
    color: #666;
    margin: 0;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
    }
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;

  @media ${devices.maxXl} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${devices.maxMd} {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media ${devices.maxSm} {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;
