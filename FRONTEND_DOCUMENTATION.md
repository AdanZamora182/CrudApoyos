# Documentación simplificada del Frontend - CrudApoyos

## Resumen rápido
Frontend SPA construido con React + Vite para gestionar cabezas de círculo, integrantes y apoyos. Enfocado en UX responsiva, autenticación y manejo eficiente del estado y datos.

## Tecnologías principales
- React 19, Vite
- React Router DOM
- TanStack React Query (datos servidor)
- Styled Components + Bootstrap (estilos)
- Axios (HTTP)
- React Google reCAPTCHA
- TanStack Table (tablas)

## Estructura general (resumen)
- public/ — archivos estáticos
- src/
  - api/ — llamadas HTTP (axios)
  - components/ — UI reutilizable (layout, tablas, formularios, toaster)
  - context/ — AuthContext, ThemeContext
  - hooks/ — hooks personalizados (useAuth, useTheme, useResponsive, etc.)
  - pages/ — vistas por módulo (Auth, Cabezas, Integrantes, Apoyos, Dashboard, Menu)
  - router/ — configuración de rutas y guards
  - styles/ — tema y breakpoints
  - App.jsx, main.jsx — punto de entrada y providers

## Configuración clave
- main.jsx: Provider de React Query, import global de Bootstrap.
- App.jsx: Router envuelto en ThemeProvider, ToasterProvider y AuthProvider.
- vite.config.js: plugin React (HMR rápido).

## Arquitectura (visión general)
- Componentes por feature, separación lógica/presentación.
- Flujo: UI → custom hooks → servicios API → backend → DB.
- Estado:
  - Global: AuthContext, ThemeContext, ToasterContext
  - Server state: React Query (cache y sincronización)
  - Local UI: useState para formularios y modales
  - Persistencia: localStorage (usuario, preferencias), sessionStorage (historial toasts)

## Rutas y protección (resumen)
- Rutas públicas: /login, /register
- Rutas privadas: /menu, /cabezas-circulo, /integrantes-circulo, /apoyos, /dashboard
- PrivateRoute: verifica autenticación, muestra loader y redirige a /login si es necesario.
- PublicRoute: redirige a /menu si ya hay sesión.

## Contextos principales
- AuthContext: gestiona user, token, login, logout, isAuthenticated; persiste en localStorage.
- ThemeContext: tema actual y toggle modo oscuro; persiste preferencia en localStorage.
- ToasterProvider: sistema de notificaciones con control de duplicados y auto-dismiss.

## Hooks útiles
- useAuth: acceso al AuthContext.
- useTheme: acceso al ThemeContext.
- useResponsive: detecta tamaño de pantalla y devuelve flags (isMobile, isTablet, isDesktop).
- useForm / useTable: helpers mínimos para formularios y tablas (pueden delegar en componentes).

## Componentes importantes 
- Layout (Sidebar + Navbar + ContentBody)
- Sidebar: navegación colapsable / overlay móvil
- Navbar: título, toggles y user info
- Toaster: notificaciones responsive
- Formularios y tablas con componentes reutilizables (FormField, ColoniaSelector, TanStack Table)

## Comunicación con API
- axiosConfig: baseURL, timeout, interceptor request (Bearer token), interceptor response (handle 401).
- API por módulo: authApi, cabezasApi, integrantesApi, apoyosApi, direccionesApi, dashboardApi.
- React Query para fetch/mutations e invalidación de caché tras mutaciones.

## Estilos y tema
- theme.js con paleta, spacing, tipografía y transiciones.
- breakpoints.jsx con dispositivos y media queries.
- Styled Components con soporte para temas y transient props ($prop).

## Responsividad
- Mobile-first: estilos base para móvil y ampliaciones por breakpoints.
- Tablas adaptan columnas; móviles muestran tarjetas.
- Sidebar usa overlay en móvil.

## Buenas prácticas (resumen)
- Encapsular lógica en hooks.
- Usar React Query para datos del servidor.
- Memoizar callbacks y valores costosos (useCallback/useMemo).
- Usar transient props en styled-components para evitar warnings.
- Manejo de errores con toaster y mensajes claros.
- Accesibilidad básica: ARIA y atributos semánticos.

## Flujo típico (ejemplos rápidos)
- Login: Login.jsx → authApi.iniciarSesion → AuthContext guarda user → redirige a /menu.
- Crear cabeza: Form → createCabezaCirculo → React Query invalida ['cabezas'] → actualizar tabla y mostrar toast.
- Exportar Excel: petición que devuelve blob → crear URL temporal y descargar.

