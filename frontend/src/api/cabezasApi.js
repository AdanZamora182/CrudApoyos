import api from './axiosConfig';

// Función para registrar una Cabeza de Círculo
export const createCabezaCirculo = async (datos) => {
  const response = await api.post('/cabezas-circulo', datos);
  return response.data;
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

// Función para obtener todas las cabezas de círculo
export const getAllCabezasCirculo = async () => {
  try {
    const response = await buscarCabezasCirculo("");
    return response.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error("Error fetching all cabezas de círculo:", error);
    throw error;
  }
};

// Función para eliminar una cabeza de círculo
export const deleteCabezaCirculo = async (id) => {
  return await api.delete(`/cabezas-circulo/${id}`);
};

// Función para actualizar una cabeza de círculo
export const updateCabezaCirculo = async (id, data) => {
  return await api.put(`/cabezas-circulo/${id}`, data);
};

// Función para exportar todas las cabezas de círculo a Excel
export const exportCabezasCirculoToExcel = async () => {
  try {
    const response = await api.get('/cabezas-circulo/export/excel', {
      responseType: 'blob', // Importante para manejar archivos binarios
    });
    return response.data;
  } catch (error) {
    console.error("Error en exportCabezasCirculoToExcel:", error.response?.data || error.message);
    throw error;
  }
};
