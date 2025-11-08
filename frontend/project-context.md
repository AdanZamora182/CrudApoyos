project-context.md
# 🧠 Contexto del Proyecto — Plataforma de Administración de Apoyos

## 📘 Descripción General
Este proyecto es una **aplicación web desarrollada con React y Vite** que permite administrar los **apoyos, cabezas de círculo e integrantes** de una organización social.  
El objetivo principal es ofrecer una interfaz **segura, modular y responsiva** para gestionar información, visualizar indicadores y manejar usuarios autenticados.

---

## 🏗️ Arquitectura del Proyecto



src/
│ App.jsx
│ main.jsx
│
├── api/ # Módulos de conexión con el backend (Axios)
├── assets/ # Imágenes, íconos, logos
├── components/ # Componentes reutilizables
│ ├── forms/ # Formularios (InputField, SelectField, etc.)
│ ├── layout/ # Navbar, Sidebar, Layout general
│ ├── tables/ # DataTable, filtros y acciones
│ └── ui/ # Alertas, Cards, Modales, Spinners, Toaster
├── context/ # Contextos globales (Auth, Theme)
├── hooks/ # Hooks personalizados
├── pages/ # Vistas principales (Auth, Dashboard, CRUDs)
├── router/ # Rutas y protección (AppRouter, PrivateRoute)
└── styles/ # Estilos globales, tema y mixins


---

## ⚙️ Tecnologías Clave

| Tipo | Librerías |
|------|------------|
| Framework base | React 19, Vite 6 |
| Navegación | React Router DOM 6.30 |
| UI & diseño | React-Bootstrap, Bootstrap 5.3.8, Bootstrap Icons |
| Estilos dinámicos | Styled Components |
| Responsividad | React Responsive |
| Datos y peticiones | React Query, Axios |
| Autenticación | Context API, useAuth Hook |
| Utilidades | React Google reCAPTCHA, Lucide React, React Icons |
| Linter y Build | ESLint 9, Vite, PostCSS |

---

## 🎨 Estilos y Responsividad

- Se usa **React-Bootstrap** para el layout (`Container`, `Row`, `Col`).
- Los estilos globales viven en `styles/global.css`.
- Variables de color, tipografía y breakpoints en `styles/theme.js`.
- Mixins reutilizables en `styles/mixins.js`.
- Los archivos `*.styles.js` manejan los **styled-components** de cada vista.

Ejemplo de componente estilizado:
```jsx
import styled from 'styled-components';

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.light};
`;

🔐 Autenticación y Rutas

El sistema de autenticación se maneja con:

AuthContext.jsx (estado global del usuario y token)

useAuth.js (hook para login, logout, registro)

PrivateRoute.jsx (protege rutas autenticadas)

PublicRoute.jsx (bloquea rutas de login/registro cuando ya hay sesión)

Las páginas de autenticación se encuentran en:

src/pages/Auth/
├── Auth.styles.js
├── Login.jsx
└── Register.jsx

📡 Capa de API

Cada entidad tiene su propio módulo (authApi.js, apoyosApi.js, etc.).

Todos usan axiosConfig.js como base de configuración.

index.js exporta todas las funciones API desde un punto central.

Ejemplo:

// src/api/authApi.js
import axios from './axiosConfig.js';

export const loginUser = (credentials) => axios.post('/auth/login', credentials);
export const registerUser = (data) => axios.post('/auth/register', data);


El hook useApi() abstrae el manejo de peticiones con React Query, controlando los estados de carga y error.

🔔 Notificaciones y Toaster

Las notificaciones visuales (éxito, error, advertencia) se manejan desde:

src/components/ui/ToasterProvider.jsx


Ejemplo de uso:

import { useToaster } from '@/components/ui/ToasterProvider';

const { showToast } = useToaster();
showToast('Usuario creado correctamente', 'success');

🧩 Contextos y Hooks Personalizados
Archivo	Propósito
useAuth.js	Autenticación de usuario (login, logout, registro)
useForm.js	Manejo de formularios controlados
useResponsive.js	Comportamiento adaptativo según tamaño de pantalla
useTable.js	Paginación, orden y filtros de tablas
useApi.js	Integración con React Query para peticiones HTTP
🧭 Objetivo para GitHub Copilot

GitHub Copilot debe:

Mantener el stack y convenciones de React-Bootstrap + Styled Components.

Evitar TailwindCSS y CSS inline.

Generar componentes modulares, reutilizables y responsivos.

Respetar la arquitectura del proyecto y las rutas establecidas.

Integrarse naturalmente con los hooks, contextos y APIs existentes.

🔗 Relación con rules.md

El archivo project-context.md proporciona la visión general y el contexto técnico del proyecto, mientras que rules.md define las normas específicas que Copilot debe seguir al escribir código.
Ambos funcionan en conjunto:

project-context.md → Qué es el proyecto, cómo está estructurado y qué tecnologías usa.

rules.md → Cómo Copilot debe comportarse y escribir código dentro de ese contexto.

Copilot debe interpretar ambos para generar código coherente, consistente y alineado con los objetivos del proyecto.