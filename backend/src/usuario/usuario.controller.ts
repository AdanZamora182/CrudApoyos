import { Controller, Post, Body, BadRequestException, UnauthorizedException, Get, UseGuards, Request, Put, Delete, Param, Query } from '@nestjs/common';
import { UsuarioService, LoginResponse } from './usuario.service';
import { Usuario } from './usuario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminPanelGuard } from './admin-panel.guard';
import { AdminPanelService } from './admin-panel.service';

// Controlador que maneja las peticiones HTTP relacionadas con usuarios
@Controller('usuarios')
export class UsuarioController {
  // Inyección de dependencia del servicio de usuario y admin panel
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly adminPanelService: AdminPanelService,
  ) {}

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

  // ==================== ENDPOINTS PARA PANEL DE ADMINISTRACIÓN ====================

  // Endpoint POST para generar el token inicial de administración
  // Este endpoint debe usarse solo una vez para generar el primer archivo de autenticación
  @Post('admin/generate-token')
  async generateAdminToken(
    @Body() body: { masterKey: string },
  ): Promise<{ success: boolean; message: string }> {
    // Validar con una clave maestra (usar la misma ADMIN_PANEL_SECRET)
    const masterKey = process.env.ADMIN_PANEL_SECRET;
    
    if (body.masterKey !== masterKey) {
      throw new UnauthorizedException('Clave maestra incorrecta');
    }

    const authFile = await this.adminPanelService.generateInitialToken();
    
    return {
      success: true,
      message: `Token generado y enviado por correo. Versión: ${authFile.version}`,
    };
  }

  // Endpoint POST para validar el acceso al panel de administración
  @Post('admin/validate-access')
  async validateAdminAccess(
    @Body() body: { token: string },
  ): Promise<{ valid: boolean; expiresAt?: string; error?: string }> {
    const validation = this.adminPanelService.validateAdminToken(body.token);
    
    if (validation.valid && validation.payload) {
      return {
        valid: true,
        expiresAt: new Date(validation.payload.expiresAt).toISOString(),
      };
    }
    
    return {
      valid: false,
      error: validation.error,
    };
  }

  // Endpoint GET para listar todos los usuarios (protegido con AdminPanelGuard)
  @UseGuards(AdminPanelGuard)
  @Get('admin/listar')
  async listarUsuariosAdmin(): Promise<any[]> {
    return await this.usuarioService.listarUsuarios();
  }

  // Endpoint GET para buscar usuarios
  @UseGuards(AdminPanelGuard)
  @Get('admin/buscar')
  async buscarUsuariosAdmin(@Query('q') query: string): Promise<any[]> {
    if (!query || query.length < 2) {
      return [];
    }
    return await this.usuarioService.buscarUsuarios(query);
  }

  // Endpoint GET para obtener un usuario por ID
  @UseGuards(AdminPanelGuard)
  @Get('admin/:id')
  async obtenerUsuarioAdmin(@Param('id') id: string): Promise<any> {
    return await this.usuarioService.obtenerUsuarioPorId(parseInt(id, 10));
  }

  // Endpoint PUT para actualizar datos de un usuario
  @UseGuards(AdminPanelGuard)
  @Put('admin/:id')
  async actualizarUsuarioAdmin(
    @Param('id') id: string,
    @Body() datos: { nombre?: string; apellidos?: string; correo?: string; usuario?: string },
  ): Promise<any> {
    return await this.usuarioService.actualizarUsuario(parseInt(id, 10), datos);
  }

  // Endpoint PUT para cambiar contraseña de un usuario
  @UseGuards(AdminPanelGuard)
  @Put('admin/:id/cambiar-contraseña')
  async cambiarContraseñaAdmin(
    @Param('id') id: string,
    @Body() body: { nuevaContraseña: string },
  ): Promise<{ success: boolean; message: string }> {
    return await this.usuarioService.cambiarContraseñaAdmin(
      parseInt(id, 10),
      body.nuevaContraseña,
    );
  }

  // Endpoint DELETE para eliminar un usuario
  @UseGuards(AdminPanelGuard)
  @Delete('admin/:id')
  async eliminarUsuarioAdmin(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return await this.usuarioService.eliminarUsuario(parseInt(id, 10));
  }
}