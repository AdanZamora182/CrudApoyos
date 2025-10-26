import api from './axiosConfig';

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

// Función para eliminar un integrante de círculo
export const deleteIntegranteCirculo = async (id) => {
  return await api.delete(`/integrantes-circulo/${id}`);
};

// Función para actualizar un integrante de círculo
export const updateIntegranteCirculo = async (id, data) => {
  return await api.put(`/integrantes-circulo/${id}`, data);
};
