import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para registrar un usuario
export const registrarUsuario = async (datos) => {
  const response = await api.post('/usuarios/registro', datos);
  return response.data;
};

// Función para iniciar sesión
export const iniciarSesion = async (datos) => {
  const response = await api.post('/usuarios/login', datos);
  return response.data;
};

// Función para registrar una Cabeza de Círculo
export const createCabezaCirculo = async (datos) => {
  const response = await api.post('/cabezas-circulo', datos);
  return response.data;
};

// Función para registrar un Integrante de Círculo
export const createIntegranteCirculo = async (datos) => {
  try {
    const response = await api.post('/integrantes-circulo', datos);
    return response.data;
  } catch (error) {
    console.error("Error en createIntegranteCirculo:", error.response?.data || error.message);
    throw error; // Lanza el error para que `handleSubmit` lo maneje
  }
};

// Función para registrar un Apoyo
export const createApoyo = async (datos) => {
  try {
    const response = await api.post('/apoyos', datos);
    return response.data;
  } catch (error) {
    console.error("Error en createApoyo:", error.response?.data || error.message);
    throw error;
  }
};