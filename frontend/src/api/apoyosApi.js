import api from './axiosConfig';

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

// Función para eliminar un apoyo
export const deleteApoyo = async (id) => {
  return await api.delete(`/apoyos/${id}`);
};

// Función para actualizar un apoyo
export const updateApoyo = async (id, data) => {
  return await api.put(`/apoyos/${id}`, data);
};
