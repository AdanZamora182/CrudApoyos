import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt'; // Importar bcrypt

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // Método para validar el token de reCAPTCHA
  private async validarCaptcha(token: string): Promise<void> {
    const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY'); // Leer del .env
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
      const response = await lastValueFrom(this.httpService.post(url));
      if (!response.data.success) {
        throw new BadRequestException('Error en la validación de reCAPTCHA');
      }
    } catch (error) {
      throw new BadRequestException('No se pudo validar el reCAPTCHA. Intenta de nuevo.');
    }
  }

  // Método para registrar un nuevo usuario
  async registrar(usuarioData: Usuario, captchaToken: string): Promise<Usuario> {
    if (!usuarioData || !captchaToken) {
      throw new BadRequestException('Datos incompletos');
    }

    console.log(usuarioData); // Verifica los datos recibidos
    console.log(captchaToken); // Verifica el token de reCAPTCHA

    // Validar el token de reCAPTCHA
    await this.validarCaptcha(captchaToken);

    // Validar el código de usuario usando variable de entorno
    const codigoValido = this.configService.get<string>('USER_CODE'); // <-- leer de .env
    if (usuarioData.codigoUusuario !== codigoValido) {
      throw new BadRequestException('El código de usuario es incorrecto');
    }

    // Verificar si el nombre de usuario ya existe
    const usuarioExistente = await this.usuarioRepo.findOneBy({ usuario: usuarioData.usuario });
    if (usuarioExistente) {
      throw new BadRequestException('El nombre de usuario ya está en uso. Por favor elige otro.');
    }

    // Hashear la contraseña antes de guardar
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(usuarioData.contraseña, saltRounds);

    // Crear y guardar el nuevo usuario con la contraseña hasheada
    const nuevoUsuario = this.usuarioRepo.create({
      ...usuarioData,
      contraseña: hashedPassword,
    });
    return this.usuarioRepo.save(nuevoUsuario);
  }

  // Método para iniciar sesión
  async login(usuario: string, contraseña: string): Promise<Usuario | null> {
    const user = await this.usuarioRepo.findOneBy({ usuario });
    if (!user) return null;

    // Comparar la contraseña hasheada
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) return null;

    return user;
  }
}