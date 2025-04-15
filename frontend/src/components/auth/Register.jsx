import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha'; // Importar reCAPTCHA
import './Auth.css';
import { registrarUsuario } from '../../api';

import logoApoyos from '../../assets/logoApoyos.png';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    codigoUsuario: ''
  });
  const [captchaToken, setCaptchaToken] = useState(null); // Estado para el token de reCAPTCHA
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    setCaptchaToken(token); // Guardar el token generado por reCAPTCHA
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
      await registrarUsuario({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.email,
        usuario: formData.username,
        contraseña: formData.password,
        codigoUusuario: formData.codigoUsuario,
        captchaToken, // Enviar el token al backend
      });

      navigate('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario. Por favor intenta de nuevo.');
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
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  autoComplete="off"
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
                  autoComplete="off"
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                autoComplete="off"
                required
              />
            </div>
          </div>

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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">🔐 Contraseña</label>
              <div className="input-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">🕵️ Confirmar</label>
              <div className="input-group">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmar contraseña"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          </div>

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
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <ReCAPTCHA
              sitekey="6LfJ6xgrAAAAAH9C59xsanFRbksatVnywbT886yA" // Reemplaza con tu clave del sitio
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