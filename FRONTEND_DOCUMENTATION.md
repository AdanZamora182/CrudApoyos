# Documentación del Frontend - CrudApoyos

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Configuración Principal](#configuración-principal)
6. [Sistema de Rutas](#sistema-de-rutas)
7. [Contextos Globales](#contextos-globales)
8. [Hooks Personalizados](#hooks-personalizados)
9. [Componentes UI](#componentes-ui)
10. [Componentes de Layout](#componentes-de-layout)
11. [Páginas y Vistas](#páginas-y-vistas)
12. [API y Servicios](#api-y-servicios)
13. [Sistema de Estilos](#sistema-de-estilos)
14. [Diseño Responsivo](#diseño-responsivo)
15. [Gestión de Estado](#gestión-de-estado)
16. [Best Practices](#best-practices)

---

## Descripción General

El frontend de **CrudApoyos** es una **aplicación web SPA (Single Page Application)** construida con **React 19** y **Vite**. Implementa un sistema completo de gestión para cabezas de círculo, integrantes y apoyos sociales con una interfaz moderna, responsiva y altamente modular.

### Características Principales

- 🎨 **UI/UX Moderna**: Interfaz intuitiva con styled-components y Bootstrap
- 📱 **100% Responsiva**: Diseño mobile-first con breakpoints consistentes
- 🔐 **Autenticación Robusta**: Sistema de login/registro con protección reCAPTCHA
- 🚀 **Optimización de Rendimiento**: React Query para caché inteligente de datos
- 🎭 **Gestión de Estado Avanzada**: Context API + localStorage para persistencia
- 🎯 **Rutas Protegidas**: Navegación segura con guards de autenticación
- 📊 **Tablas Interactivas**: TanStack Table con búsqueda, paginación y exportación
- 🌙 **Tema Dinámico**: Soporte para modo claro/oscuro
- 🔔 **Sistema de Notificaciones**: Toaster personalizado con control de duplicados

---

## Tecnologías Utilizadas

### Core

- **React 19.0.0**: Biblioteca principal para UI
- **React DOM 19.0.0**: Renderizado del DOM
- **Vite 6.2.0**: Build tool y dev server ultrarrápido
- **React Router DOM 6.30.0**: Enrutamiento y navegación

### Gestión de Estado y Datos

- **TanStack React Query 5.90.5**: Server state management y caché
- **TanStack React Table 8.21.3**: Tablas avanzadas con sorting y paginación
- **Context API**: Estado global de autenticación y tema

### Estilos y UI

- **Styled Components 6.1.19**: CSS-in-JS con temas dinámicos
- **Bootstrap 5.3.8**: Framework CSS base
- **Bootstrap Icons 1.13.1**: Iconografía
- **React Icons 5.5.0**: Librería adicional de iconos
- **Lucide React 0.546.0**: Iconos modernos
- **Tailwind CSS 4.1.3**: Utilidades CSS (configuración PostCSS)

### Networking y Validación

- **Axios 1.8.4**: Cliente HTTP con interceptores
- **React Google reCAPTCHA 3.1.0**: Protección contra bots

### Utilidades

- **React Responsive 10.0.1**: Detección de dispositivos
- **LocalStorage/SessionStorage**: Persistencia de datos

### Desarrollo

- **ESLint**: Linter para calidad de código
- **PostCSS**: Procesamiento de CSS
- **Autoprefixer**: Prefijos automáticos para CSS

---

## Arquitectura del Sistema

### Patrón de Diseño

El frontend sigue una arquitectura **modular y escalable** basada en:

1. **Component-Based Architecture**: Componentes reutilizables y composables
2. **Feature-Based Structure**: Organización por funcionalidades
3. **Separation of Concerns**: Separación clara entre lógica, presentación y datos
4. **Container/Presentational Pattern**: Componentes inteligentes vs presentacionales
5. **Custom Hooks Pattern**: Lógica reutilizable encapsulada

### Flujo de Datos

```
Usuario
  ↓
Componente (UI)
  ↓
Custom Hook (Lógica)
  ↓
API Service (HTTP)
  ↓
Backend (NestJS)
  ↓
Base de Datos
```

### Gestión de Estado

```
┌─────────────────────────────────────────┐
│         ESTADO DE LA APLICACIÓN         │
├─────────────────────────────────────────┤
│                                         │
│  🔐 AuthContext                         │
│     ├── Usuario autenticado             │
│     ├── Tokens de sesión                │
│     └── Funciones de login/logout       │
│                                         │
│  🎨 ThemeContext                        │
│     ├── Tema actual (claro/oscuro)      │
│     └── Funciones de modificación       │
│                                         │
│  🔔 ToasterContext                      │
│     ├── Notificaciones activas          │
│     └── Funciones show/hide             │
│                                         │
│  📊 React Query (Server State)          │
│     ├── Caché de cabezas de círculo     │
│     ├── Caché de integrantes            │
│     ├── Caché de apoyos                 │
│     └── Estado de loading/error         │
│                                         │
│  💾 LocalStorage (Persistencia)         │
│     ├── Usuario autenticado             │
│     ├── Preferencias de tema            │
│     └── Estado del sidebar              │
│                                         │
└─────────────────────────────────────────┘
```

---

## Estructura de Carpetas

```
frontend/
├── public/                     # Archivos estáticos públicos
├── src/
│   ├── api/                   # Servicios de API
│   │   ├── axiosConfig.js     # Configuración de Axios
│   │   ├── authApi.js         # API de autenticación
│   │   ├── cabezasApi.js      # API de cabezas de círculo
│   │   ├── integrantesApi.js  # API de integrantes
│   │   ├── apoyosApi.js       # API de apoyos
│   │   ├── direccionesApi.js  # API de direcciones
│   │   ├── dashboardApi.js    # API de dashboard
│   │   └── index.js           # Barrel export
│   │
│   ├── assets/                # Recursos estáticos (imágenes, fonts)
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── buttons/           # Componentes de botones
│   │   │   └── ExcelButton.styles.js
│   │   ├── forms/             # Componentes de formularios
│   │   │   ├── FormField.jsx
│   │   │   ├── FormSection.jsx
│   │   │   ├── ColoniaSelector.jsx
│   │   │   └── FormSections.styles.js
│   │   ├── layout/            # Componentes de estructura
│   │   │   ├── Layout.jsx
│   │   │   ├── Layout.styles.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.styles.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Sidebar.styles.jsx
│   │   │   └── Pagebar.jsx
│   │   ├── tables/            # Componentes de tablas
│   │   │   ├── CrudTable.styles.js
│   │   │   ├── SearchBar.styles.js
│   │   │   └── Pagination.styles.js
│   │   └── ui/                # Componentes UI básicos
│   │       ├── Alert.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       ├── Spinner.jsx
│   │       └── ToasterProvider.jsx
│   │
│   ├── context/               # Contextos de React
│   │   ├── AuthContext.jsx    # Contexto de autenticación
│   │   └── ThemeContext.jsx   # Contexto de tema
│   │
│   ├── hooks/                 # Custom Hooks
│   │   ├── useAuth.js         # Hook de autenticación
│   │   ├── useForm.js         # Hook de formularios
│   │   ├── useResponsive.js   # Hook de responsive
│   │   ├── useTable.js        # Hook de tablas
│   │   └── useTheme.js        # Hook de tema
│   │
│   ├── pages/                 # Páginas/Vistas
│   │   ├── Apoyos/            # Módulo de apoyos
│   │   │   ├── ApoyoPage.jsx
│   │   │   ├── ApoyoCrud.jsx
│   │   │   ├── ApoyoForm.jsx
│   │   │   ├── ApoyoEdit.jsx
│   │   │   └── ApoyoView.jsx
│   │   ├── Auth/              # Módulo de autenticación
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Auth.styles.jsx
│   │   ├── CabezasCirculo/    # Módulo de cabezas
│   │   │   ├── CabezasCirculoPage.jsx
│   │   │   ├── CabezaCirculoCRUD.jsx
│   │   │   ├── CabezaCirculoForm.jsx
│   │   │   └── CabezaCirculoEdit.jsx
│   │   ├── Dashboard/         # Dashboard/Estadísticas
│   │   │   └── Dashboard.jsx
│   │   ├── IntegrantesCirculo/ # Módulo de integrantes
│   │   │   ├── IntegranteCirculoPage.jsx
│   │   │   ├── IntegranteCirculoCRUD.jsx
│   │   │   ├── IntegranteCirculoForm.jsx
│   │   │   ├── IntegranteCirculoEdit.jsx
│   │   │   └── IntegranteCirculoView.jsx
│   │   └── Menu/              # Página principal
│   │       ├── Menu.jsx
│   │       ├── Menu.styles.jsx
│   │       └── HomePage.jsx
│   │
│   ├── router/                # Configuración de rutas
│   │   ├── AppRouter.jsx      # Router principal
│   │   ├── PrivateRoute.jsx   # Ruta privada (requiere auth)
│   │   └── PublicRoute.jsx    # Ruta pública (sin auth)
│   │
│   ├── styles/                # Estilos globales y configuración
│   │   ├── theme.js           # Tema principal
│   │   ├── breakpoints.jsx    # Breakpoints responsivos
│   │   ├── mixins.js          # Mixins reutilizables
│   │   └── global.css         # Estilos globales
│   │
│   ├── App.jsx                # Componente raíz
│   └── main.jsx               # Punto de entrada
│
├── index.html                 # HTML base
├── package.json               # Dependencias y scripts
├── vite.config.js             # Configuración de Vite
├── eslint.config.js           # Configuración de ESLint
├── postcss.config.js          # Configuración de PostCSS
└── tailwind.config.js         # Configuración de Tailwind

Líneas de código: ~921 (sin contar dependencias)
```

---

## Configuración Principal

### main.jsx - Punto de Entrada

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutos - datos frescos
      gcTime: 10 * 60 * 1000,         // 10 minutos - tiempo en caché
      refetchOnWindowFocus: false,    // No refetch al volver a la ventana
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

**Características clave**:
- **React Query**: Configurado con caché inteligente de 5-10 minutos
- **React.StrictMode**: Detección temprana de problemas en desarrollo
- **Bootstrap**: Importado globalmente para estilos base

---

### App.jsx - Configuración de Providers

```jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToasterProvider } from './components/ui/ToasterProvider';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <ToasterProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ToasterProvider>
      </ThemeProvider>
    </Router>
  );
}
```

**Jerarquía de Providers**:
1. **Router**: Navegación y rutas
2. **ThemeProvider**: Tema global (claro/oscuro)
3. **ToasterProvider**: Notificaciones
4. **AuthProvider**: Autenticación y usuario

---

### vite.config.js - Configuración de Build

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Características**:
- Build ultrarrápido con Vite
- Hot Module Replacement (HMR) instantáneo
- Optimización automática de producción

---

## Sistema de Rutas

### AppRouter.jsx - Rutas Principales

```jsx
<Routes>
  {/* Rutas públicas */}
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

  {/* Rutas protegidas dentro del layout */}
  <Route path="/" element={<PrivateRoute><Menu /></PrivateRoute>}>
    <Route path="menu" element={<></>} />
    <Route path="cabezas-circulo" element={<CabezasCirculoPage />} />
    <Route path="integrantes-circulo" element={<IntegranteCirculoPage />} />
    <Route path="apoyos" element={<ApoyoPage />} />
    <Route path="dashboard" element={<Dashboard />} />
  </Route>

  {/* Redireccionamiento */}
  <Route path="*" element={<Navigate to={isAuthenticated() ? "/menu" : "/login"} />} />
</Routes>
```

### Rutas Disponibles

| Ruta | Tipo | Componente | Descripción |
|------|------|-----------|-------------|
| `/login` | Pública | `Login` | Inicio de sesión |
| `/register` | Pública | `Register` | Registro de usuarios |
| `/menu` | Privada | `HomePage` | Página principal |
| `/cabezas-circulo` | Privada | `CabezasCirculoPage` | Gestión de cabezas |
| `/integrantes-circulo` | Privada | `IntegranteCirculoPage` | Gestión de integrantes |
| `/apoyos` | Privada | `ApoyoPage` | Gestión de apoyos |
| `/dashboard` | Privada | `Dashboard` | Estadísticas |
| `*` | Comodín | `Navigate` | Redirección inteligente |

### Protección de Rutas

#### PrivateRoute.jsx

```jsx
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated() || !user) {
      logout();
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, user]);

  if (loading) return <div>Verificando sesión...</div>;
  if (!isAuthenticated() || !user) return <Navigate to="/login" replace />;

  return children;
};
```

**Características**:
- Verifica autenticación antes de renderizar
- Muestra loader mientras valida
- Redirige automáticamente al login si no autenticado
- Limpia sesión si datos inválidos

#### PublicRoute.jsx

```jsx
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated()) {
    return <Navigate to="/menu" replace />;
  }

  return children;
};
```

**Características**:
- Redirige a `/menu` si ya autenticado
- Previene acceso a login/register si ya logueado

---

## Contextos Globales

### AuthContext - Gestión de Autenticación

**Ubicación**: `src/context/AuthContext.jsx`

```jsx
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funciones disponibles
  const login = (userData) => { /* ... */ };
  const logout = () => { /* ... */ };
  const isAuthenticated = () => { /* ... */ };
  const updateUser = (userData) => { /* ... */ };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Estado gestionado**:
- `user`: Objeto con datos del usuario autenticado
- `loading`: Estado de carga durante verificación

**Funciones disponibles**:
- `login(userData)`: Guardar usuario y token en localStorage
- `logout()`: Limpiar sesión y redirigir al login
- `isAuthenticated()`: Verificar si hay sesión válida
- `updateUser(userData)`: Actualizar datos del usuario

**Persistencia**:
- **localStorage**: `user` (JSON del usuario autenticado)
- **Validación automática**: Al cargar la app, verifica validez de datos

---

### ThemeContext - Gestión de Tema

**Ubicación**: `src/context/ThemeContext.jsx`

```jsx
export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const updateThemeColors = (colorUpdates) => { /* ... */ };
  const resetTheme = () => { /* ... */ };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDarkMode, toggleTheme, updateThemeColors, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

**Estado gestionado**:
- `currentTheme`: Objeto con colores, tipografía, espaciado, etc.
- `isDarkMode`: Booleano indicando si modo oscuro está activo

**Funciones disponibles**:
- `toggleTheme()`: Alternar entre modo claro/oscuro
- `updateThemeColors(colorUpdates)`: Actualizar colores específicos
- `resetTheme()`: Resetear al tema por defecto

**Persistencia**:
- **localStorage**: `theme-preference` (preferencia de modo claro/oscuro)

---

### ToasterContext - Sistema de Notificaciones

**Ubicación**: `src/components/ui/ToasterProvider.jsx`

```jsx
export const ToasterProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, variant, duration) => { /* ... */ };
  const showSuccess = (message, duration) => { /* ... */ };
  const showError = (message, duration) => { /* ... */ };
  const removeToast = (id) => { /* ... */ };
  const clearToasts = () => { /* ... */ };
  const clearMessageHistory = () => { /* ... */ };

  // Renderiza container de toasts...
};
```

**Funciones disponibles**:
- `showToast(message, variant, duration)`: Mostrar notificación genérica
- `showSuccess(message, duration)`: Notificación de éxito (verde)
- `showError(message, duration)`: Notificación de error (rojo)
- `removeToast(id)`: Eliminar notificación específica
- `clearToasts()`: Limpiar todas las notificaciones
- `clearMessageHistory()`: Resetear historial de mensajes mostrados

**Características especiales**:
- **Control de duplicados**: No muestra el mismo mensaje dos veces en la misma sesión
- **Mensajes críticos**: Algunos mensajes se muestran siempre (errores de autenticación)
- **Animaciones**: Slide-in/slide-out suaves
- **Responsivo**: Se adapta a móvil, tablet y desktop
- **Auto-dismiss**: Se cierra automáticamente después de 8 segundos
- **Persistencia de sesión**: Usa sessionStorage para evitar duplicados

**Variantes de Toast**:
- `success`: Fondo verde claro, icono de check
- `error`: Fondo rojo claro, icono de alerta

---

## Hooks Personalizados

### useAuth - Hook de Autenticación

**Ubicación**: `src/hooks/useAuth.js`

```jsx
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};
```

**Uso**:
```jsx
const { user, login, logout, isAuthenticated, loading } = useAuth();

if (loading) return <Spinner />;
if (!isAuthenticated()) return <Navigate to="/login" />;

return <div>Bienvenido, {user.nombre}</div>;
```

---

### useResponsive - Hook de Diseño Responsivo

**Ubicación**: `src/hooks/useResponsive.js`

```jsx
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({ width, height });
  const [device, setDevice] = useState('desktop');

  // Detecta cambios en el tamaño de la ventana...

  return {
    screenSize,        // { width, height }
    device,            // 'mobile' | 'tablet' | 'desktop'
    isMobile,          // boolean
    isTablet,          // boolean
    isDesktop,         // boolean
    isMobileOrTablet,  // boolean
    isTabletOrDesktop, // boolean
    getResponsiveValue, // function
    breakpoints,       // object
  };
};
```

**Breakpoints**:
- `mobile`: ≤ 576px
- `tablet`: 577px - 768px
- `desktop`: > 768px

**Uso**:
```jsx
const { isMobile, isDesktop, getResponsiveValue } = useResponsive();

const columns = getResponsiveValue(1, 2, 3); // móvil=1, tablet=2, desktop=3

return (
  <div style={{ padding: isMobile ? '10px' : '20px' }}>
    {isMobile ? <MobileMenu /> : <DesktopMenu />}
  </div>
);
```

---

### useTheme - Hook de Tema

**Ubicación**: `src/hooks/useTheme.js`

```jsx
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }

  return context;
};
```

**Uso**:
```jsx
const { theme, isDarkMode, toggleTheme } = useTheme();

const StyledDiv = styled.div`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

return (
  <>
    <button onClick={toggleTheme}>
      {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
    </button>
    <StyledDiv>Contenido con tema dinámico</StyledDiv>
  </>
);
```

---

### useForm - Hook de Formularios

**Ubicación**: `src/hooks/useForm.js`

**Nota**: Este hook está definido pero con implementación mínima. Se utiliza principalmente validación manual en los componentes de formulario.

---

### useTable - Hook de Tablas

**Ubicación**: `src/hooks/useTable.js`

**Nota**: Este hook está definido pero con implementación mínima. Se utiliza TanStack Table directamente en los componentes.

---

## Componentes UI

### ToasterProvider - Sistema de Notificaciones

**Ubicación**: `src/components/ui/ToasterProvider.jsx`

**Componente principal del sistema de notificaciones** con diseño completamente responsivo.

**Características**:
- Animaciones suaves (slide-in/slide-out)
- Control de duplicados inteligente
- Responsivo (móvil, tablet, desktop)
- Auto-dismiss configurable
- Mensajes críticos siempre visibles
- Iconos personalizados por tipo
- Botón de cierre manual

**Styled Components**:
- `ToasterContainer`: Contenedor principal con posición fixed
- `Toast`: Tarjeta de notificación individual
- `ToastIcon`: Icono (success/error)
- `ToastMessage`: Texto del mensaje
- `CloseButton`: Botón para cerrar

**Uso**:
```jsx
import { useToaster } from '../components/ui/ToasterProvider';

const { showSuccess, showError } = useToaster();

// Mostrar éxito
showSuccess('Registro guardado correctamente');

// Mostrar error
showError('Error al conectar con el servidor');
```

---

### Alert - Alertas Estáticas

**Ubicación**: `src/components/ui/Alert.jsx`

Componente para mostrar alertas estáticas de información, error, éxito o advertencia.

**Props**:
- `variant`: 'info' | 'error' | 'success' | 'warning'
- `children`: Contenido del alert

---

### Button - Botón Personalizado

**Ubicación**: `src/components/ui/Button.jsx`

Botón reutilizable con estilos del tema.

**Props**:
- `variant`: 'primary' | 'secondary' | 'success' | 'error'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `onClick`: function

---

### Card - Tarjeta de Contenido

**Ubicación**: `src/components/ui/Card.jsx`

Contenedor de tarjeta con sombra y bordes redondeados.

**Props**:
- `title`: string (opcional)
- `children`: contenido

---

### Modal - Ventana Modal

**Ubicación**: `src/components/ui/Modal.jsx`

Modal personalizado para confirmaciones y formularios.

**Props**:
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `children`: contenido del modal

---

### Spinner - Indicador de Carga

**Ubicación**: `src/components/ui/Spinner.jsx`

Indicador visual de carga.

**Variantes**:
- Spinner de página completa
- Spinner inline

---

## Componentes de Layout

### Layout - Estructura Principal

**Ubicación**: `src/components/layout/Layout.jsx`

Componente que envuelve la estructura principal de la aplicación autenticada.

```jsx
const Layout = ({ collapsed, onToggleSidebar, user, onLogout, title, children }) => {
  const { isMobile } = useResponsive();

  return (
    <LayoutContainer>
      {/* Overlay para móviles */}
      {isMobile && !collapsed && (
        <div onClick={onToggleSidebar} style={{ /* overlay */ }} />
      )}

      <Sidebar collapsed={collapsed} onToggle={onToggleSidebar} user={user} onLogout={onLogout} />
      <MainContent $collapsed={collapsed}>
        <Navbar title={title} user={user} onToggleSidebar={onToggleSidebar} collapsed={collapsed} />
        <ContentBody>{children}</ContentBody>
      </MainContent>
    </LayoutContainer>
  );
};
```

**Características**:
- Sidebar colapsable
- Navbar superior
- Overlay para móviles
- ContentBody para páginas

---

### Sidebar - Menú Lateral

**Ubicación**: `src/components/layout/Sidebar.jsx`

Barra lateral de navegación con enlaces a las diferentes secciones.

**Características**:
- Colapsable en desktop
- Overlay en móvil
- Iconos con Bootstrap Icons
- Estado activo visual
- Información del usuario
- Botón de logout

**Estilos**: `Sidebar.styles.jsx`

**Navegación disponible**:
- Inicio (🏠)
- Cabezas de Círculo
- Integrantes de Círculo
- Apoyos
- Dashboard

---

### Navbar - Barra Superior

**Ubicación**: `src/components/layout/Navbar.jsx`

Barra de navegación superior con título de página y botón para toggle del sidebar.

**Características**:
- Título dinámico según la ruta
- Botón hamburguesa para móvil
- Información del usuario
- Diseño responsivo

**Estilos**: `Navbar.styles.jsx`

---

### Pagebar - Barra de Paginación

**Ubicación**: `src/components/layout/Pagebar.jsx`

Componente para barra de paginación (si se utiliza).

---

## Páginas y Vistas

### Estructura de Módulos

Cada módulo sigue una estructura consistente:

```
Módulo/
├── [Modulo]Page.jsx       # Container principal con tabs
├── [Modulo]CRUD.jsx       # Tabla CRUD con acciones
├── [Modulo]Form.jsx       # Formulario de creación
├── [Modulo]Edit.jsx       # Formulario de edición
└── [Modulo]View.jsx       # Vista de detalles (opcional)
```

---

### Módulo de Autenticación

#### Login.jsx

**Ubicación**: `src/pages/Auth/Login.jsx`

**Características**:
- Formulario de inicio de sesión
- Validación de campos
- Manejo de errores con toaster
- Redirección automática al menu
- Link a registro

**Campos**:
- Usuario
- Contraseña

**Validaciones**:
- Campos requeridos
- Credenciales válidas (backend)

---

#### Register.jsx

**Ubicación**: `src/pages/Auth/Register.jsx`

**Características**:
- Formulario de registro
- Validación de Google reCAPTCHA v2
- Código de usuario secreto
- Validación de contraseñas coincidentes
- Manejo de errores duplicados

**Campos**:
- Nombre
- Apellidos
- Correo
- Usuario (único)
- Contraseña
- Confirmar contraseña
- Código de usuario (secreto)
- reCAPTCHA

**Validaciones**:
- Campos requeridos
- Contraseñas coincidentes
- Código de usuario válido
- reCAPTCHA validado

---

### Módulo de Cabezas de Círculo

#### CabezasCirculoPage.jsx

**Ubicación**: `src/pages/CabezasCirculo/CabezasCirculoPage.jsx`

**Características**:
- Sistema de tabs (Registros / Nuevo Registro)
- Integración con ThemeProvider
- Diseño responsivo
- Botón de inicio

**Tabs**:
1. **Registros**: Tabla CRUD con búsqueda y paginación
2. **Nuevo Registro**: Formulario de creación

---

#### CabezaCirculoCRUD.jsx

**Ubicación**: `src/pages/CabezasCirculo/CabezaCirculoCRUD.jsx`

**Características**:
- Tabla con TanStack Table
- Búsqueda en tiempo real
- Paginación
- Botón de exportar a Excel
- Acciones: Ver, Editar, Eliminar
- React Query para caché

**Columnas**:
- ID
- Nombre completo
- Clave de elector
- Teléfono
- Email
- Estructura territorial
- Acciones

---

#### CabezaCirculoForm.jsx

**Ubicación**: `src/pages/CabezasCirculo/CabezaCirculoForm.jsx`

**Características**:
- Formulario modular con componentes reutilizables
- Integración con API de direcciones (autocompletado)
- Validación de campos
- FormField, FormSection, ColoniaSelector
- Manejo de errores con toaster

**Secciones**:
1. **Información Personal**: Nombre, apellidos, fecha de nacimiento
2. **Contacto**: Teléfono, email, redes sociales
3. **Dirección**: Calle, números, colonia (autocomplete), CP, municipio
4. **Información Electoral**: Clave de elector
5. **Estructura**: Territorial y posición

**Validaciones**:
- Campos obligatorios
- Formato de email
- Formato de teléfono
- Clave de elector única

---

### Módulo de Integrantes de Círculo

Similar a Cabezas de Círculo con campo adicional:
- **Líder**: Selección de cabeza de círculo asociada

**Páginas**:
- `IntegranteCirculoPage.jsx`
- `IntegranteCirculoCRUD.jsx`
- `IntegranteCirculoForm.jsx`
- `IntegranteCirculoEdit.jsx`
- `IntegranteCirculoView.jsx`

---

### Módulo de Apoyos

**Páginas**:
- `ApoyoPage.jsx`
- `ApoyoCrud.jsx`
- `ApoyoForm.jsx`
- `ApoyoEdit.jsx`
- `ApoyoView.jsx`

**Características especiales**:
- Selección de beneficiario (Cabeza o Integrante)
- Tipo de apoyo personalizable
- Cantidad numérica
- Fecha de entrega

---

### Menu - Página Principal

#### Menu.jsx

**Ubicación**: `src/pages/Menu/Menu.jsx`

**Características**:
- Container principal con Layout
- Manejo de estado del sidebar
- Título dinámico según ruta
- Outlet para subrutas
- Función de logout

---

#### HomePage.jsx

**Ubicación**: `src/pages/Menu/HomePage.jsx`

**Características**:
- Dashboard principal
- Tarjetas de acceso rápido a módulos
- Resumen de estadísticas (si disponible)

---

### Dashboard

**Ubicación**: `src/pages/Dashboard/Dashboard.jsx`

**Características**:
- Estadísticas visuales
- Gráficas (si implementadas)
- Resumen de datos

---

## API y Servicios

### Configuración de Axios

**Ubicación**: `src/api/axiosConfig.js`

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 segundos
});

// Interceptor de request (agregar token)
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
});

// Interceptor de response (manejar errores 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Características**:
- Base URL configurable
- Timeout de 10 segundos
- Interceptor para agregar token automáticamente
- Manejo de errores 401 (redirect a login)

---

### Servicios de API

Cada módulo tiene su archivo de API con funciones específicas:

#### authApi.js

```javascript
export const registrarUsuario = async (datos) => { /* ... */ };
export const iniciarSesion = async (datos) => { /* ... */ };
```

---

#### cabezasApi.js

```javascript
export const createCabezaCirculo = async (datos) => { /* ... */ };
export const buscarCabezasCirculo = async (query) => { /* ... */ };
export const getAllCabezasCirculo = async () => { /* ... */ };
export const deleteCabezaCirculo = async (id) => { /* ... */ };
export const updateCabezaCirculo = async (id, data) => { /* ... */ };
export const exportCabezasCirculoToExcel = async () => { /* ... */ };
```

---

#### integrantesApi.js

Similar a cabezasApi.js con endpoints de integrantes.

---

#### apoyosApi.js

Similar a cabezasApi.js con endpoints de apoyos.

---

#### direccionesApi.js

```javascript
export const buscarDireccionesPorCP = async (codigoPostal) => {
  const response = await api.get(`/direcciones/buscar?cp=${codigoPostal}`);
  return response.data; // { colonias: [], municipio: '' }
};
```

**Características**:
- Búsqueda de colonias por código postal
- Autocomplete en formularios
- Integración con base de datos SEPOMEX (MongoDB)

---

#### dashboardApi.js

Funciones para obtener estadísticas y datos del dashboard.

---

### Uso con React Query

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCabezasCirculo, createCabezaCirculo, deleteCabezaCirculo } from '../api';

// Obtener datos
const { data: cabezas, isLoading, error } = useQuery({
  queryKey: ['cabezas'],
  queryFn: getAllCabezasCirculo,
});

// Crear nuevo registro
const queryClient = useQueryClient();
const createMutation = useMutation({
  mutationFn: createCabezaCirculo,
  onSuccess: () => {
    queryClient.invalidateQueries(['cabezas']);
    showSuccess('Cabeza de círculo registrada correctamente');
  },
  onError: (error) => {
    showError('Error al registrar cabeza de círculo');
  },
});

// Eliminar registro
const deleteMutation = useMutation({
  mutationFn: deleteCabezaCirculo,
  onSuccess: () => {
    queryClient.invalidateQueries(['cabezas']);
    showSuccess('Cabeza de círculo eliminada correctamente');
  },
});

// Ejecutar mutaciones
createMutation.mutate(formData);
deleteMutation.mutate(id);
```

---

## Sistema de Estilos

### Theme - Tema Global

**Ubicación**: `src/styles/theme.js`

```javascript
export const theme = {
  colors: {
    primary: '#5c6bc0',
    primaryDark: '#4a5ba8',
    primaryLight: 'rgba(92, 107, 192, 0.1)',
    secondary: '#26c6da',
    success: '#4caf50',
    error: '#e53935',
    dark: '#2c3e50',
    light: '#f5f7fa',
    text: '#333',
    textLight: '#666',
    textMuted: '#888',
    border: 'rgba(0, 0, 0, 0.1)',
    hover: '#ebedf2',
    background: 'rgba(255, 255, 255, 0.85)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #5c6bc0, #26c6da)',
    primaryButton: 'linear-gradient(90deg, #5c6bc0, #26c6da)',
    primaryButtonHover: 'linear-gradient(90deg, #4a5ba8, #1eafc0)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: {
      xs: '12px',
      sm: '13px',
      md: '14px',
      lg: '16px',
      xl: '20px',
      xxl: '24px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
    },
  },
  breakpoints: { /* importados de breakpoints.jsx */ },
  transitions: {
    standard: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
  shadows: {
    light: 'rgba(0, 0, 0, 0.1)',
    card: '0 4px 6px rgba(0, 0, 0, 0.1)',
    hover: '0 8px 15px rgba(0, 0, 0, 0.1)',
  },
};
```

**Uso en Styled Components**:
```jsx
import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${props => props.theme.gradients.primaryButton};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.typography.fontFamily};
  transition: ${props => props.theme.transitions.standard};

  &:hover {
    background: ${props => props.theme.gradients.primaryButtonHover};
    box-shadow: ${props => props.theme.shadows.hover};
  }
`;
```

---

### Breakpoints - Puntos de Quiebre

**Ubicación**: `src/styles/breakpoints.jsx`

```javascript
export const breakpoints = {
  xs: '400px',   // Extra pequeño
  sm: '576px',   // Móvil
  md: '768px',   // Tablet
  lg: '992px',   // Desktop
  xl: '1200px',  // Desktop grande
  xxl: '1400px', // Desktop muy grande
};

export const devices = {
  extraSmall: `(max-width: ${breakpoints.xs})`,
  mobile: `(max-width: ${breakpoints.sm})`,
  tablet: `(min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`,
  desktop: `(min-width: ${breakpoints.lg})`,

  // Específicos - min-width
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,

  // Max width
  maxXs: `(max-width: ${breakpoints.xs})`,
  maxSm: `(max-width: ${breakpoints.sm})`,
  maxMd: `(max-width: ${breakpoints.md})`,
  maxLg: `(max-width: ${breakpoints.lg})`,
};
```

**Uso en Styled Components**:
```jsx
import styled from 'styled-components';
import { breakpoints, devices } from '../styles/breakpoints';

const ResponsiveContainer = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  /* Tablet */
  @media ${devices.maxMd} {
    grid-template-columns: repeat(2, 1fr);
    padding: 1.5rem;
  }

  /* Móvil */
  @media ${devices.maxSm} {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  /* Extra pequeño */
  @media ${devices.maxXs} {
    padding: 0.5rem;
  }
`;
```

---

## Diseño Responsivo

### Estrategia Mobile-First

El frontend implementa un diseño **mobile-first**, lo que significa que:

1. Los estilos base están optimizados para móvil
2. Se agregan estilos adicionales para pantallas más grandes
3. Uso de `min-width` para expandir funcionalidades

### Breakpoints del Sistema

| Dispositivo | Rango | Breakpoint | Uso |
|-------------|-------|------------|-----|
| **Extra Small** | 0 - 400px | `xs` | Móviles muy pequeños |
| **Mobile** | 400px - 576px | `sm` | Smartphones |
| **Tablet** | 576px - 768px | `md` | Tablets |
| **Desktop** | 768px - 992px | `lg` | Laptops |
| **Desktop XL** | 992px - 1200px | `xl` | Monitores grandes |
| **Desktop XXL** | 1200px+ | `xxl` | Monitores muy grandes |

### Componentes Responsivos

#### Sidebar
- **Desktop**: Visible y colapsable
- **Tablet**: Colapsable con overlay
- **Móvil**: Overlay completo, se cierra al navegar

#### Navbar
- **Desktop**: Título + información de usuario
- **Móvil**: Botón hamburguesa + título compacto

#### Tablas
- **Desktop**: Todas las columnas visibles
- **Tablet**: Columnas prioritarias
- **Móvil**: Vista de tarjetas apiladas

#### Formularios
- **Desktop**: Grid de 3 columnas
- **Tablet**: Grid de 2 columnas
- **Móvil**: 1 columna

#### Toaster
- **Desktop**: Ancho máximo 420px, esquina superior derecha
- **Tablet**: Ancho máximo 380px
- **Móvil**: Ancho completo, padding reducido

---

## Gestión de Estado

### Diagrama de Flujo de Estado

```
┌────────────────────────────────────────────────┐
│              FUENTES DE ESTADO                 │
├────────────────────────────────────────────────┤
│                                                │
│  1. Context API (Global)                       │
│     ├── AuthContext: usuario, sesión          │
│     ├── ThemeContext: tema, modo              │
│     └── ToasterContext: notificaciones        │
│                                                │
│  2. React Query (Server State)                 │
│     ├── Caché de cabezas de círculo           │
│     ├── Caché de integrantes                  │
│     ├── Caché de apoyos                       │
│     └── Mutations: create, update, delete     │
│                                                │
│  3. Local State (useState)                     │
│     ├── Formularios: formData, errors         │
│     ├── UI: modals, dropdowns, tabs           │
│     └── Sidebar: collapsed state              │
│                                                │
│  4. LocalStorage (Persistencia)                │
│     ├── user: datos del usuario autenticado   │
│     ├── theme-preference: modo claro/oscuro   │
│     └── sidebarCollapsed: estado del sidebar  │
│                                                │
│  5. SessionStorage (Temporal)                  │
│     └── shownToastMessages: historial toasts  │
│                                                │
└────────────────────────────────────────────────┘
```

### Estrategia de Estado

| Tipo de Dato | Ubicación | Persistencia | Ejemplo |
|--------------|-----------|--------------|---------|
| **Autenticación** | AuthContext | localStorage | Usuario logueado |
| **Tema** | ThemeContext | localStorage | Modo claro/oscuro |
| **Notificaciones** | ToasterContext | sessionStorage | Historial de toasts |
| **Datos del servidor** | React Query | Memoria (5-10 min) | Cabezas, integrantes, apoyos |
| **UI temporal** | useState | No persiste | Modals abiertos, tabs activos |
| **Formularios** | useState | No persiste | Datos del formulario actual |
| **Preferencias UI** | localStorage | localStorage | Sidebar collapsed |

---

## Best Practices

### 1. Estructura de Componentes

✅ **DO**:
```jsx
// Componente funcional con destructuring de props
const MiComponente = ({ titulo, onAction, children }) => {
  const { user } = useAuth();

  return (
    <Container>
      <Title>{titulo}</Title>
      {children}
    </Container>
  );
};

export default MiComponente;
```

❌ **DON'T**:
```jsx
// No usar props sin destructuring
const MiComponente = (props) => {
  return <div>{props.titulo}</div>;
};
```

---

### 2. Custom Hooks

✅ **DO**:
```jsx
// Encapsular lógica reutilizable en hooks
const useCabezasCirculo = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cabezas'],
    queryFn: getAllCabezasCirculo,
  });

  const createMutation = useMutation({
    mutationFn: createCabezaCirculo,
    onSuccess: () => queryClient.invalidateQueries(['cabezas']),
  });

  return { cabezas: data, isLoading, error, create: createMutation.mutate };
};
```

---

### 3. Styled Components

✅ **DO**:
```jsx
// Usar transient props ($prop) para props que no deben ir al DOM
const Button = styled.button`
  background: ${props => props.$variant === 'primary'
    ? props.theme.colors.primary
    : props.theme.colors.secondary};
`;

// Uso
<Button $variant="primary">Guardar</Button>
```

❌ **DON'T**:
```jsx
// No usar props normales que vayan al DOM
<Button variant="primary">Guardar</Button> // Warning en consola
```

---

### 4. Manejo de Errores

✅ **DO**:
```jsx
const handleSubmit = async (data) => {
  try {
    await createCabezaCirculo(data);
    showSuccess('Registro guardado correctamente');
    navigate('/cabezas-circulo');
  } catch (error) {
    const message = error.response?.data?.message || 'Error al guardar registro';
    showError(message);
    console.error('Error:', error);
  }
};
```

---

### 5. React Query

✅ **DO**:
```jsx
// Usar React Query para datos del servidor
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['cabezas', searchQuery],
  queryFn: () => buscarCabezasCirculo(searchQuery),
  staleTime: 5 * 60 * 1000,
  enabled: !!searchQuery, // Solo ejecutar si hay query
});

if (isLoading) return <Spinner />;
if (error) return <Alert variant="error">{error.message}</Alert>;

return <Table data={data} />;
```

---

### 6. Contextos

✅ **DO**:
```jsx
// Siempre validar que el hook se use dentro del Provider
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};
```

---

### 7. Responsividad

✅ **DO**:
```jsx
// Usar el hook useResponsive
const { isMobile, isDesktop } = useResponsive();

return (
  <Container>
    {isMobile ? <MobileView /> : <DesktopView />}
  </Container>
);
```

```jsx
// Usar media queries en styled-components
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media ${devices.maxMd} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${devices.maxSm} {
    grid-template-columns: 1fr;
  }
`;
```

---

### 8. Optimización de Rendimiento

✅ **DO**:
```jsx
// Memoizar callbacks que se pasan a componentes hijos
const handleDelete = useCallback((id) => {
  deleteMutation.mutate(id);
}, [deleteMutation]);

// Memoizar valores computados costosos
const filteredData = useMemo(() => {
  return data.filter(item => item.nombre.includes(searchQuery));
}, [data, searchQuery]);
```

---

### 9. Accesibilidad

✅ **DO**:
```jsx
// Agregar atributos ARIA y semántica HTML
<button
  onClick={handleDelete}
  aria-label="Eliminar registro"
  title="Eliminar"
>
  <FiTrash />
</button>

<form onSubmit={handleSubmit} role="form" aria-labelledby="form-title">
  <h2 id="form-title">Nuevo Registro</h2>
  {/* campos del formulario */}
</form>
```

---

### 10. Seguridad

✅ **DO**:
```jsx
// Validar inputs del usuario
const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

// No guardar información sensible en localStorage
// Solo guardar tokens en httpOnly cookies (si el backend lo soporta)

// Validar autenticación en cada ruta privada
<PrivateRoute>
  <ProtectedPage />
</PrivateRoute>
```

---

## Flujo de Trabajo Típico

### 1. Usuario Inicia Sesión

```
1. Usuario ingresa credenciales en Login.jsx
2. Se llama a iniciarSesion() de authApi.js
3. Backend valida y retorna datos del usuario
4. AuthContext guarda usuario en estado y localStorage
5. Navegación automática a /menu
6. PrivateRoute valida autenticación
7. Se renderiza Menu.jsx con Layout
```

---

### 2. Usuario Crea una Cabeza de Círculo

```
1. Usuario navega a /cabezas-circulo
2. Hace clic en tab "Nuevo Registro"
3. Completa CabezaCirculoForm.jsx
4. Al escribir CP, se llama a buscarDireccionesPorCP()
5. ColoniaSelector muestra opciones autocomplete
6. Usuario hace submit del formulario
7. createCabezaCirculo() envía POST al backend
8. React Query invalida caché de ['cabezas']
9. ToasterProvider muestra éxito
10. Navegación a tab "Registros"
11. CabezaCirculoCRUD.jsx recarga con nuevo registro
```

---

### 3. Usuario Exporta a Excel

```
1. Usuario hace clic en botón "Exportar a Excel"
2. Se llama a exportCabezasCirculoToExcel()
3. Backend genera archivo Excel con ExcelJS
4. Axios recibe blob (responseType: 'blob')
5. Frontend crea URL temporal del blob
6. Se dispara descarga automática
7. URL temporal se revoca
8. ToasterProvider muestra confirmación
```

---

## Próximos Pasos Recomendados

### Funcionalidades

1. ✅ Implementar dashboard con gráficas (Chart.js o Recharts)
2. ✅ Agregar filtros avanzados en tablas
3. ✅ Implementar búsqueda global
4. ✅ Agregar paginación del lado del servidor
5. ✅ Implementar ordenamiento por columnas
6. ✅ Agregar exportación a PDF

### Seguridad

1. ✅ Implementar JWT con refresh tokens
2. ✅ Mover tokens a httpOnly cookies
3. ✅ Agregar rate limiting en frontend
4. ✅ Implementar CSRF protection
5. ✅ Validación de inputs más robusta

### Rendimiento

1. ✅ Implementar code splitting por rutas
2. ✅ Lazy loading de componentes pesados
3. ✅ Optimizar imágenes con WebP
4. ✅ Implementar Service Worker para PWA
5. ✅ Optimizar bundle size con tree shaking

### UX/UI

1. ✅ Agregar skeleton loaders
2. ✅ Implementar modo oscuro completo
3. ✅ Agregar animaciones de transición
4. ✅ Mejorar accesibilidad (WCAG 2.1 AA)
5. ✅ Agregar tooltips informativos

### Testing

1. ✅ Implementar tests unitarios con Vitest
2. ✅ Tests de integración con Testing Library
3. ✅ Tests E2E con Playwright
4. ✅ Coverage mínimo del 80%

### DevOps

1. ✅ Configurar CI/CD con GitHub Actions
2. ✅ Implementar pre-commit hooks con Husky
3. ✅ Agregar linting automático
4. ✅ Configurar environments (dev, staging, prod)
5. ✅ Implementar monitoring con Sentry

---

## Conclusión

El frontend de **CrudApoyos** es una aplicación moderna, robusta y escalable construida con las mejores prácticas de React. Con una arquitectura modular, diseño responsivo, sistema de autenticación seguro, y herramientas de optimización de rendimiento, proporciona una base sólida para el crecimiento futuro del proyecto.

### Características Destacadas

✨ **Arquitectura Modular**: Componentes reutilizables y bien organizados
🎨 **Diseño Responsivo**: Mobile-first con breakpoints consistentes
🔐 **Seguridad**: Autenticación robusta con reCAPTCHA
🚀 **Rendimiento**: React Query con caché inteligente
📊 **Tablas Avanzadas**: TanStack Table con búsqueda y paginación
🎭 **Estado Global**: Context API + localStorage
🔔 **Notificaciones**: Sistema de toaster inteligente
💅 **Estilos Dinámicos**: Styled Components con temas

---

**Documentación generada el**: 2024-11-19
**Versión del Frontend**: React 19 + Vite 6
**Desarrollador**: AdanZamora182
