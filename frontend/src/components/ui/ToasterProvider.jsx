import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { breakpoints, devices } from '../../styles/breakpoints';

// Contexto para el toaster
const ToasterContext = createContext();

// Animaciones
const apertura = keyframes`
  from {
    transform: translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const cierre = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(100% + 40px));
  }
`;

const autoCierreAnimation = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

// Contenedor principal usando clases de Bootstrap
const ToasterContainer = styled.div.attrs({
  className: 'toast-container position-fixed top-0 end-0 p-3'
})`
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 360px;
  pointer-events: none;

  @media ${devices.maxXs} {
    left: 10px;
    right: 10px;
    max-width: calc(100% - 20px);
    padding: 0.5rem !important;
  }

  @media ${devices.maxSm} {
    max-width: 320px;
  }
`;

// Toast wrapper con colores según variante - tamaño reducido
const ToastWrapper = styled.div`
  background: ${(props) => props.$bgColor};
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  overflow: hidden;
  animation: ${apertura} 200ms ease-out;
  position: relative;
  pointer-events: auto;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);

  &.cerrando {
    animation: ${cierre} 200ms ease-out forwards;
  }

  &::after {
    content: "";
    width: 100%;
    height: 3px;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    bottom: 0;
    animation: ${autoCierreAnimation} ${(props) => props.$duration || 5}s ease-out forwards;
  }
`;

// Contenido del toast - más compacto
const ToastContent = styled.div`
  display: grid;
  grid-template-columns: 24px auto;
  align-items: center;
  gap: 10px;
  flex: 1;
  padding: 0.65rem 0.75rem;

  @media ${devices.maxXs} {
    gap: 8px;
    padding: 0.5rem 0.65rem;
  }
`;

// Wrapper del icono - más pequeño
const IconWrapper = styled.div`
  color: rgba(0, 0, 0, 0.4);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }

  @media ${devices.maxXs} {
    font-size: 18px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

// Contenido de texto
const TextContent = styled.div`
  color: #fff;
`;

// Título del toast - más pequeño
const ToastTitle = styled.div`
  font-weight: 600;
  margin-bottom: 2px;
  font-size: 0.9rem;

  @media ${devices.maxXs} {
    font-size: 0.85rem;
    margin-bottom: 1px;
  }
`;

// Mensaje del toast - más pequeño
const ToastMessage = styled.div`
  line-height: 1.3;
  opacity: 0.95;
  font-size: 0.8rem;

  @media ${devices.maxXs} {
    font-size: 0.75rem;
  }
`;

// Botón de cerrar - más compacto
const CloseButton = styled.button`
  background: rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  transition: 0.3s ease all;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  @media ${devices.maxXs} {
    padding: 0 0.5rem;
  }
`;

// Icono de cerrar - más pequeño
const CloseIcon = styled.div`
  width: 16px;
  height: 16px;
  color: #fff;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Configuración de tipos de toast
const toastConfig = {
  success: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </svg>
    ),
    bgColor: "#3ab65c",
    title: "¡Éxito!",
  },
  warning: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </svg>
    ),
    bgColor: "#bc8c12",
    title: "Advertencia",
  },
  error: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
      </svg>
    ),
    bgColor: "#bf333b",
    title: "Error",
  },
  info: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
      </svg>
    ),
    bgColor: "#1898c0",
    title: "Información",
  },
};

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
        {toasts.map((toast) => {
          const config = toastConfig[toast.variant] || toastConfig.error;
          const durationInSeconds = 8; // Duración en segundos para la barra de progreso
          
          return (
            <ToastWrapper
              key={toast.id}
              $bgColor={config.bgColor}
              $duration={durationInSeconds}
              className={toast.isClosing ? 'cerrando' : ''}
              role="alert"
              aria-live="polite"
              aria-atomic="true"
            >
              <ToastContent>
                <IconWrapper>{config.icon}</IconWrapper>
                <TextContent>
                  <ToastTitle>{config.title}</ToastTitle>
                  <ToastMessage>{toast.message}</ToastMessage>
                </TextContent>
              </ToastContent>
              <CloseButton 
                onClick={() => removeToast(toast.id)}
                aria-label="Cerrar notificación"
              >
                <CloseIcon>×</CloseIcon>
              </CloseButton>
            </ToastWrapper>
          );
        })}
      </ToasterContainer>
    </ToasterContext.Provider>
  );
};
