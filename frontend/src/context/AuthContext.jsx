import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al montar el componente
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Verificar que el usuario tenga datos válidos
          if (parsedUser && parsedUser.id && parsedUser.usuario) {
            setUser(parsedUser);
          } else {
            // Si los datos no son válidos, limpiar localStorage
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    // Pequeña demora para evitar problemas de hidratación
    const timer = setTimeout(loadUser, 50);
    return () => clearTimeout(timer);
  }, []);

  const login = (userData) => {
    if (userData && userData.id && userData.usuario) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      console.error('Datos de usuario inválidos para login');
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      sessionStorage.removeItem('shownToastMessages');
      console.log('Logout ejecutado correctamente');
    } catch (error) {
      console.error('Error durante logout:', error);
      // Forzar limpieza en caso de error
      setUser(null);
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (storageError) {
        console.error('Error limpiando storage:', storageError);
      }
    }
  };

  const isAuthenticated = () => {
    const hasValidUser = user !== null && user.id && user.usuario;
    const hasStoredUser = (() => {
      try {
        return localStorage.getItem('user') !== null;
      } catch {
        return false;
      }
    })();
    
    // Si hay discrepancia, limpiar todo
    if (!hasValidUser && hasStoredUser) {
      try {
        localStorage.removeItem('user');
      } catch (error) {
        console.error('Error limpiando localStorage:', error);
      }
      return false;
    }
    
    return hasValidUser;
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
