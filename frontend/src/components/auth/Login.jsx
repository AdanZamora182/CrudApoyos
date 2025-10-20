import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';
import { iniciarSesion } from '../../api';

import logoApoyos from '../../assets/logoApoyos.png';

function Login() {
  // Estado para manejar los datos del formulario de login
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // Estados para manejar mensajes y estados de la interfaz
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Hooks de navegación y ubicación para redirecciones
  const navigate = useNavigate();
  const location = useLocation();

  // Efecto para mostrar mensaje de éxito cuando el usuario se registra correctamente
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('registered') === 'true') {
      setSuccessMessage('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');

      // Limpiar mensaje de éxito después de 8 segundos
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  // Efecto para limpiar automáticamente los mensajes de error después de 8 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para alternar la visibilidad de la contraseña
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Función para procesar el envío del formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Llamar a la API para autenticar al usuario
      const response = await iniciarSesion({
        usuario: formData.username,
        contraseña: formData.password,
      });

      // Si la autenticación es exitosa, guardar datos y redirigir
      if (response.usuario) {
        localStorage.setItem('user', JSON.stringify(response.usuario));
        navigate('/menu');
      } else {
        // Mostrar mensaje de error si las credenciales son incorrectas
        setError(response.mensaje);
      }
    } catch (err) {
      setError('❌ Error al iniciar sesión. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Cabecera del formulario con logo y título */}
        <div className="auth-header">
          <div className="header-logo">
            <img src={logoApoyos} alt="Logo Apoyos" className="apoyos-logo" />
            <h1 className="title">Registro de Apoyos</h1>
          </div>
          <p className="auth-subtitle">Bienvenido. Por favor, ingresa tus credenciales para acceder.</p>
        </div>

        {/* Mostrar mensajes de éxito y error */}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit}>
          {/* Campo de nombre de usuario */}
          <div className="form-group">
            <label htmlFor="username">👤 Usuario</label>
            <div className="input-group">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingresa tu nombre de usuario"
                required
                autoComplete="off"
              />
            </div>
          </div>

          {/* Campo de contraseña con opción de mostrar/ocultar */}
          <div className="form-group">
            <label htmlFor="password">🔒 Contraseña</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
                className="form-control"
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleTogglePassword}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>
          </div>

          {/* Checkbox para recordar sesión */}
          <div className="remember-me">
            <label className="checkbox-container">
              <input type="checkbox" name="remember" />
              <span className="checkmark"></span>
              Recordar mi sesión
            </label>
          </div>

          {/* Botón de envío del formulario */}
          <button
            type="submit"
            className="auth-button d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* Enlace para ir al registro */}
        <div className="auth-footer">
          <p>¿No tienes una cuenta? <Link to="/register" className="register-link">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;

