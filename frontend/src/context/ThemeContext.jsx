import React, { createContext, useState, useEffect } from 'react';
import { theme } from '../styles/theme';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cargar preferencia de tema desde localStorage
  useEffect(() => {
    const loadThemePreference = () => {
      try {
        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme);
          setIsDarkMode(parsedTheme.isDarkMode || false);
        }
      } catch (error) {
        console.error('Error al cargar preferencia de tema:', error);
        // Usar tema por defecto si hay error
        setIsDarkMode(false);
      }
    };

    loadThemePreference();
  }, []);

  // Actualizar tema cuando cambie el modo
  useEffect(() => {
    if (isDarkMode) {
      // Tema oscuro - invertir algunos colores
      setCurrentTheme({
        ...theme,
        colors: {
          ...theme.colors,
          background: '#1e1e1e',
          backgroundLight: '#2d2d2d',
          backgroundDark: '#121212',
          text: '#ffffff',
          textLight: '#b3b3b3',
          textMuted: '#888888',
          border: 'rgba(255, 255, 255, 0.1)',
          hover: '#3d3d3d',
          shadow: 'rgba(0, 0, 0, 0.3)',
          shadowDark: 'rgba(0, 0, 0, 0.5)',
        }
      });
    } else {
      // Tema claro - usar tema original
      setCurrentTheme(theme);
    }
  }, [isDarkMode]);

  // Guardar preferencia cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('theme-preference', JSON.stringify({ isDarkMode }));
    } catch (error) {
      console.error('Error al guardar preferencia de tema:', error);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const updateThemeColors = (colorUpdates) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...colorUpdates
      }
    }));
  };

  const resetTheme = () => {
    setCurrentTheme(theme);
    setIsDarkMode(false);
  };

  const value = {
    theme: currentTheme,
    isDarkMode,
    toggleTheme,
    updateThemeColors,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};