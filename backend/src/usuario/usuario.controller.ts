import { Controller, Post, Body, BadRequestException, UnauthorizedException, Get, UseGuards, Request } from '@nestjs/common';
import { UsuarioService, LoginResponse } from './usuario.service';
import { Usuario } from './usuario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    @Body() body: { usuario: string; contraseña: string; rememberMe?: boolean },
  ): Promise<{ mensaje: string; accessToken?: string; refreshToken?: string; usuario?: Omit<Usuario, 'contraseña' | 'codigoUusuario'>; expiresIn?: number }> {
    // Intentar autenticar al usuario con las credenciales proporcionadas
    const result = await this.usuarioService.login(body.usuario, body.contraseña, body.rememberMe || false);
    
    if (result) {
      return { 
        mensaje: 'Inicio de sesión exitoso', 
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        usuario: result.usuario,
        expiresIn: result.expiresIn,
      };
    } else {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
  }

  // Endpoint POST para refrescar el token de acceso
  @Post('refresh-token')
  async refreshToken(
    @Body() body: { refreshToken: string },
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const result = await this.usuarioService.refreshToken(body.refreshToken);
    
    if (result) {
      return result;
    } else {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }
  }

  // Endpoint GET para validar el token actual y obtener datos del usuario
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateToken(@Request() req): Promise<{ valid: boolean; usuario: any }> {
    return {
      valid: true,
      usuario: req.user,
    };
  }

  // Endpoint GET protegido para obtener el perfil del usuario actual
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async getPerfil(@Request() req): Promise<any> {
    return req.user;
  }
}