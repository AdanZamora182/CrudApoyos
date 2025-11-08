import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Hook personalizado para acceder al contexto de tema
 * Proporciona acceso seguro al tema actual y funciones de modificación
 * @throws {Error} Si se usa fuera del ThemeProvider
 * @returns {Object} Objeto con el tema actual y funciones para modificarlo
 * @property {Object} theme - Tema actual con colores, tipografía, etc.
 * @property {boolean} isDarkMode - Estado del modo oscuro
 * @property {Function} toggleTheme - Función para alternar entre modo claro/oscuro
 * @property {Function} updateThemeColors - Función para actualizar colores del tema
 * @property {Function} resetTheme - Función para resetear el tema a valores por defecto
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }

  return context;
};
