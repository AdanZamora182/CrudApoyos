import api from './axiosConfig';

// Función para buscar colonias por código postal
export const buscarColoniasPorCP = async (codigoPostal) => {
  try {
    const response = await api.get('/direcciones/buscar', { 
      params: { cp: codigoPostal } 
    });
    // Devuelve solo el arreglo de colonias
    return response.data.colonias || [];
  } catch (error) {
    console.error("Error en buscarColoniasPorCP:", error.response?.data || error.message);
    throw error;
  }
};

// Función para buscar municipio por código postal
export const buscarMunicipioPorCP = async (codigoPostal) => {
  try {
    const response = await api.get('/direcciones/buscar', { 
      params: { cp: codigoPostal } 
    });
    // Devuelve solo el municipio
    return response.data.municipio || "";
  } catch (error) {
    console.error("Error en buscarMunicipioPorCP:", error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener todas las direcciones (para desarrollo/pruebas)
export const getAllDirecciones = async () => {
  try {
    const response = await api.get('/direcciones');
    return response.data;
  } catch (error) {
    console.error("Error en getAllDirecciones:", error.response?.data || error.message);
    throw error;
  }
};
