import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToasterProvider } from './components/ui/ToasterProvider';
import AppRouter from './router/AppRouter';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
      <ThemeProvider>
        <ToasterProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ToasterProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </Router>
  );
}

export default App;