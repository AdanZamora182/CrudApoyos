import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { refrescarToken, validarToken } from '../api/authApi';

export const AuthContext = createContext(null);

// Constantes para las claves del storage
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  REMEMBER_ME: 'rememberMe',
  TOKEN_EXPIRY: 'tokenExpiry',
  LOGOUT_EVENT: 'logout_event', // Clave especial para sincronizar logout entre pestañas
  SESSION_ID: 'session_id', // ID único de sesión para sincronización
};

// Canal de broadcast para sincronización entre pestañas
const BROADCAST_CHANNEL_NAME = 'auth_channel';

// Generar ID único de sesión
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const broadcastChannelRef = useRef(null);
  const isInitializedRef = useRef(false);

  // IMPORTANTE: Siempre usar localStorage para permitir sincronización entre pestañas
  // La diferencia con rememberMe será solo en la duración del token en el backend
  const getStorage = useCallback(() => {
    return localStorage;
  }, []);

  // Función para guardar los tokens y datos del usuario
  const saveAuthData = useCallback((tokenData, userData, rememberMe = false) => {
    // Guardar preferencia de "recordar sesión" (afecta duración del token)
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());
    
    // Siempre guardar en localStorage para sincronización entre pestañas
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenData.accessToken);
    if (tokenData.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken);
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    
    // Guardar tiempo de expiración
    if (tokenData.expiresIn) {
      const expiryTime = Date.now() + (tokenData.expiresIn * 1000);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
    }
    
    // Guardar ID de sesión
    if (!localStorage.getItem(STORAGE_KEYS.SESSION_ID)) {
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, generateSessionId());
    }
  }, []);

  // Función para limpiar todos los datos de autenticación
  const clearAuthData = useCallback(() => {
    // Limpiar localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.LOGOUT_EVENT) { // No borrar el evento de logout inmediatamente
        localStorage.removeItem(key);
      }
    });
    // Limpiar también sessionStorage por si acaso
    sessionStorage.removeItem('shownToastMessages');
  }, []);

  // Función para cargar datos de autenticación desde el storage
  const loadAuthData = useCallback(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    
    return {
      accessToken: storedToken,
      user: storedUser ? JSON.parse(storedUser) : null,
      tokenExpiry: tokenExpiry ? parseInt(tokenExpiry) : null,
      refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
    };
  }, []);

  // Función para refrescar el token
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        return false;
      }

      const response = await refrescarToken(refreshToken);
      
      if (response.accessToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
        
        if (response.expiresIn) {
          const expiryTime = Date.now() + (response.expiresIn * 1000);
          localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
        }
        
        setAccessToken(response.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return false;
    }
  }, []);

  // Verificar y validar la sesión al cargar
  useEffect(() => {
    const initializeAuth = async () => {
      // Evitar inicialización múltiple
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;
      
      try {
        // Limpiar evento de logout anterior si existe
        localStorage.removeItem(STORAGE_KEYS.LOGOUT_EVENT);
        
        const authData = loadAuthData();
        
        if (!authData.accessToken || !authData.user) {
          setLoading(false);
          return;
        }

        // Verificar si el token ha expirado
        const now = Date.now();
        const tokenExpiry = authData.tokenExpiry;
        
        if (tokenExpiry && now >= tokenExpiry) {
          // Token expirado, intentar refrescar
          const refreshed = await refreshAccessToken();
          
          if (!refreshed) {
            clearAuthData();
            setLoading(false);
            return;
          }
        }

        // Validar token con el servidor
        try {
          const validation = await validarToken();
          
          if (validation.valid) {
            setUser(authData.user);
            setAccessToken(authData.accessToken);
          } else {
            // Token inválido, intentar refrescar
            const refreshed = await refreshAccessToken();
            
            if (refreshed) {
              setUser(authData.user);
              setAccessToken(loadAuthData().accessToken);
            } else {
              clearAuthData();
            }
          }
        } catch (error) {
          // Error de validación (posiblemente 401)
          if (error.response?.status === 401) {
            const refreshed = await refreshAccessToken();
            
            if (refreshed) {
              setUser(authData.user);
              setAccessToken(loadAuthData().accessToken);
            } else {
              clearAuthData();
            }
          } else {
            // Otro error (red, servidor caído), mantener sesión si hay datos locales válidos
            setUser(authData.user);
            setAccessToken(authData.accessToken);
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [loadAuthData, refreshAccessToken, clearAuthData]);

  // Sincronización entre pestañas usando BroadcastChannel y storage event
  useEffect(() => {
    // Intentar usar BroadcastChannel
    try {
      broadcastChannelRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      
      broadcastChannelRef.current.onmessage = (event) => {
        const { type, data } = event.data;
        
        if (type === 'LOGOUT') {
          // Otra pestaña cerró sesión
          setUser(null);
          setAccessToken(null);
          // No llamar clearAuthData aquí porque ya lo hizo la pestaña que cerró sesión
          window.location.href = '/login';
        } else if (type === 'LOGIN' && data) {
          // Otra pestaña inició sesión - sincronizar estado
          if (data.user && data.accessToken) {
            setUser(data.user);
            setAccessToken(data.accessToken);
            // Redirigir si estamos en login
            if (window.location.pathname === '/login' || window.location.pathname === '/register') {
              window.location.href = '/menu';
            }
          }
        }
      };
    } catch (error) {
      console.log('BroadcastChannel no soportado, usando storage event');
    }

    // Escuchar cambios en localStorage (funciona entre pestañas diferentes)
    const handleStorageChange = (event) => {
      // Ignorar eventos sin key (clear())
      if (!event.key) return;
      
      // Detectar logout desde otra pestaña
      if (event.key === STORAGE_KEYS.LOGOUT_EVENT && event.newValue) {
        setUser(null);
        setAccessToken(null);
        window.location.href = '/login';
        return;
      }

      // Detectar nuevo login desde otra pestaña
      if (event.key === STORAGE_KEYS.ACCESS_TOKEN && event.newValue && !event.oldValue) {
        // Nuevo token añadido (login en otra pestaña)
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        if (userData) {
          try {
            setUser(JSON.parse(userData));
            setAccessToken(event.newValue);
            // Redirigir si estamos en login
            if (window.location.pathname === '/login' || window.location.pathname === '/register') {
              window.location.href = '/menu';
            }
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
        return;
      }

      // Detectar eliminación de token (logout en otra pestaña)
      if (event.key === STORAGE_KEYS.ACCESS_TOKEN && event.oldValue && !event.newValue) {
        setUser(null);
        setAccessToken(null);
        window.location.href = '/login';
        return;
      }

      // Detectar actualización de token (refresh en otra pestaña)
      if (event.key === STORAGE_KEYS.ACCESS_TOKEN && event.newValue && event.oldValue) {
        setAccessToken(event.newValue);
        return;
      }

      // Detectar cambios en los datos del usuario
      if (event.key === STORAGE_KEYS.USER) {
        if (!event.newValue) {
          // Usuario eliminado
          setUser(null);
          setAccessToken(null);
          window.location.href = '/login';
        } else if (event.newValue) {
          try {
            const newUser = JSON.parse(event.newValue);
            setUser(newUser);
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
        broadcastChannelRef.current = null;
      }
    };
  }, []);

  // Configurar refresh automático del token
  useEffect(() => {
    if (!accessToken) return;

    const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    
    if (!tokenExpiry) return;

    const expiryTime = parseInt(tokenExpiry);
    const now = Date.now();
    
    // Refrescar el token 5 minutos antes de que expire
    const refreshTime = expiryTime - now - (5 * 60 * 1000);
    
    if (refreshTime <= 0) return;

    const timer = setTimeout(async () => {
      await refreshAccessToken();
    }, refreshTime);

    return () => clearTimeout(timer);
  }, [accessToken, refreshAccessToken]);

  const login = useCallback((userData, tokenData, rememberMe = false) => {
    if (userData && userData.id && userData.usuario && tokenData?.accessToken) {
      saveAuthData(tokenData, userData, rememberMe);
      setUser(userData);
      setAccessToken(tokenData.accessToken);
      
      // Notificar a otras pestañas sobre el login usando BroadcastChannel
      try {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({ 
          type: 'LOGIN', 
          data: { user: userData, accessToken: tokenData.accessToken } 
        });
        channel.close();
      } catch (e) {
        // BroadcastChannel no soportado, storage event lo manejará
      }
    } else {
      console.error('Datos de login inválidos');
    }
  }, [saveAuthData]);

  const logout = useCallback(() => {
    try {
      // Notificar a otras pestañas sobre el logout usando BroadcastChannel
      try {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({ type: 'LOGOUT' });
        channel.close();
      } catch (e) {
        // BroadcastChannel no soportado
      }
      
      // Disparar evento de storage para sincronizar con otras pestañas
      localStorage.setItem(STORAGE_KEYS.LOGOUT_EVENT, Date.now().toString());
      
      // Limpiar datos
      clearAuthData();
      setUser(null);
      setAccessToken(null);
      
      // Limpiar el evento de logout después de un breve delay
      setTimeout(() => {
        localStorage.removeItem(STORAGE_KEYS.LOGOUT_EVENT);
      }, 100);
      
      console.log('Logout ejecutado correctamente');
    } catch (error) {
      console.error('Error durante logout:', error);
      setUser(null);
      setAccessToken(null);
    }
  }, [clearAuthData]);

  const isAuthenticated = useCallback(() => {
    const hasValidUser = user !== null && user.id && user.usuario;
    const hasToken = accessToken !== null;
    
    return hasValidUser && hasToken;
  }, [user, accessToken]);

  const updateUser = useCallback((userData) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  }, []);

  // Obtener el token actual para uso en peticiones
  const getAccessToken = useCallback(() => {
    if (accessToken) return accessToken;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }, [accessToken]);

  const value = {
    user,
    loading,
    accessToken,
    login,
    logout,
    isAuthenticated,
    updateUser,
    getAccessToken,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
