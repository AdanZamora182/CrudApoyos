import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { breakpoints, devices } from '../../styles/breakpoints';

// Contexto para el toaster
const ToasterContext = createContext();

// Animaciones minimalistas
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Contenedor principal con breakpoints correctos
const ToasterContainer = styled.div.attrs({
  className: 'position-fixed top-0 end-0 p-3'
})`
  z-index: 9999;
  max-width: 420px;
  pointer-events: none;

  /* Extra Small - Móviles muy pequeños */
  @media ${devices.maxXs} {
    left: 0.5rem;
    right: 0.5rem;
    max-width: 100%;
    padding: 0.5rem !important;
    top: 0.5rem;
  }

  /* Small - Móviles */
  @media ${devices.maxSm} {
    left: 0.75rem;
    right: 0.75rem;
    max-width: 100%;
    padding: 0.75rem !important;
  }

  /* Tablet pequeña */
  @media ${devices.tablet} {
    max-width: 360px;
    padding: 1rem !important;
  }

  /* Desktop pequeño */
  @media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg}) {
    max-width: 380px;
  }

  /* Desktop grande */
  @media ${devices.desktop} {
    max-width: 420px;
  }
`;

// Toast con diseño responsivo mejorado y ajuste automático de ancho
const Toast = styled.div.attrs({
  className: 'd-flex align-items-center shadow-sm mb-2'
})`
  animation: ${props => props.$isClosing ? slideOut : slideIn} 0.3s ease forwards;
  pointer-events: auto;
  background: ${props => props.$variant === 'success' 
    ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
    : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'};
  border-radius: 0.5rem;
  padding: 0.875rem 1rem;
  border-left: 3px solid ${props => props.$variant === 'success' ? '#10b981' : '#ef4444'};
  transition: box-shadow 0.2s ease;
  position: relative;
  will-change: transform, opacity;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  min-height: 52px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
  }

  /* Extra Small - Móviles muy pequeños */
  @media ${devices.maxXs} {
    padding: 0.625rem 0.75rem;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem !important;
    min-height: 44px;
    border-left-width: 2px;
    width: 100%;
    max-width: 100%;
  }

  /* Small - Móviles */
  @media ${devices.maxSm} {
    padding: 0.75rem 0.875rem;
    border-radius: 0.4375rem;
    margin-bottom: 0.625rem !important;
    min-height: 48px;
    width: 100%;
    max-width: 100%;
  }

  /* Tablet */
  @media ${devices.tablet} {
    padding: 0.875rem 1rem;
    border-radius: 0.5rem;
    width: fit-content;
    max-width: 100%;
  }

  /* Desktop */
  @media ${devices.desktop} {
    padding: 0.875rem 1rem;
    width: fit-content;
    max-width: 100%;
  }
`;

// Icono con tamaños responsivos
const ToastIcon = styled.span.attrs({
  className: 'me-2'
})`
  font-size: 1.25rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: ${props => props.$variant === 'success' ? '#059669' : '#dc2626'};
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  margin-right: 0.75rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Extra Small */
  @media ${devices.maxXs} {
    font-size: 1rem;
    margin-right: 0.5rem;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  /* Small */
  @media ${devices.maxSm} {
    font-size: 1.125rem;
    margin-right: 0.625rem;

    svg {
      width: 1.125rem;
      height: 1.125rem;
    }
  }

  /* Tablet */
  @media ${devices.tablet} {
    font-size: 1.1875rem;
    margin-right: 0.6875rem;
  }

  /* Desktop */
  @media ${devices.desktop} {
    font-size: 1.25rem;
    margin-right: 0.75rem;
  }
`;

// Mensaje con tipografía responsiva y mejor manejo de espacios
const ToastMessage = styled.span.attrs({
  className: 'flex-grow-1'
})`
  font-weight: 500;
  line-height: 1.5;
  color: ${props => props.$variant === 'success' ? '#065f46' : '#991b1b'};
  font-size: 0.9375rem;
  word-break: break-word;
  padding-right: 0.5rem;
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;

  /* Extra Small */
  @media ${devices.maxXs} {
    font-size: 0.8125rem;
    line-height: 1.35;
    padding-right: 0.375rem;
    font-weight: 480;
  }

  /* Small */
  @media ${devices.maxSm} {
    font-size: 0.8125rem;
    line-height: 1.4;
    padding-right: 0.4375rem;
  }

  /* Tablet */
  @media ${devices.tablet} {
    font-size: 0.875rem;
    line-height: 1.45;
    padding-right: 0.5rem;
  }

  /* Desktop */
  @media ${devices.desktop} {
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  /* Desktop grande */
  @media ${devices.xl} {
    font-size: 1rem;
  }
`;

// Botón de cerrar responsivo
const CloseButton = styled.button.attrs({
  type: 'button',
  className: 'btn-close-custom'
})`
  background: none;
  border: none;
  padding: 0.25rem;
  width: 1.375rem;
  height: 1.375rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$variant === 'success' ? '#059669' : '#dc2626'};
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0.25rem;
  opacity: 0.7;
  margin-left: 0.5rem;

  &:hover {
    opacity: 1;
    background-color: ${props => props.$variant === 'success' 
      ? 'rgba(5, 150, 105, 0.1)' 
      : 'rgba(220, 38, 38, 0.1)'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.$variant === 'success'
      ? 'rgba(5, 150, 105, 0.2)'
      : 'rgba(220, 38, 38, 0.2)'};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 1rem;
    height: 1rem;
  }

  /* Extra Small */
  @media ${devices.maxXs} {
    width: 1.125rem;
    height: 1.125rem;
    padding: 0.125rem;
    margin-left: 0.375rem;
    
    svg {
      width: 0.8125rem;
      height: 0.8125rem;
    }
  }

  /* Small */
  @media ${devices.maxSm} {
    width: 1.25rem;
    height: 1.25rem;
    padding: 0.1875rem;
    margin-left: 0.4375rem;
    
    svg {
      width: 0.875rem;
      height: 0.875rem;
    }
  }

  /* Tablet */
  @media ${devices.tablet} {
    width: 1.3125rem;
    height: 1.3125rem;
    margin-left: 0.5rem;
    
    svg {
      width: 0.9375rem;
      height: 0.9375rem;
    }
  }

  /* Desktop */
  @media ${devices.desktop} {
    width: 1.375rem;
    height: 1.375rem;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`;

