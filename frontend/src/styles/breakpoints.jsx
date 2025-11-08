// Breakpoints para diseño responsivo
export const breakpoints = {
  xs: '400px',  // Pantallas muy pequeñas
  sm: '576px',  // Mobile (Bootstrap sm)
  md: '768px',  // Tablet (Bootstrap md)  
  lg: '992px',  // Desktop (Bootstrap lg)
  xl: '1200px', // Desktop grande (Bootstrap xl)
  xxl: '1400px', // Desktop muy grande (Bootstrap xxl)
};

// Media queries helpers
export const devices = {
  // Rangos de dispositivos
  extraSmall: `(max-width: ${breakpoints.xs})`,
  mobile: `(max-width: ${breakpoints.sm})`,
  tablet: `(min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`,
  desktop: `(min-width: ${breakpoints.lg})`,
  
  // Específicos - min-width
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  xxl: `(min-width: ${breakpoints.xxl})`,
  
  // Max width - para media queries mobile-first
  maxXs: `(max-width: ${breakpoints.xs})`,
  maxSm: `(max-width: ${breakpoints.sm})`,
  maxMd: `(max-width: ${breakpoints.md})`,
  maxLg: `(max-width: ${breakpoints.lg})`,
  maxXl: `(max-width: ${breakpoints.xl})`,
};

export default devices;