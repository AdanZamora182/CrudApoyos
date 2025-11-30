import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Función para obtener el token del storage apropiado
const getToken = () => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;
  return storage.getItem('accessToken');
};

// Función para obtener el refresh token
const getRefreshToken = () => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;
  return storage.getItem('refreshToken');
};

// Función para guardar el nuevo access token
const saveAccessToken = (token, expiresIn) => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('accessToken', token);
  
  if (expiresIn) {
    const expiryTime = Date.now() + (expiresIn * 1000);
    storage.setItem('tokenExpiry', expiryTime.toString());
  }
};

// Función para limpiar los datos de autenticación
const clearAuthData = () => {
  const keys = ['accessToken', 'refreshToken', 'user', 'rememberMe', 'tokenExpiry'];
  keys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

// Variable para evitar múltiples intentos de refresh simultáneos
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor para requests (agregar token si existe)
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses (manejar errores y refresh de token)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si es un error 401 y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // No intentar refresh si es una petición de login o refresh-token
      if (originalRequest.url?.includes('/login') || originalRequest.url?.includes('/refresh-token')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Si ya está refrescando, añadir a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuthData();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('http://localhost:3000/usuarios/refresh-token', {
          refreshToken,
        });

        const { accessToken, expiresIn } = response.data;
        saveAccessToken(accessToken, expiresIn);
        
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthData();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
