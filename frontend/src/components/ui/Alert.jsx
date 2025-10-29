import React from 'react';
import styled from 'styled-components';

const AlertContainer = styled.div`
  padding: ${props => props.theme.spacing.xs}; /* Reducido de sm */
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: ${props => props.theme.spacing.sm}; /* Reducido de md */
  font-size: ${props => props.theme.typography.fontSize.xs};
  display: flex;
  align-items: center;
  background-color: ${props => props.$variant === 'success' 
    ? props.theme.colors.successLight 
    : props.theme.colors.errorLight};
  color: ${props => props.$variant === 'success' 
    ? props.theme.colors.success 
    : props.theme.colors.error};
  border-left: 3px solid ${props => props.$variant === 'success' /* Reducido de 4px */
    ? props.theme.colors.success 
    : props.theme.colors.error};
  
  &::before {
    content: "${props => props.$variant === 'success' ? '✔️' : '⚠️'}";
    margin-right: ${props => props.theme.spacing.sm}; /* Reducido de md */
    font-size: ${props => props.theme.typography.fontSize.md}; /* Reducido de lg */
  }

  /* Responsive: Mejor tamaño en móviles */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.sm}; /* Aumentar padding en móviles */
    font-size: ${props => props.theme.typography.fontSize.sm}; /* Texto más grande */
    
    &::before {
      margin-right: ${props => props.theme.spacing.md}; /* Más espacio para el emoji */
      font-size: ${props => props.theme.typography.fontSize.lg}; /* Emoji más grande */
    }
  }
`;

const Alert = ({ variant = 'error', children, className }) => {
  return (
    <AlertContainer $variant={variant} className={className}>
      {children}
    </AlertContainer>
  );
};

export default Alert;
