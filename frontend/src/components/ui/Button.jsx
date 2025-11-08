import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../../styles/theme';
import { useResponsive } from '../../hooks/useResponsive';
import Spinner from './Spinner';

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm}; /* Usar destructuring */
  padding: ${({ $isMobile, theme }) => $isMobile ? 
    `${theme.spacing.md} ${theme.spacing.lg}` : 
    `${theme.spacing.sm} ${theme.spacing.lg}`
  };
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ $isMobile, theme }) => $isMobile ? 
    theme.typography.fontSize.md : 
    theme.typography.fontSize.md
  };
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.standard};
  width: 100%;
  min-height: ${({ $isMobile }) => $isMobile ? '48px' : '44px'};
  
  ${({ $variant, theme }) => $variant === 'primary' && `
    background: ${theme.gradients.primaryButton};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${theme.gradients.primaryButtonHover};
      transform: translateY(-2px);
    }
  `}
  
  ${({ $variant, theme }) => $variant === 'danger' && `
    background: linear-gradient(135deg, #6a4c93, #9b59b6);
    color: white;
    border: 2px solid #8e44ad;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #553c7a, #8e44ad);
      border-color: #663399;
      transform: translateY(-2px);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Button = ({ 
  children, 
  loading = false, 
  icon, 
  variant = 'primary',
  className,
  ...props 
}) => {
  // useResponsive ahora usa breakpoints.jsx (mobile = 576px)
  const { isMobile } = useResponsive();

  return (
    <ThemeProvider theme={theme}>
      <StyledButton 
        $variant={variant}
        $isMobile={isMobile}
        disabled={loading || props.disabled}
        className={className}
        {...props}
      >
        {loading ? (
          <Spinner size="small" />
        ) : (
          <>
            {icon && <i className={icon}></i>}
            {children}
          </>
        )}
      </StyledButton>
    </ThemeProvider>
  );
};

export default Button;