// Hook para usar el toaster
export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster debe ser usado dentro de un ToasterProvider');
  }
  return context;
};

// Proveedor del toaster
export const ToasterProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const location = useLocation();
  const isInitialMount = useRef(true);
  const currentPath = useRef(location.pathname);

  // Función para generar ID único para mensajes
  const generateMessageId = useCallback((message, variant) => {
    return `${variant}-${message.slice(0, 50).replace(/\s/g, '')}-${location.pathname}`;
  }, [location.pathname]);

  // Función para verificar si un mensaje ya se mostró en esta sesión
  const wasMessageShown = useCallback((messageId) => {
    const shownMessages = JSON.parse(sessionStorage.getItem('shownToastMessages') || '[]');
    return shownMessages.includes(messageId);
  }, []);

  // Función para marcar un mensaje como mostrado
  const markMessageAsShown = useCallback((messageId) => {
    const shownMessages = JSON.parse(sessionStorage.getItem('shownToastMessages') || '[]');
    if (!shownMessages.includes(messageId)) {
      shownMessages.push(messageId);
      sessionStorage.setItem('shownToastMessages', JSON.stringify(shownMessages));
    }
  }, []);

  // Limpiar toasts cuando cambie la ruta (solo si es una navegación real)
  useEffect(() => {
    if (currentPath.current !== location.pathname) {
      // Solo limpiar si cambió la ruta realmente
      setToasts([]);
      currentPath.current = location.pathname;
    }
  }, [location.pathname]);

  // Limpiar mensajes mostrados cuando se cierre la pestaña/navegador
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('shownToastMessages');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Función para mostrar un toast con control de duplicados
  const showToast = useCallback((message, variant = 'error', duration = 8000) => {
    const messageId = generateMessageId(message, variant);
    
    // Lista de mensajes críticos que siempre deben mostrarse
    const criticalMessages = [
      'Credenciales incorrectas',
      'Error al iniciar sesión',
      'Las contraseñas no coinciden',
      'Por favor completa el reCAPTCHA',
      'ya existe',
      'ya está registrado',
      'usuario ya existe',
      'correo ya existe',
      'Error al registrar',
      'nombre de usuario',
      'duplicado'
    ];
    
    // Verificar si es un mensaje crítico que debe mostrarse siempre
    const isCriticalMessage = criticalMessages.some(critical => 
      message.toLowerCase().includes(critical.toLowerCase())
    );
    
    // Solo verificar duplicados para mensajes no críticos
    if (!isCriticalMessage && wasMessageShown(messageId)) {
      return; // No mostrar el mensaje si ya se mostró y no es crítico
    }

    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      variant,
      isClosing: false,
      messageId, // Guardar el ID único del mensaje
    };

    setToasts(prev => [...prev, newToast]);
    
    // Solo marcar como mostrado si no es un mensaje crítico
    if (!isCriticalMessage) {
      markMessageAsShown(messageId);
    }

    // Auto-cerrar después del tiempo especificado
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [generateMessageId, wasMessageShown, markMessageAsShown]);

  // Función para mostrar toast de éxito
  const showSuccess = useCallback((message, duration = 8000) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  // Función para mostrar toast de error
  const showError = useCallback((message, duration = 8000) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  // Función para remover un toast con animación suave
  const removeToast = useCallback((id) => {
    // Primero activar la animación de cierre
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isClosing: true } : toast
      )
    );

    // Esperar a que termine la animación antes de remover del DOM
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 350); // Ligeramente más que la duración de la animación
  }, []);

  // Función para limpiar todos los toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Función para limpiar toasts con una pequeña demora
  const clearToastsDelayed = useCallback(() => {
    setTimeout(() => {
      setToasts([]);
    }, 100);
  }, []);

  // Función para limpiar el historial de mensajes mostrados
  const clearMessageHistory = useCallback(() => {
    sessionStorage.removeItem('shownToastMessages');
  }, []);

  // Función para mostrar un mensaje único (no se repetirá hasta que se limpie el historial)
  const showUniqueToast = useCallback((message, variant = 'error', duration = 8000) => {
    // Esta función siempre muestra el mensaje, útil para casos específicos
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      variant,
      isClosing: false,
    };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const value = {
    showToast,
    showSuccess,
    showError,
    showUniqueToast,
    clearToasts,
    clearToastsDelayed,
    clearMessageHistory,
  };

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <ToasterContainer>
        {toasts.map((toast) => (
          <Toast 
            key={toast.id}
            $variant={toast.variant}
            $isClosing={toast.isClosing}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            <ToastIcon $variant={toast.variant}>
              {toast.variant === 'success' ? 
                <FiCheckCircle /> : 
                <FiAlertCircle />
              }
            </ToastIcon>
            <ToastMessage $variant={toast.variant}>
              {toast.message}
            </ToastMessage>
            <CloseButton 
              onClick={() => removeToast(toast.id)}
              $variant={toast.variant}
              aria-label="Cerrar notificación"
            >
              <FiX />
            </CloseButton>
          </Toast>
        ))}
      </ToasterContainer>
    </ToasterContext.Provider>
  );
};
