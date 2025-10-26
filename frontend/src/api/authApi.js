import api from './axiosConfig';

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
