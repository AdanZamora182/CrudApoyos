import React, { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  // Verificar autenticación y redirigir si es necesario
  useEffect(() => {
    if (!loading && !hasRedirected.current) {
      if (!isAuthenticated() || !user) {
        hasRedirected.current = true;
        // Limpiar sesión y redirigir
        logout();
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, loading, user, logout, navigate]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        <div>Verificando sesión...</div>
      </div>
    );
  }

  // Si no está autenticado, redirigir inmediatamente
  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
