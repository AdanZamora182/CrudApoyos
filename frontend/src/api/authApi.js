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

// Función para refrescar el token de acceso
export const refrescarToken = async (refreshToken) => {
  const response = await api.post('/usuarios/refresh-token', { refreshToken });
  return response.data;
};

// Función para validar el token actual
export const validarToken = async () => {
  const response = await api.get('/usuarios/validate');
  return response.data;
};

// Función para obtener el perfil del usuario actual
export const obtenerPerfil = async () => {
  const response = await api.get('/usuarios/perfil');
  return response.data;
};
