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

// Función para obtener todos los apoyos
export const getApoyos = async () => {
  try {
    const response = await api.get('/apoyos');
    return response.data;
  } catch (error) {
    console.error("Error en getApoyos:", error.response?.data || error.message);
    throw error;
  }
};

// Función para buscar Cabezas de Círculo por nombre o clave electoral
export const buscarCabezasCirculo = async (query) => {
  try {
    const response = await api.get(`/cabezas-circulo/buscar`, { params: { query } });
    return response.data;
  } catch (error) {
    console.error("Error en buscarCabezasCirculo:", error.response?.data || error.message);
    throw error;
  }
};

// Función para buscar Integrantes de Círculo por nombre o clave electoral
export const buscarIntegrantesCirculo = async (query) => {
  try {
    const response = await api.get(`/integrantes-circulo`, { params: { query } });
    return response.data;
  } catch (error) {
    console.error("Error en buscarIntegrantesCirculo:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar una cabeza de círculo
export const deleteCabezaCirculo = async (id) => {
  return await api.delete(`/cabezas-circulo/${id}`);
};

// Actualizar una cabeza de círculo
export const updateCabezaCirculo = async (id, data) => {
  return await api.put(`/cabezas-circulo/${id}`, data);
};

// Eliminar un integrante de círculo
export const deleteIntegranteCirculo = async (id) => {
  return await api.delete(`/integrantes-circulo/${id}`);
};

// Actualizar un integrante de círculo
export const updateIntegranteCirculo = async (id, data) => {
  return await api.put(`/integrantes-circulo/${id}`, data);
};

// Eliminar un apoyo
export const deleteApoyo = async (id) => {
  return await api.delete(`/apoyos/${id}`);
};

// Actualizar un apoyo
export const updateApoyo = async (id, data) => {
  return await api.put(`/apoyos/${id}`, data);
};

// Enhanced API functions for TanStack Query
export const getAllCabezasCirculo = async () => {
  try {
    const response = await buscarCabezasCirculo("");
    return response.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error("Error fetching all cabezas de círculo:", error);
    throw error;
  }
};

// -----------------------------------------------------Exports para MongoDB

// Buscar colonias por código postal
export const buscarColoniasPorCP = async (codigoPostal) => {
  try {
    const response = await api.get('/direcciones/buscar', { params: { cp: codigoPostal } });
    // Devuelve solo el arreglo de colonias
    return response.data.colonias || [];
  } catch (error) {
    console.error("Error en buscarColoniasPorCP:", error.response?.data || error.message);
    throw error;
  }
};

// Buscar municipio por código postal
export const buscarMunicipioPorCP = async (codigoPostal) => {
  try {
    const response = await api.get('/direcciones/buscar', { params: { cp: codigoPostal } });
    // Devuelve solo el municipio
    return response.data.municipio || "";
  } catch (error) {
    console.error("Error en buscarMunicipioPorCP:", error.response?.data || error.message);
    throw error;
  }
};

