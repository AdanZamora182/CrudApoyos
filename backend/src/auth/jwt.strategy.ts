import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Interface que define la estructura del payload del JWT
export interface JwtPayload {
  sub: number;       // ID del usuario
  usuario: string;   // Nombre de usuario
  nombre: string;    // Nombre completo
  apellidos: string; // Apellidos
  iat?: number;      // Timestamp de emisión
  exp?: number;      // Timestamp de expiración
}

// Estrategia de autenticación JWT usando Passport
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // Extrae el token del header Authorization con formato Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // No ignorar la expiración del token
      ignoreExpiration: false,
      // Clave secreta para validar el token
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey',
    });
  }

  // Método llamado después de que el token es validado
  // El payload decodificado se pasa automáticamente
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Verificar que el payload tenga los campos necesarios
    if (!payload.sub || !payload.usuario) {
      throw new UnauthorizedException('Token inválido');
    }
    
    // Retorna el payload que estará disponible en req.user
    return {
      sub: payload.sub,
      usuario: payload.usuario,
      nombre: payload.nombre,
      apellidos: payload.apellidos,
    };
  }
}
