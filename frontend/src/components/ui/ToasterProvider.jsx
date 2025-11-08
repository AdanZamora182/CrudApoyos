import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiCheckCircle, FiAlertTriangle, FiX } from 'react-icons/fi';
import { breakpoints } from '../../styles/breakpoints.jsx';

// Contexto para el toaster
const ToasterContext = createContext();

// Animaciones
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

// Contenedor principal del toaster
const ToasterContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  pointer-events: none;

  @media (max-width: ${breakpoints.sm}) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`;

// Toast individual
const Toast = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  animation: ${props => props.$isClosing ? slideOut : slideIn} 0.3s ease; /* Usar $isClosing */
  background-color: ${props => props.$variant === 'success'  /* Usar $variant */
    ? '#d4edda' 
    : '#f8d7da'};
  color: ${props => props.$variant === 'success' 
    ? '#155724' 
    : '#721c24'};
  border-left: 4px solid ${props => props.$variant === 'success' 
    ? '#28a745' 
    : '#dc3545'};
  
  @media (max-width: ${breakpoints.sm}) {
    padding: 10px 12px;
    font-size: 14px;
  }
`;

// Icono del toast
const ToastIcon = styled.span`
  margin-right: 12px;
  font-size: 18px;
  flex-shrink: 0;
  display: flex;
  align-items: center;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 16px;
    margin-right: 8px;
  }
`;

// Mensaje del toast
const ToastMessage = styled.span`
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
`;

// Botón de cerrar
const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  margin-left: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 16px;
    padding: 2px;
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
      'Por favor completa el reCAPTCHA'
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

  // Función para remover un toast
  const removeToast = useCallback((id) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isClosing: true } : toast
      )
    );

    // Remover completamente después de la animación
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
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
          >
            <ToastIcon>
              {toast.variant === 'success' ? 
                <FiCheckCircle /> : 
                <FiAlertTriangle />
              }
            </ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
            <CloseButton onClick={() => removeToast(toast.id)}>
              <FiX />
            </CloseButton>
          </Toast>
        ))}
      </ToasterContainer>
    </ToasterContext.Provider>
  );
};
