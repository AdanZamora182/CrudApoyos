import { css } from 'styled-components';

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const cardShadow = css`
  box-shadow: 0 8px 32px ${props => props.theme.colors.shadow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px ${props => props.theme.colors.shadowDark};
  }
`;

export const inputFocus = css`
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.15);
    outline: none;
    background-color: ${props => props.theme.colors.backgroundDark};
  }
`;

export const fadeIn = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: fadeIn 0.5s ease;
`;

export const responsiveWidth = css`
  width: 100%;
  max-width: ${props => props.maxWidth || '350px'};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    max-width: 100%;
    padding: ${props => props.theme.spacing.md};
  }
`;
