import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';
import { iniciarSesion } from '../../api';

import logoApoyos from '../../assets/logoApoyos.png';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('registered') === 'true') {
      setSuccessMessage('✅ Usuario registrado exitosamente. Ahora puedes iniciar sesión.');

      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await iniciarSesion({
        usuario: formData.username,
        contraseña: formData.password,
      });

      if (response.usuario) {
        localStorage.setItem('user', JSON.stringify(response.usuario));
        navigate('/menu');
      } else {
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
        <div className="auth-header">
          <div className="header-logo">
            <img src={logoApoyos} alt="Logo Apoyos" className="apoyos-logo" />
            <h1 className="title">Registro de Apoyos</h1>
          </div>
          <p className="auth-subtitle">Bienvenido. Por favor, ingresa tus credenciales para acceder.</p>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
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
              />
            </div>
          </div>

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
              />
              <button 
                type="button" 
                className="password-toggle"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="remember-me">
            <label className="checkbox-container">
              <input type="checkbox" name="remember" />
              <span className="checkmark"></span>
              Recordar mi sesión
            </label>
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Cargando...' : '🚪 Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿No tienes una cuenta? <Link to="/register" className="register-link">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
