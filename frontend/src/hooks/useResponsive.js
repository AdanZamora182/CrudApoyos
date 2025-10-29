import { useState, useEffect } from 'react';

// Breakpoints del tema
const breakpoints = {
  mobile: 600,
  tablet: 768,
  desktop: 1024,
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [device, setDevice] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      // Determinar el tipo de dispositivo basado en el ancho
      if (width <= breakpoints.mobile) {
        setDevice('mobile');
      } else if (width <= breakpoints.tablet) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    };

    // Ejecutar al montar el componente
    handleResize();

    // Agregar event listener
    window.addEventListener('resize', handleResize);

    // Limpiar event listener al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funciones de utilidad para verificar breakpoints
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const isDesktop = device === 'desktop';
  const isMobileOrTablet = isMobile || isTablet;
  const isTabletOrDesktop = isTablet || isDesktop;

  // Función para obtener valores responsivos
  const getResponsiveValue = (mobileValue, tabletValue, desktopValue) => {
    if (isMobile) return mobileValue;
    if (isTablet) return tabletValue || mobileValue;
    return desktopValue || tabletValue || mobileValue;
  };

  return {
    screenSize,
    device,
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,
    isTabletOrDesktop,
    getResponsiveValue,
    breakpoints,
  };
};
