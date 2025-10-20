import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

// Controlador que maneja las peticiones HTTP relacionadas con usuarios
@Controller('usuarios')
export class UsuarioController {
  // Inyección de dependencia del servicio de usuario
  constructor(private readonly usuarioService: UsuarioService) {}

  // Endpoint POST para registrar un nuevo usuario en el sistema
  @Post('registro')
  async registrar(
    @Body() datos: { usuario: Usuario; captchaToken: string },
  ): Promise<Usuario> {
    try {
      const { usuario, captchaToken } = datos;
      return await this.usuarioService.registrar(usuario, captchaToken);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Arrojar el error específico al cliente
      }
      throw new BadRequestException('Error al registrar usuario');
    }
  }

  // Endpoint POST para autenticar usuarios (inicio de sesión)
  @Post('login')
  async login(
    @Body() body: { usuario: string; contraseña: string },
  ): Promise<{ mensaje: string; usuario?: Usuario }> {
    // Intentar autenticar al usuario con las credenciales proporcionadas
    const user = await this.usuarioService.login(body.usuario, body.contraseña);
    if (user) {
      return { mensaje: 'Inicio de sesión exitoso', usuario: user };
    } else {
      return { mensaje: 'Credenciales incorrectas' };
    }
  }
}