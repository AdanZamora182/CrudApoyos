import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha'; // Importar reCAPTCHA
import './Auth.css';
import { registrarUsuario } from '../../api'; //

import logoApoyos from '../../assets/logoApoyos.png';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    codigoUsuario: '' // Mantenemos 'codigoUsuario' aquí si es el nombre del campo en el estado
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!captchaToken) {
      setError('Por favor completa el reCAPTCHA');
      setLoading(false);
      return;
    }

    try {
      // *** INICIO DE LA CORRECCIÓN ***
      // Crea un objeto con los datos específicos del usuario que necesita el backend
      const usuarioData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.email, // Asegúrate que la entidad Usuario en NestJS tenga 'correo'
        usuario: formData.username,
        contraseña: formData.password,
        codigoUusuario: formData.codigoUsuario // Usamos 'codigoUusuario' para la propiedad que espera el backend/entidad
      };

      // Llama a la API enviando el objeto esperado por el backend
      await registrarUsuario({ //
        usuario: usuarioData, // Anida los datos del usuario bajo la clave 'usuario'
        captchaToken,        // Envía el token de captcha al mismo nivel
      });
      // *** FIN DE LA CORRECCIÓN ***

      navigate('/login?registered=true');
    } catch (err) {
      // Muestra un mensaje de error más específico si está disponible
      const errorMessage = err.response?.data?.message || 'Error al registrar usuario. Por favor intenta de nuevo.';
      console.error("Error en registro:", err.response || err); // Loguea el error completo en la consola para depuración
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="header-logo">
            <img src={logoApoyos} alt="Logo Apoyos" className="apoyos-logo" />
            <h1 className="title">Registro de Apoyos</h1>
          </div>
          <p className="auth-subtitle">Crea una nueva cuenta para acceder al sistema.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">👤 Nombre(s)</label>
              <div className="input-group">
                <input
                  type="text"
                  id="nombre"
                  name="nombre" // El 'name' debe coincidir con la clave en el estado formData
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
                  name="apellidos" // El 'name' debe coincidir con la clave en el estado formData
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="Apellidos"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">📧 Correo Electrónico</label>
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email" // El 'name' debe coincidir con la clave en el estado formData
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                autoComplete="off"
                required // Opcional, si el correo es requerido
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">🙋‍♂️ Nombre de Usuario</label>
            <div className="input-group">
              <input
                type="text"
                id="username"
                name="username" // El 'name' debe coincidir con la clave en el estado formData
                value={formData.username}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">🔐 Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password" // El 'name' debe coincidir con la clave en el estado formData
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  autoComplete="off"
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

            <div className="form-group">
              <label htmlFor="confirmPassword">🕵️ Confirmar</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword" // El 'name' debe coincidir con la clave en el estado formData
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmar contraseña"
                  autoComplete="off"
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onMouseDown={() => setShowConfirmPassword(true)}
                  onMouseUp={() => setShowConfirmPassword(false)}
                  onMouseLeave={() => setShowConfirmPassword(false)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="codigoUsuario">🗝️ Código de Usuario</label>
            <div className="input-group">
              <input
                type="text"
                id="codigoUsuario"
                name="codigoUsuario" // El 'name' debe coincidir con la clave en el estado formData ('codigoUsuario')
                value={formData.codigoUsuario}
                onChange={handleChange}
                placeholder="Código de usuario"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <ReCAPTCHA
              sitekey="6LfJ6xgrAAAAAH9C59xsanFRbksatVnywbT886yA" // Clave del sitio de reCAPTCHA
              onChange={handleCaptchaChange}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes una cuenta? <Link to="/login" className="register-link">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;