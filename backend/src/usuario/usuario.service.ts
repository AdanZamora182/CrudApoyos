import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private readonly httpService: HttpService, // Inyectar HttpService
  ) {}

  // Método para validar el token de reCAPTCHA
  private async validarCaptcha(token: string): Promise<void> {
    const secretKey = '6LfJ6xgrAAAAAK_sKNa5aK4apc8wontQJDrnR9L4'; // Reemplaza con tu clave secreta
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

    // Validar el código de usuario
    const codigoValido = 'X3rtPOm'; // Código válido almacenado en el backend
    if (usuarioData.codigoUusuario !== codigoValido) {
      throw new BadRequestException('El código de usuario es incorrecto');
    }

    // Crear y guardar el nuevo usuario
    const nuevoUsuario = this.usuarioRepo.create(usuarioData);
    return this.usuarioRepo.save(nuevoUsuario);
  }

  // Método para iniciar sesión
  async login(usuario: string, contraseña: string): Promise<Usuario | null> {
    const user = await this.usuarioRepo.findOneBy({ usuario, contraseña });
    return user || null;
  }
}