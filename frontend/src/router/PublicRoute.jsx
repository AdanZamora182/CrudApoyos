import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Componente que protege rutas públicas (login, register)
 * Si el usuario ya está autenticado, redirige al menú
 * Evita que usuarios logueados accedan a páginas de autenticación
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  // Si ya está autenticado, redirigir al menú
  if (isAuthenticated()) {
    return <Navigate to="/menu" replace />;
  }

  return children;
};

export default PublicRoute;
