import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../styles/theme';
import { cardShadow, fadeIn, responsiveWidth } from '../../styles/mixins';

const CardContainer = styled.div`
  ${responsiveWidth}
  ${cardShadow}
  ${fadeIn}
  padding: ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.background};
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.18);

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const Card = ({ children, maxWidth, className, ...props }) => {
  return (
    <ThemeProvider theme={theme}>
      <CardContainer maxWidth={maxWidth} className={className} {...props}>
        {children}
      </CardContainer>
    </ThemeProvider>
  );
};

export default Card;
