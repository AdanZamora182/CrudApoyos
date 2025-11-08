/**
 * Guía de Buenas Prácticas para el módulo Auth
 * 
 * Este archivo documenta las reglas y patrones a seguir en el desarrollo
 * del módulo de autenticación siguiendo las convenciones establecidas.
 */

// ============================================================================
// 🧱 ESTRUCTURA DE DIRECTORIOS
// ============================================================================

/**
 * Auth/
 * ├── Login.jsx          - Página de inicio de sesión
 * ├── Register.jsx       - Página de registro
 * └── Auth.styles.jsx    - Estilos compartidos con styled-components
 */

// ============================================================================
// ⚙️ COMPONENTES UI REUTILIZABLES
// ============================================================================

/**
 * components/ui/
 * ├── ToasterProvider.jsx - Proveedor global de notificaciones
 * ├── Button.jsx         - Componente de botón reutilizable
 * ├── Modal.jsx          - Modal reutilizable
 * └── Spinner.jsx        - Indicador de carga
 */

// ============================================================================
// 🎨 SISTEMA DE ESTILOS
// ============================================================================

/**
 * styles/
 * ├── theme.js           - Variables del tema (colores, tipografía, etc.)
 * ├── mixins.js          - Funciones de estilo reutilizables
 * ├── global.css         - Reset CSS y estilos base
 * └── breakpoints.jsx    - Puntos de ruptura responsivos
 */

// ============================================================================
// 🔑 GESTIÓN DE ESTADO
// ============================================================================

/**
 * context/
 * ├── AuthContext.jsx    - Contexto de autenticación
 * └── ThemeContext.jsx   - Contexto de tema (claro/oscuro)
 * 
 * hooks/
 * ├── useAuth.js         - Hook para acceso al contexto de auth
 * └── useTheme.js        - Hook para gestión de tema
 */

// ============================================================================
// 📋 REGLAS DE CÓDIGO
// ============================================================================

/**
 * 1. EXTENSIONES DE ARCHIVO
 *    - Componentes React: .jsx
 *    - Utilidades JS: .js
 *    - Estilos: .jsx (para styled-components)
 * 
 * 2. NAMING CONVENTIONS
 *    - Componentes: PascalCase (AuthContainer, LoginForm)
 *    - Hooks: camelCase con prefijo 'use' (useAuth, useTheme)
 *    - Archivos: PascalCase para componentes, camelCase para utils
 * 
 * 3. ESTILOS
 *    - Usar React-Bootstrap para layout y componentes base
 *    - styled-components para personalización avanzada
 *    - Evitar estilos inline
 *    - Mantener coherencia visual con el tema
 * 
 * 4. IMPORTS
 *    - Orden: React, librerías, componentes locales, estilos
 *    - Usar imports relativos coherentes
 *    - Eliminar imports no utilizados
 * 
 * 5. RESPONSIVIDAD ⚠️ ACTUALIZADO
 *    - Mobile-first approach
 *    - OBLIGATORIO usar breakpoints definidos en breakpoints.jsx
 *    - Breakpoints estándar:
 *      * xs: '400px'  - Pantallas muy pequeñas
 *      * sm: '576px'  - Mobile (Bootstrap sm)
 *      * md: '768px'  - Tablet (Bootstrap md)
 *      * lg: '992px'  - Desktop (Bootstrap lg)
 *      * xl: '1200px' - Desktop grande
 *    - Componentes táctiles amigables en móviles
 *    - NO usar valores hardcodeados como 600px, 400px, etc.
 */

// ============================================================================
// � SISTEMA DE BREAKPOINTS RESPONSIVOS
// ============================================================================

