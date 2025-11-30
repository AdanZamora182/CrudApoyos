import React, { createContext, useState, useEffect, useCallback } from 'react';
import { refrescarToken, validarToken } from '../api/authApi';

export const AuthContext = createContext(null);

// Constantes para las claves del storage
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  REMEMBER_ME: 'rememberMe',
  TOKEN_EXPIRY: 'tokenExpiry',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // Función para obtener el storage apropiado (localStorage o sessionStorage)
  const getStorage = useCallback(() => {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
    return rememberMe ? localStorage : sessionStorage;
  }, []);

  // Función para guardar los tokens y datos del usuario
  const saveAuthData = useCallback((tokenData, userData, rememberMe = false) => {
    // Guardar preferencia de "recordar sesión"
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());
    
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenData.accessToken);
    if (tokenData.refreshToken) {
      storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken);
    }
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    
    // Guardar tiempo de expiración
    if (tokenData.expiresIn) {
      const expiryTime = Date.now() + (tokenData.expiresIn * 1000);
      storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
    }
  }, []);

  // Función para limpiar todos los datos de autenticación
  const clearAuthData = useCallback(() => {
    // Limpiar ambos storages
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    sessionStorage.removeItem('shownToastMessages');
  }, []);

  // Función para cargar datos de autenticación desde el storage
  const loadAuthData = useCallback(() => {
    const storage = getStorage();
    const storedToken = storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUser = storage.getItem(STORAGE_KEYS.USER);
    const tokenExpiry = storage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    
    return {
      accessToken: storedToken,
      user: storedUser ? JSON.parse(storedUser) : null,
      tokenExpiry: tokenExpiry ? parseInt(tokenExpiry) : null,
      refreshToken: storage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
    };
  }, [getStorage]);

  // Función para refrescar el token
  const refreshAccessToken = useCallback(async () => {
    try {
      const storage = getStorage();
      const refreshToken = storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        return false;
      }

      const response = await refrescarToken(refreshToken);
      
      if (response.accessToken) {
        storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
        
        if (response.expiresIn) {
          const expiryTime = Date.now() + (response.expiresIn * 1000);
          storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
        }
        
        setAccessToken(response.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return false;
    }
  }, [getStorage]);

  // Verificar y validar la sesión al cargar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
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
            // Otro error, mantener sesión si hay datos locales válidos
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

  // Configurar refresh automático del token
  useEffect(() => {
    if (!accessToken) return;

    const storage = getStorage();
    const tokenExpiry = storage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    
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
  }, [accessToken, getStorage, refreshAccessToken]);

  const login = useCallback((userData, tokenData, rememberMe = false) => {
    if (userData && userData.id && userData.usuario && tokenData?.accessToken) {
      saveAuthData(tokenData, userData, rememberMe);
      setUser(userData);
      setAccessToken(tokenData.accessToken);
    } else {
      console.error('Datos de login inválidos');
    }
  }, [saveAuthData]);

  const logout = useCallback(() => {
    try {
      clearAuthData();
      setUser(null);
      setAccessToken(null);
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
    const storage = getStorage();
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  }, [getStorage]);

  // Obtener el token actual para uso en peticiones
  const getAccessToken = useCallback(() => {
    if (accessToken) return accessToken;
    const storage = getStorage();
    return storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }, [accessToken, getStorage]);

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
