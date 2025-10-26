import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import './Auth.css';
import { registrarUsuario } from '../../api';

import logoApoyos from '../../assets/logoApoyos.png';

function Register() {
  // Estado para manejar todos los datos del formulario de registro
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    codigoUsuario: ''
  });
  
  // Estados para manejar la verificación de reCAPTCHA y estado de la interfaz
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Hook de navegación para redirecciones
  const navigate = useNavigate();

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

  // Función para manejar la respuesta del reCAPTCHA
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  // Función para procesar el envío del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validar que se haya completado el reCAPTCHA
    if (!captchaToken) {
      setError('Por favor completa el reCAPTCHA');
      setLoading(false);
      return;
    }

    try {
      // Preparar los datos del usuario en el formato esperado por el backend
      const usuarioData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.email,
        usuario: formData.username,
        contraseña: formData.password,
        codigoUusuario: formData.codigoUsuario
      };

      // Enviar datos del registro al backend
      await registrarUsuario({
        usuario: usuarioData,
        captchaToken,
      });

      // Redirigir al login con parámetro de éxito
      navigate('/login?registered=true');
    } catch (err) {
      // Mostrar mensaje de error específico del backend o genérico
      const errorMessage = err.response?.data?.message || 'Error al registrar usuario. Por favor intenta de nuevo.';
      console.error("Error en registro:", err.response || err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        {/* Cabecera del formulario con logo y título */}
        <div className="auth-header">
          <div className="header-logo">
            <img src={logoApoyos} alt="Logo Apoyos" className="apoyos-logo" />
            <h1 className="title">Registro de Apoyos</h1>
          </div>
          <p className="auth-subtitle">Crea una nueva cuenta para acceder al sistema.</p>
        </div>

        {/* Mostrar mensajes de error */}
        {error && <div className="error-message">{error}</div>}

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
          {/* Fila con campos de nombre y apellidos */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">👤 Nombre(s)</label>
              <div className="input-group">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="apellidos">👥 Apellidos</label>
              <div className="input-group">
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="Apellidos"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Campo de correo electrónico */}
          <div className="form-group">
            <label htmlFor="email">📧 Correo Electrónico</label>
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Campo de nombre de usuario */}
          <div className="form-group">
            <label htmlFor="username">🙋‍♂️ Nombre de Usuario</label>
            <div className="input-group">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Fila con campos de contraseña y confirmación */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">🔐 Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  autoComplete="off"
                  required
                  className="form-control"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">🕵️ Confirmar</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmar contraseña"
                  autoComplete="off"
                  required
                  className="form-control"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Campo de código de usuario para validación */}
          <div className="form-group">
            <label htmlFor="codigoUsuario">🗝️ Código de Usuario</label>
            <div className="input-group">
              <input
                type="text"
                id="codigoUsuario"
                name="codigoUsuario"
                value={formData.codigoUsuario}
                onChange={handleChange}
                placeholder="Código de usuario"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* Verificación reCAPTCHA para seguridad */}
          <div className="form-group">
            <ReCAPTCHA
              sitekey="6LfJ6xgrAAAAAH9C59xsanFRbksatVnywbT886yA"
              onChange={handleCaptchaChange}
            />
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
                Registrando...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus-fill me-2"></i>
                Crear Cuenta
              </>
            )}
          </button>
        </form>

        {/* Enlace para ir al login */}
        <div className="auth-footer">
          <p>¿Ya tienes una cuenta? <Link to="/login" className="register-link">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;