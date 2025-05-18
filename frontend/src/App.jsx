import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Menu from './components/Menu/Menu';
import CabezaCirculoForm from './components/CabezaCirculoForm/CabezaCirculoForm';
import IntegranteCirculoForm from './components/IntegrantesCirculoForm/IntegranteCirculoForm'; 
import ApoyoForm from './components/ApoyoForm/ApoyoForm'; 


function App() {
  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user !== null; // Asegúrate de que esta condición sea correcta
  };

  // Componente para rutas protegidas
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Ruta para el menú principal (protegida) */}
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          } 
        />

        {/* Ruta para el formulario de Cabezas de Círculo */}
        <Route 
          path="/cabezas-circulo" 
          element={
            <ProtectedRoute>
              <CabezaCirculoForm />
            </ProtectedRoute>
          } 
        />

        {/* Ruta para el formulario de Integrantes de Círculo */}
        <Route 
          path="/integrantes-circulo" 
          element={
            <ProtectedRoute>
              <IntegranteCirculoForm />
            </ProtectedRoute>
          } 
        />

        {/* Ruta para el formulario de Apoyos */}
        <Route 
          path="/apoyos" 
          element={
            <ProtectedRoute>
              <ApoyoForm />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirigir rutas desconocidas y la raíz al login o al menú dependiendo de la autenticación */}
        <Route 
          path="*" 
          element={
            isAuthenticated() ? <Navigate to="/menu" /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;