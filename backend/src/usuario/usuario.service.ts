import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from './usuario.entity';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// Interface para el payload del JWT
export interface JwtPayload {
  sub: number;
  usuario: string;
  nombre: string;
  apellidos: string;
}

// Interface para la respuesta del login
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  usuario: Omit<Usuario, 'contraseña' | 'codigoUusuario'>;
  expiresIn: number;
}

// Servicio que contiene la lógica de negocio para la gestión de usuarios
@Injectable()
export class UsuarioService {
  // Inyección de dependencias: repositorio de usuario, servicio HTTP, JWT y configuración
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // Método privado para validar el token de reCAPTCHA con Google
  private async validarCaptcha(token: string): Promise<void> {
    // Obtener la clave secreta de reCAPTCHA desde las variables de entorno
    const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
      // Realizar petición a Google para validar el token de reCAPTCHA
      const response = await lastValueFrom(this.httpService.post(url));
      if (!response.data.success) {
        throw new BadRequestException('Error en la validación de reCAPTCHA');
      }
    } catch (error) {
      throw new BadRequestException('No se pudo validar el reCAPTCHA. Intenta de nuevo.');
    }
  }

  // Método para registrar un nuevo usuario en el sistema
  async registrar(usuarioData: Usuario, captchaToken: string): Promise<Usuario> {
    // Validar que se proporcionen todos los datos necesarios
    if (!usuarioData || !captchaToken) {
      throw new BadRequestException('Datos incompletos');
    }

    console.log(usuarioData); // Log para debugging
    console.log(captchaToken); // Log para debugging

    // Validar el token de reCAPTCHA antes de proceder
    await this.validarCaptcha(captchaToken);

    // Obtener y validar el código de usuario desde las variables de entorno
    const codigoValido = this.configService.get<string>('USER_CODE');
    if (usuarioData.codigoUusuario !== codigoValido) {
      throw new BadRequestException('El código de usuario es incorrecto');
    }

    // Verificar que el nombre de usuario no esté ya en uso
    const usuarioExistente = await this.usuarioRepo.findOneBy({ usuario: usuarioData.usuario });
    if (usuarioExistente) {
      throw new BadRequestException('El nombre de usuario ya está en uso. Por favor elige otro.');
    }

    // Hashear la contraseña usando bcrypt para seguridad
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(usuarioData.contraseña, saltRounds);

    // Crear y guardar el nuevo usuario con la contraseña hasheada
    const nuevoUsuario = this.usuarioRepo.create({
      ...usuarioData,
      contraseña: hashedPassword,
    });
    return this.usuarioRepo.save(nuevoUsuario);
  }

  // Método para autenticar usuarios durante el inicio de sesión
  async login(usuario: string, contraseña: string, rememberMe: boolean = false): Promise<LoginResponse | null> {
    // Buscar el usuario por nombre de usuario
    const user = await this.usuarioRepo.findOneBy({ usuario });
    if (!user) return null;

    // Comparar la contraseña proporcionada con la contraseña hasheada almacenada
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) return null;

    // Crear payload para el token JWT
    const payload: JwtPayload = {
      sub: user.id,
      usuario: user.usuario,
      nombre: user.nombre,
      apellidos: user.apellidos,
    };

    // Determinar tiempo de expiración según "recordar sesión"
    // Si rememberMe es true: 30 días, si no: 24 horas
    const expiresIn = rememberMe ? '30d' : '24h';
    const expiresInSeconds = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

    // Generar access token
    const accessToken = this.jwtService.sign(payload, { expiresIn });

    // Generar refresh token (válido por 60 días si rememberMe, 7 días si no)
    const refreshExpiresIn = rememberMe ? '60d' : '7d';
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: refreshExpiresIn }
    );

    // Retornar respuesta sin datos sensibles
    const { contraseña: _, codigoUusuario: __, ...usuarioSeguro } = user;

    return {
      accessToken,
      refreshToken,
      usuario: usuarioSeguro,
      expiresIn: expiresInSeconds,
    };
  }

  // Método para refrescar el access token usando el refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number } | null> {
    try {
      // Verificar y decodificar el refresh token
      const decoded = this.jwtService.verify(refreshToken);
      
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      // Buscar el usuario
      const user = await this.usuarioRepo.findOneBy({ id: decoded.sub });
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Crear nuevo access token
      const payload: JwtPayload = {
        sub: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });

      return {
        accessToken,
        expiresIn: 24 * 60 * 60,
      };
    } catch (error) {
      return null;
    }
  }

  // Método para validar un token y obtener el usuario
  async validateToken(token: string): Promise<Omit<Usuario, 'contraseña' | 'codigoUusuario'> | null> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usuarioRepo.findOneBy({ id: decoded.sub });
      
      if (!user) return null;

      const { contraseña: _, codigoUusuario: __, ...usuarioSeguro } = user;
      return usuarioSeguro;
    } catch (error) {
      return null;
    }
  }
}