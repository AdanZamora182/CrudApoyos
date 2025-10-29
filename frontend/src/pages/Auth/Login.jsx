import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { iniciarSesion } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { useToaster } from '../../components/ui/ToasterProvider';
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
  FormGroup,
  Label,
  InputGroup,
  Input,
  PasswordToggle,
  RememberMe,
  CheckboxLabel,
  Footer,
  StyledLink
} from './Auth.styles';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToaster();

  // Redirección automática si ya hay una sesión activa
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/menu', { replace: true });
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Solo ejecutar si no hay sesión activa
    if (!isAuthenticated()) {
      // Mostrar mensaje de registro exitoso si viene de register
      const queryParams = new URLSearchParams(location.search);
      if (queryParams.get('registered') === 'true') {
        // Usar un timeout más largo para asegurar que el componente esté montado
        const timer = setTimeout(() => {
          showSuccess('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
          // Limpiar el parámetro de la URL para evitar que se muestre de nuevo
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [location.search, showSuccess, isAuthenticated]);

  // No renderizar nada si hay sesión activa (mientras redirige)
  if (isAuthenticated()) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await iniciarSesion({
        usuario: formData.username,
        contraseña: formData.password,
      });

      if (response.usuario) {
        login(response.usuario);
        showSuccess('Inicio de sesión exitoso. Redirigiendo...', 3000);
        setTimeout(() => {
          navigate('/menu');
        }, 1000);
      } else {
        // Mostrar mensaje específico del servidor o mensaje por defecto
        const errorMessage = response.mensaje || 'Credenciales incorrectas';
        showError(errorMessage);
      }
    } catch (err) {
      console.error('Error en login:', err);
      
      // Determinar el mensaje de error apropiado
      let errorMessage = 'Error al iniciar sesión. Por favor intenta de nuevo.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
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
            <LogoSubtitle>Sistema de Gestión</LogoSubtitle>
          </LogoPanel>

          {/* Panel derecho con formulario */}
          <FormPanel>
            <FormHeader>
              <FormTitle>Bienvenido de nuevo</FormTitle>
              <FormSubtitle>Ingresa tus credenciales para continuar</FormSubtitle>
            </FormHeader>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="username">Nombre de Usuario</Label>
                <InputGroup>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ingresa tu usuario"
                    required
                    autoComplete="off"
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Contraseña</Label>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    required
                    $hasButton
                  />
                  <PasswordToggle type="button" onClick={handleTogglePassword}>
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </PasswordToggle>
                </InputGroup>
              </FormGroup>

              <RememberMe>
                <CheckboxLabel>
                  <input type="checkbox" name="remember" />
                  Recordar sesión
                </CheckboxLabel>
              </RememberMe>

              <Button
                type="submit"
                loading={loading}
                icon="bi bi-box-arrow-in-right"
              >
                Iniciar Sesión
              </Button>
            </form>

            <Footer>
              <p>¿No tienes una cuenta? <StyledLink to="/register">Regístrate aquí</StyledLink></p>
            </Footer>
          </FormPanel>
        </AuthCard>
      </AuthContainer>
    </ThemeProvider>
  );
}

export default Login;

