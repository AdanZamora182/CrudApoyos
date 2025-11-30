import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Menu from '../pages/Menu/Menu';
import CabezasCirculoPage from '../pages/CabezasCirculo/CabezasCirculoPage';
import IntegranteCirculoPage from '../pages/IntegrantesCirculo/IntegranteCirculoPage';
import ApoyoPage from '../pages/Apoyos/ApoyoPage';
import Dashboard from '../pages/Dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { useAuth } from '../hooks/useAuth';

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

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
        <div>Cargando aplicación...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas públicas protegidas */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Rutas protegidas dentro del layout del menú */}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Menu />
          </PrivateRoute>
        } 
      >
        {/* Redirigir la ruta raíz "/" a "/menu" */}
        <Route index element={<Navigate to="/menu" replace />} />
        <Route path="menu" element={<></>} />
        <Route path="cabezas-circulo" element={<CabezasCirculoPage />} />
        <Route path="integrantes-circulo" element={<IntegranteCirculoPage />} />
        <Route path="apoyos" element={<ApoyoPage />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      
      {/* Redirigir rutas desconocidas y la raíz */}
      <Route 
        path="*" 
        element={
          <Navigate to={isAuthenticated() ? "/menu" : "/login"} replace />
        } 
      />
    </Routes>
  );
};

export default AppRouter;
