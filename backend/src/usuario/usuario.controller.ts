import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('registro')
  async registrar(
    @Body() datos: { usuario: Usuario; captchaToken: string },
  ): Promise<Usuario> {
    try {
      const { usuario, captchaToken } = datos;
      return await this.usuarioService.registrar(usuario, captchaToken);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Lanzar el error al cliente
      }
      throw new BadRequestException('Error al registrar usuario');
    }
  }

  @Post('login')
  async login(
    @Body() body: { usuario: string; contraseña: string },
  ): Promise<{ mensaje: string; usuario?: Usuario }> {
    const user = await this.usuarioService.login(body.usuario, body.contraseña);
    if (user) {
      return { mensaje: 'Inicio de sesión exitoso', usuario: user };
    } else {
      return { mensaje: 'Credenciales incorrectas' };
    }
  }
}