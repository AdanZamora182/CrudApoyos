import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';

// Interface para el payload del token de admin
export interface AdminTokenPayload {
  type: 'admin_panel';
  createdAt: number;
  expiresAt: number;
}

// Interface para el contenido del archivo JSON de autenticación
export interface AdminAuthFile {
  token: string;
  createdAt: string;
  expiresAt: string;
  version: number;
}

@Injectable()
export class AdminPanelService {
  private readonly logger = new Logger(AdminPanelService.name);
  private transporter: nodemailer.Transporter;
  private currentTokenVersion: number = 1;

  constructor(private readonly configService: ConfigService) {
    // Configurar el transporter de nodemailer
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: parseInt(this.configService.get<string>('SMTP_PORT') || '587'),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  // Obtener la clave secreta para firmar tokens del panel admin
  private getAdminSecret(): string {
    return this.configService.get<string>('ADMIN_PANEL_SECRET') || 'default-admin-secret';
  }

  // Obtener el tiempo de expiración en meses
  private getExpirationMonths(): number {
    return parseInt(this.configService.get<string>('ADMIN_TOKEN_EXPIRES_MONTHS') || '4');
  }

  // Obtener el correo del administrador
  private getAdminEmail(): string {
    return this.configService.get<string>('ADMIN_EMAIL') || 'admin@example.com';
  }

  // Generar un nuevo token de autenticación para el panel admin
  generateAdminToken(): AdminAuthFile {
    const now = new Date();
    const expirationMonths = this.getExpirationMonths();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + expirationMonths);

    const payload: AdminTokenPayload = {
      type: 'admin_panel',
      createdAt: now.getTime(),
      expiresAt: expiresAt.getTime(),
    };

    // Firmar el token con la clave secreta
    const token = jwt.sign(payload, this.getAdminSecret(), {
      algorithm: 'HS256',
    });

    this.currentTokenVersion++;

    return {
      token,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      version: this.currentTokenVersion,
    };
  }

  // Validar un token del archivo JSON de autenticación
  validateAdminToken(token: string): { valid: boolean; payload?: AdminTokenPayload; error?: string } {
    try {
      const decoded = jwt.verify(token, this.getAdminSecret()) as AdminTokenPayload;

      // Verificar que sea un token de tipo admin_panel
      if (decoded.type !== 'admin_panel') {
        return { valid: false, error: 'Tipo de token inválido' };
      }

      // Verificar que no haya expirado
      if (decoded.expiresAt < Date.now()) {
        return { valid: false, error: 'Token expirado' };
      }

      return { valid: true, payload: decoded };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { valid: false, error: 'Token expirado' };
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return { valid: false, error: 'Token inválido o manipulado' };
      }
      return { valid: false, error: 'Error al validar token' };
    }
  }

  // Enviar el archivo de autenticación por correo
  async sendAuthFileByEmail(authFile: AdminAuthFile): Promise<boolean> {
    try {
      const adminEmail = this.getAdminEmail();
      const jsonContent = JSON.stringify(authFile, null, 2);
      
      const mailOptions = {
        from: this.configService.get<string>('SMTP_USER'),
        to: adminEmail,
        subject: '🔐 Nuevo archivo de autenticación - Panel de Administración',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #5c6bc0;">🔐 Nuevo Token de Acceso al Panel de Administración</h2>
            <p>Se ha generado un nuevo archivo de autenticación para acceder al panel de administración de usuarios.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>📅 Fecha de creación:</strong> ${new Date(authFile.createdAt).toLocaleString('es-MX')}</p>
              <p><strong>⏰ Fecha de expiración:</strong> ${new Date(authFile.expiresAt).toLocaleString('es-MX')}</p>
              <p><strong>🔢 Versión:</strong> ${authFile.version}</p>
            </div>
            
            <p style="color: #d32f2f;"><strong>⚠️ Importante:</strong></p>
            <ul>
              <li>Guarda este archivo de forma segura</li>
              <li>No compartas este archivo con nadie</li>
              <li>El archivo adjunto es necesario para acceder al panel</li>
              <li>Se renovará automáticamente cada ${this.getExpirationMonths()} meses</li>
            </ul>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Este es un correo automático del sistema de Registro de Apoyos.
            </p>
          </div>
        `,
        attachments: [
          {
            filename: 'admin-auth.json',
            content: jsonContent,
            contentType: 'application/json',
          },
        ],
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Archivo de autenticación enviado a ${adminEmail}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Error al enviar correo: ${error.message}`);
      return false;
    }
  }

  // Generar y enviar un nuevo token de autenticación
  async generateAndSendNewToken(): Promise<AdminAuthFile> {
    const authFile = this.generateAdminToken();
    await this.sendAuthFileByEmail(authFile);
    return authFile;
  }

  // Tarea programada: Renovar el token el primer día de cada 4 meses
  // Se ejecuta a las 8:00 AM del día 1 de enero, mayo y septiembre
  @Cron('0 8 1 1,5,9 *')
  async handleTokenRenewal() {
    this.logger.log('🔄 Iniciando renovación automática del token de admin...');
    try {
      const authFile = await this.generateAndSendNewToken();
      this.logger.log(`✅ Token renovado exitosamente. Versión: ${authFile.version}`);
    } catch (error) {
      this.logger.error(`❌ Error en la renovación automática: ${error.message}`);
    }
  }

  // Método para generar el primer token manualmente (uso inicial)
  async generateInitialToken(): Promise<AdminAuthFile> {
    this.logger.log('🔑 Generando token inicial de administración...');
    return await this.generateAndSendNewToken();
  }
}
