import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard que protege rutas requiriendo un JWT válido
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Sobrescribir canActivate para agregar lógica personalizada si es necesario
  canActivate(context: ExecutionContext) {
    // Llamar al método padre para la validación JWT estándar
    return super.canActivate(context);
  }

  // Sobrescribir handleRequest para manejar errores personalizados
  handleRequest(err: any, user: any, info: any) {
    // Si hay un error o no hay usuario, lanzar excepción
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado. Por favor inicia sesión nuevamente.');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido.');
      }
      throw err || new UnauthorizedException('No autorizado. Por favor inicia sesión.');
    }
    return user;
  }
}
