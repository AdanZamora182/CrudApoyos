import { Injectable, BadRequestException } from '@nestjs/common'; // Eliminar HttpService de aquí
import { HttpService } from '@nestjs/axios'; // Importar HttpService desde @nestjs/axios
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private readonly httpService: HttpService, // Inyectar HttpService
  ) {}

  private async validarCaptcha(token: string): Promise<void> {
    const secretKey = '6LfJ6xgrAAAAAK_sKNa5aK4apc8wontQJDrnR9L4'; // Reemplaza con tu clave secreta
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await this.httpService.post(url).toPromise();
    if (!response.data.success) {
      throw new BadRequestException('Error en la validación de reCAPTCHA');
    }
  }

  async registrar(usuarioData: Usuario, captchaToken: string): Promise<Usuario> {
    console.log(usuarioData); // Verifica los datos recibidos
    console.log(captchaToken); // Verifica el token de reCAPTCHA
  
    // Validar el token de reCAPTCHA
    await this.validarCaptcha(captchaToken);
  
    // Validar el código de usuario
    const codigoValido = 'X3rtPOm'; // Código válido almacenado en el backend
    if (usuarioData.codigoUusuario !== codigoValido) {
      throw new BadRequestException('El código de usuario es incorrecto');
    }
  
    const nuevoUsuario = this.usuarioRepo.create(usuarioData);
    return this.usuarioRepo.save(nuevoUsuario);
  }

  async login(usuario: string, contraseña: string): Promise<Usuario | null> {
    const user = await this.usuarioRepo.findOneBy({ usuario, contraseña });
    return user || null;
  }
}