import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import ReCAPTCHA from 'react-google-recaptcha';
import { registrarUsuario } from '../../api/authApi';
import { useToaster } from '../../components/ui/ToasterProvider';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../styles/theme';
import Button from '../../components/ui/Button';
import logoApoyos from '../../assets/logoApoyos.png';
import {
  AuthContainer,
  AuthCard,
  LogoPanel,
  Logo,
  LogoTitle,
  LogoSubtitle,
  FormPanel,
  FormHeader,
  FormTitle,
  FormSubtitle,
  FormRow,
  FormGroup,
  Label,
  InputGroup,
  Input,
  PasswordToggle,
  Footer,
  StyledLink
} from './Auth.styles.jsx';

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
  
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { showSuccess, showError } = useToaster();
  const { isAuthenticated } = useAuth();

  // Redirección automática si ya hay una sesión activa
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/menu', { replace: true });
      return;
    }
  }, [isAuthenticated, navigate]);

  // No renderizar nada si hay sesión activa (mientras redirige)
  if (isAuthenticated()) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      showError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!captchaToken) {
      showError('Por favor completa el reCAPTCHA');
      setLoading(false);
      return;
    }

    try {
      const usuarioData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.email,
        usuario: formData.username,
        contraseña: formData.password,
        codigoUusuario: formData.codigoUsuario
      };

      await registrarUsuario({
        usuario: usuarioData,
        captchaToken,
      });

      showSuccess('Cuenta creada exitosamente. Redirigiendo al login...', 3000);
      
      setTimeout(() => {
        navigate('/login?registered=true');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al registrar usuario. Por favor intenta de nuevo.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthContainer>
        <AuthCard>
          {/* Panel izquierdo con logo y branding */}
          <LogoPanel>
            <Logo src={logoApoyos} alt="Logo Apoyos" />
            <LogoTitle>Registro de Apoyos</LogoTitle>
            <LogoSubtitle>Únete a nuestro sistema de gestión</LogoSubtitle>
          </LogoPanel>

          {/* Panel derecho con formulario */}
          <FormPanel>
            <FormHeader>
              <FormTitle>Crear cuenta</FormTitle>
              <FormSubtitle>Completa tus datos para registrarte</FormSubtitle>
            </FormHeader>

            <form onSubmit={handleSubmit} autoComplete="off">
              <FormRow>
                <FormGroup>
                  <Label htmlFor="nombre">Nombre(s)</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      autoComplete="new-password"
                      required
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      placeholder="Tus apellidos"
                      autoComplete="new-password"
                      required
                    />
                  </InputGroup>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="email">Correo Electrónico</Label>
                <InputGroup>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    autoComplete="off"
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="username">Nombre de Usuario</Label>
                <InputGroup>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Elige un nombre de usuario"
                    autoComplete="off"
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="password">Contraseña</Label>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Crea una contraseña"
                      autoComplete="off"
                      required
                      $hasButton /* Cambiar hasButton por $hasButton */
                    />
                    <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </PasswordToggle>
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirma tu contraseña"
                      autoComplete="off"
                      required
                      $hasButton /* Cambiar hasButton por $hasButton */
                    />
                    <PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </PasswordToggle>
                  </InputGroup>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="codigoUsuario">Código de Usuario</Label>
                <InputGroup>
                  <Input
                    type="text"
                    id="codigoUsuario"
                    name="codigoUsuario"
                    value={formData.codigoUsuario}
                    onChange={handleChange}
                    placeholder="Ingresa tu código de acceso"
                    autoComplete="new-password"
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <ReCAPTCHA
                  sitekey="6LfJ6xgrAAAAAH9C59xsanFRbksatVnywbT886yA"
                  onChange={handleCaptchaChange}
                />
              </FormGroup>

              <Button
                type="submit"
                loading={loading}
                icon="bi bi-person-plus-fill"
              >
                Crear Cuenta
              </Button>
            </form>

            <Footer>
              <p>¿Ya tienes una cuenta? <StyledLink to="/login">Inicia sesión aquí</StyledLink></p>
            </Footer>
          </FormPanel>
        </AuthCard>
      </AuthContainer>
    </ThemeProvider>
  );
}

export default Register;