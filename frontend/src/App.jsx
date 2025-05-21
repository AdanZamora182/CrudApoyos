import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Menu from './components/Menu/Menu';
import CabezaCirculoForm from './components/CabezaCirculo/CabezaCirculoForm';
import IntegranteCirculoForm from './components/IntegrantesCirculo/IntegranteCirculoForm'; 
import ApoyoForm from './components/Apoyo/ApoyoForm'; 
import CabezasCirculoPage from "./components/CabezaCirculo/CabezasCirculoPage";

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
        
        {/* Rutas protegidas dentro del layout del menú */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          } 
        >
          <Route path="menu" element={<></>} /> {/* Empty element for home page */}
          <Route path="cabezas-circulo" element={<CabezasCirculoPage />} />
          <Route path="integrantes-circulo" element={<IntegranteCirculoForm />} />
          <Route path="apoyos" element={<ApoyoForm />} />
          <Route path="dashboard" element={<div>Dashboard (En construcción)</div>} /> {/* Changed from reportes to dashboard */}
        </Route>
        
        {/* Redirigir rutas desconocidas y la raíz */}
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