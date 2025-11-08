import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { flexCenter } from '../../styles/mixins';
// Import directo de breakpoints - FUENTE ÚNICA DE VERDAD
import { breakpoints } from '../../styles/breakpoints.jsx';

// Contenedor principal con diseño moderno de dos columnas
export const AuthContainer = styled.div`
  ${flexCenter}
  min-height: 100vh;
  width: 100%;
  background: ${props => props.theme.gradients.primary};
  padding: ${props => props.theme.spacing.sm};
`;

// Contenedor de dos columnas para logo y formulario
export const AuthCard = styled.div`
  display: flex;
  width: 100%;
  max-width: 950px;
  min-height: 480px;
  background-color: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.18);
  
  /* Usando breakpoint directo desde breakpoints.jsx */
  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    max-width: 380px;
  }
`;

// Panel izquierdo con logo y diseño atractivo
export const LogoPanel = styled.div`
  flex: 1;
  background: ${props => props.theme.gradients.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 280px;
    height: 280px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    top: -140px;
    left: -140px;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    bottom: -100px;
    right: -100px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-height: 150px;
    padding: ${props => props.theme.spacing.sm};
    
    &::before {
      width: 150px;
      height: 150px;
      top: -75px;
      left: -75px;
    }
    
    &::after {
      width: 120px;
      height: 120px;
      bottom: -60px;
      right: -60px;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-height: 120px;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.xs};
    
    &::before {
      width: 100px;
      height: 100px;
      top: -50px;
      left: -50px;
    }
    
    &::after {
      width: 80px;
      height: 80px;
      bottom: -40px;
      right: -40px;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.xs}) {
    min-height: 100px;
    padding: ${props => props.theme.spacing.xs};
    
    &::before {
      width: 60px;
      height: 60px;
      top: -30px;
      left: -30px;
    }
    
    &::after {
      width: 50px;
      height: 50px;
      bottom: -25px;
      right: -25px;
    }
  }
`;

// Logo grande centrado
export const Logo = styled.img`
  height: 120px;
  margin-bottom: ${props => props.theme.spacing.md};
  filter: drop-shadow(0 7px 14px rgba(0, 0, 0, 0.2));
  position: relative;
  z-index: 1;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 60px;
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    height: 45px;
    margin-bottom: ${props => props.theme.spacing.xs};
  }

  @media (max-width: ${props => props.theme.breakpoints.xs}) {
    height: 35px;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
`;

// Título del panel del logo
export const LogoTitle = styled.h1`
  color: white;
  font-size: 2.1rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.3rem;
    line-height: 1.1;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
    line-height: 1.1;
    margin-bottom: ${props => props.theme.spacing.xs};
  }

  @media (max-width: ${props => props.theme.breakpoints.xs}) {
    font-size: 0.9rem;
    line-height: 1;
  }
`;

// Subtítulo del panel del logo
export const LogoSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  text-align: center;
  margin-top: ${props => props.theme.spacing.sm};
  position: relative;
  z-index: 1;
  line-height: 1.3;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.75rem;
    margin-top: ${props => props.theme.spacing.xs};
    line-height: 1.2;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.7rem;
    margin-top: 2px;
    line-height: 1.1;
  }

  @media (max-width: ${props => props.theme.breakpoints.xs}) {
    font-size: 0.65rem;
    margin-top: 1px;
    line-height: 1;
  }
`;

// Panel derecho con formulario
export const FormPanel = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

// Cabecera del formulario
export const FormHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// Título del formulario
export const FormTitle = styled.h2`
  color: ${props => props.theme.colors.dark};
  font-size: 1.7rem;
  font-weight: 700;
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.3rem;
  }
`;

// Subtítulo del formulario
export const FormSubtitle = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 0.85rem;
  margin: 0;
`;

// Fila de formulario para campos en dos columnas
export const FormRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0;
  }
`;

// Grupo de formulario individual
export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  flex: 1;
  min-width: 0;
`;

// Etiqueta de campo de formulario
export const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.dark};
  font-size: ${props => props.theme.typography.fontSize.md};
`;

// Contenedor de input con elementos adicionales
export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
`;

// Input de formulario estilizado con diseño moderno
export const Input = styled.input`
  flex: 1;
  border-radius: 8px;
  padding: 12px ${props => props.$hasButton ? '40px' : '12px'} 12px 12px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  border: 2px solid #e8ecef;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  width: 100%;
  font-family: inherit;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    background-color: white;
    box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.1);
    outline: none;
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

// Botón para mostrar/ocultar contraseña
export const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: transparent;
  border: none;
  padding: 6px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(92, 107, 192, 0.1);
  }
  
  i {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.primary};
    transition: color 0.2s ease;
  }
  
  &:hover i {
    color: ${props => props.theme.colors.primaryDark};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 36px;
    height: 36px;
    right: 8px;
    padding: 8px;
    
    i {
      font-size: 1rem;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.xs}) {
    width: 40px;
    height: 40px;
    right: 6px;
    padding: 10px;
    
    i {
      font-size: 1.1rem;
    }
  }
`;

// Contenedor de checkbox "Recordar sesión"
export const RememberMe = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// Etiqueta de checkbox estilizada
export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.typography.fontSize.md};
  color: ${props => props.theme.colors.dark};
  cursor: pointer;
  
  input {
    width: 18px;
    height: 18px;
    margin-right: ${props => props.theme.spacing.sm};
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
`;

// Link para "¿Olvidaste tu contraseña?"
export const ForgotLink = styled.a`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;

// Pie de la tarjeta con enlaces
export const Footer = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize.md};
  color: ${props => props.theme.colors.textLight};
`;

// Link estilizado para navegación
export const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.secondary};
    text-decoration: underline;
  }
`;

// Divisor con texto
export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${props => props.theme.spacing.lg} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e8ecef;
  }
  
  span {
    padding: 0 ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.textLight};
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;