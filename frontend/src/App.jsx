import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Menu from './pages/Menu/Menu';
import CabezaCirculoForm from './pages/CabezasCirculo/CabezaCirculoForm';
import IntegranteCirculoForm from './pages/IntegrantesCirculo/IntegranteCirculoForm'; 
import ApoyoForm from './pages/Apoyos/ApoyoForm'; 
import CabezasCirculoPage from "./pages/CabezasCirculo/CabezasCirculoPage";
import IntegranteCirculoPage from "./pages/IntegrantesCirculo/IntegranteCirculoPage";
import ApoyoPage from './pages/Apoyos/ApoyoPage';  // Import the new ApoyoPage component
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user !== null; 
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
          <Route path="integrantes-circulo" element={<IntegranteCirculoPage />} />
          <Route path="apoyos" element={<ApoyoPage />} /> 
          <Route path="dashboard" element={<Dashboard />} /> {/* Add Dashboard component here */}
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