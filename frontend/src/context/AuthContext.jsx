import React, { createContext, useState, useEffect } from 'react';

/**
 * Contexto de autenticación para manejar el estado del usuario
 * Proporciona funciones para login, logout y verificación de autenticación
 */
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
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Función para iniciar sesión
   * Guarda el usuario en el estado y en localStorage
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Función para cerrar sesión
   * Limpia el usuario del estado y de localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  /**
   * Función para verificar si el usuario está autenticado
   */
  const isAuthenticated = () => {
    return user !== null;
  };

  /**
   * Función para actualizar los datos del usuario
   */
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
