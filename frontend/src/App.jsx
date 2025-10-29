import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToasterProvider } from './components/ui/ToasterProvider';
import AppRouter from './router/AppRouter';

/**
 * Componente principal de la aplicación
 * Punto de entrada limpio que configura el enrutador y el contexto de autenticación
 */
function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ToasterProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ToasterProvider>
    </Router>
  );
}

export default App;