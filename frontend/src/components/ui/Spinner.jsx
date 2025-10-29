import React from 'react';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { theme } from '../../styles/theme';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.span`
  display: inline-block;
  width: ${props => props.size === 'small' ? '16px' : '24px'};
  height: ${props => props.size === 'small' ? '16px' : '24px'};
  border: ${props => props.size === 'small' ? '2px' : '3px'} solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Spinner = ({ size = 'medium', className }) => {
  return (
    <ThemeProvider theme={theme}>
      <SpinnerContainer size={size} className={className} />
    </ThemeProvider>
  );
};

export default Spinner;
