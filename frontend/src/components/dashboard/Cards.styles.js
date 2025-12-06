import styled from 'styled-components';
import { devices } from '../../styles/breakpoints';

// Card usando div nativo en lugar de MUI Card
export const StyledCard = styled.div`
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
  cursor: pointer;
  border: none;
  background: ${props => props.$bgColor || 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  @media ${devices.maxMd} {
    padding: 18px;
  }

  @media ${devices.maxSm} {
    padding: 16px;
    border-radius: 12px;
    
    &:hover {
      transform: translateY(-3px);
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;

  @media ${devices.maxSm} {
    margin-bottom: 12px;
  }
`;

export const CardTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$textColor || '#64748b'};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  line-height: 1.4;
  max-width: 140px;

  @media ${devices.maxSm} {
    font-size: 11px;
    max-width: 120px;
  }
`;

export const CardIconWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bgColor || 'rgba(255, 255, 255, 0.2)'};
  box-shadow: ${props => props.$shadowColor ? `0 4px 12px ${props.$shadowColor}` : 'none'};
  flex-shrink: 0;

  svg {
    color: ${props => props.$iconColor || '#ffffff'};
    font-size: 26px;
  }

  @media ${devices.maxMd} {
    width: 48px;
    height: 48px;
    border-radius: 12px;

    svg {
      font-size: 24px;
    }
  }

  @media ${devices.maxSm} {
    width: 44px;
    height: 44px;
    border-radius: 10px;

    svg {
      font-size: 22px;
    }
  }
`;

export const CardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.$textColor || '#1e293b'};
  margin-bottom: 6px;
  line-height: 1;
  letter-spacing: -0.5px;

  @media ${devices.maxMd} {
    font-size: 28px;
  }

  @media ${devices.maxSm} {
    font-size: 26px;
    margin-bottom: 4px;
  }
`;

export const CardSubtext = styled.p`
  font-size: 12px;
  color: ${props => props.$textColor || '#94a3b8'};
  margin: 0;
  font-weight: 500;
  line-height: 1.4;

  @media ${devices.maxSm} {
    font-size: 11px;
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;

  @media ${devices.maxSm} {
    min-height: 80px;
  }
`;

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 13px;
  margin: 0;
  font-weight: 500;

  @media ${devices.maxSm} {
    font-size: 12px;
  }
`;
