import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';

@Injectable()
export class AdminPanelGuard implements CanActivate {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Obtener el token del header Authorization
    const authHeader = request.headers['authorization'];
    
    if (!authHeader) {
      throw new UnauthorizedException('Token de administración no proporcionado');
    }

    // El token debe venir en formato "AdminToken <token>"
    const [type, token] = authHeader.split(' ');
    
    if (type !== 'AdminToken' || !token) {
      throw new UnauthorizedException('Formato de token inválido. Use: AdminToken <token>');
    }

    // Validar el token
    const validation = this.adminPanelService.validateAdminToken(token);
    
    if (!validation.valid) {
      throw new UnauthorizedException(validation.error || 'Token de administración inválido');
    }

    // Agregar información del token al request
    request.adminToken = validation.payload;
    
    return true;
  }
}