/**
 * BREAKPOINTS ESTANDARIZADOS (breakpoints.jsx):
 * 
 * export const breakpoints = {
 *   xs: '400px',   // Pantallas muy pequeñas (iPhone SE, etc.)
 *   sm: '576px',   // Mobile (Bootstrap sm)
 *   md: '768px',   // Tablet (Bootstrap md)
 *   lg: '992px',   // Desktop (Bootstrap lg)
 *   xl: '1200px',  // Desktop grande (Bootstrap xl)
 *   xxl: '1400px'  // Desktop muy grande (Bootstrap xxl)
 * };
 * 
 * 🔥 FORMAS DE USAR BREAKPOINTS:
 * 
 * // OPCIÓN 1: A través del tema (RECOMENDADO)
 * @media (max-width: ${props => props.theme.breakpoints.mobile}) {
 *   // Estilos para móviles
 * }
 * 
 * // OPCIÓN 2: Import directo para mayor claridad
 * import { breakpoints } from '../../styles/breakpoints.jsx';
 * @media (max-width: ${breakpoints.sm}) {
 *   // Estilos para móviles
 * }
 * 
 * // OPCIÓN 3: Usando helpers de devices
 * import { devices } from '../../styles/breakpoints.jsx';
 * @media ${devices.mobile} {
 *   // Estilos para móviles
 * }
 * 
 * ⚠️ REGLAS IMPORTANTES:
 * - NUNCA usar valores hardcodeados como 600px, 400px
 * - El archivo breakpoints.jsx es la ÚNICA fuente de verdad
 * - theme.js importa automáticamente de breakpoints.jsx
 * - Mobile-first: empezar por estilos base y agregar @media para pantallas más grandes
 */

// ============================================================================
// �🔄 INTEGRACIÓN REACT-BOOTSTRAP + STYLED-COMPONENTS
// ============================================================================

/**
 * PATRÓN RECOMENDADO:
 * 
 * 1. Base con React-Bootstrap:
 *    import { Container, Row, Col, Form } from 'react-bootstrap';
 * 
 * 2. Personalización con styled-components:
 *    const StyledContainer = styled(Container)`
 *      background: ${props => props.theme.gradients.primary};
 *    `;
 * 
 * 3. Uso combinado:
 *    <StyledContainer>
 *      <Row>
 *        <Col md={6}>
 *          <CustomFormElement />
 *        </Col>
 *      </Row>
 *    </StyledContainer>
 */

// ============================================================================
// 🛠️ EJEMPLOS DE USO
// ============================================================================

/**
 * COMPONENTE DE AUTENTICACIÓN TIPO:
 * 
 * import React from 'react';
 * import { Container, Row, Col } from 'react-bootstrap';
 * import styled from 'styled-components';
 * import { useAuth } from '../../hooks/useAuth';
 * import { useToaster } from '../../components/ui/ToasterProvider';
 * 
 * const StyledContainer = styled(Container)`
 *   min-height: 100vh;
 *   background: ${props => props.theme.gradients.primary};
 * `;
 * 
 * export const AuthPage = () => {
 *   const { login } = useAuth();
 *   const { showSuccess, showError } = useToaster();
 *   
 *   return (
 *     <StyledContainer fluid>
 *       <Row className="justify-content-center align-items-center min-vh-100">
 *         <Col md={8} lg={6} xl={4}>
 *           // Contenido del formulario
 *         </Col>
 *       </Row>
 *     </StyledContainer>
 *   );
 * };
 */

// ============================================================================
// ✅ CHECKLIST DE DESARROLLO
// ============================================================================

/**
 * Antes de hacer commit, verificar:
 * 
 * ☐ Extensiones de archivo correctas (.jsx para componentes)
 * ☐ Imports actualizados y sin elementos no utilizados
 * ☐ Uso de React-Bootstrap para layout base
 * ☐ styled-components para personalizaciones
 * ☐ Responsive design implementado
 * ☐ Hooks useAuth y useToaster utilizados correctamente
 * ☐ Consistencia visual con el tema global
 * ☐ Accesibilidad y usabilidad móvil
 */

export default {}; // Evitar error de módulo vacío