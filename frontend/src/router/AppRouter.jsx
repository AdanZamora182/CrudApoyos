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
import { useAuth } from '../hooks/useAuth';

/**
 * Componente principal de enrutamiento
 * Define todas las rutas de la aplicación
 * Incluye rutas públicas (login, register) y protegidas (menu y sus hijos)
 */
const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rutas públicas de autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas protegidas dentro del layout del menú */}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Menu />
          </PrivateRoute>
        } 
      >
        {/* Ruta de inicio (página principal del menú) */}
        <Route path="menu" element={<></>} />
        
        {/* Rutas de las diferentes secciones */}
        <Route path="cabezas-circulo" element={<CabezasCirculoPage />} />
        <Route path="integrantes-circulo" element={<IntegranteCirculoPage />} />
        <Route path="apoyos" element={<ApoyoPage />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      
      {/* Redirigir rutas desconocidas y la raíz */}
      <Route 
        path="*" 
        element={
          isAuthenticated() ? <Navigate to="/menu" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

export default AppRouter;
