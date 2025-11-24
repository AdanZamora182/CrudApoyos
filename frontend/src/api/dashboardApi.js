import api from './axiosConfig';

// Función para obtener todas las estadísticas del dashboard
export const getDashboardStats = async (year) => {
  try {
    const currentYear = year || new Date().getFullYear();
    const response = await api.get(`/dashboard/stats?year=${currentYear}`);
    return response.data;
  } catch (error) {
    console.error('Error en getDashboardStats:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener el total de cabezas de círculo
export const getCabezasCirculoCount = async () => {
  try {
    const response = await api.get('/dashboard/stats/cabezas-circulo');
    return response.data;
  } catch (error) {
    console.error('Error en getCabezasCirculoCount:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener el total de integrantes de círculo
export const getIntegrantesCirculoCount = async () => {
  try {
    const response = await api.get('/dashboard/stats/integrantes-circulo');
    return response.data;
  } catch (error) {
    console.error('Error en getIntegrantesCirculoCount:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener estadísticas de apoyos del año
export const getApoyosYearStats = async (year) => {
  try {
    const currentYear = year || new Date().getFullYear();
    const response = await api.get(`/dashboard/stats/apoyos?year=${currentYear}`);
    return response.data;
  } catch (error) {
    console.error('Error en getApoyosYearStats:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener cantidad de apoyos entregados por mes
export const getApoyosByMonth = async (year) => {
  try {
    const currentYear = year || new Date().getFullYear();
    const response = await api.get(`/dashboard/charts/apoyos-por-mes?year=${currentYear}`);
    return response.data;
  } catch (error) {
    console.error('Error en getApoyosByMonth:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener distribución de apoyos por tipo
export const getApoyosByType = async (year, month) => {
  try {
    const currentYear = year || new Date().getFullYear();
    let url = `/dashboard/charts/apoyos-por-tipo?year=${currentYear}`;
    if (month) {
      url += `&month=${month}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error en getApoyosByType:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener top colonias con más apoyos
export const getTopColoniasMasApoyos = async (year, month) => {
  try {
    const currentYear = year || new Date().getFullYear();
    let url = `/dashboard/tables/top-colonias-mas-apoyos?year=${currentYear}`;
    if (month) {
      url += `&month=${month}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error en getTopColoniasMasApoyos:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener top colonias con menos apoyos
export const getTopColoniasMenosApoyos = async (year, month) => {
  try {
    const currentYear = year || new Date().getFullYear();
    let url = `/dashboard/tables/top-colonias-menos-apoyos?year=${currentYear}`;
    if (month) {
      url += `&month=${month}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error en getTopColoniasMenosApoyos:', error.response?.data || error.message);
    throw error;
  }
};
