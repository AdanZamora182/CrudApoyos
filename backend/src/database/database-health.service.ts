// src/database/database-health.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseHealthService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseHealthService.name);
  private healthCheckInterval: NodeJS.Timeout;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    // Verificar conexión inicial
    this.logger.log('🔍 Iniciando monitoreo de salud de base de datos...');
    await this.checkConnection();

    // Configurar ping periódico cada 5 minutos para mantener conexiones vivas
    this.healthCheckInterval = setInterval(async () => {
      await this.checkConnection();
    }, 5 * 60 * 1000); // 5 minutos
  }

  async onModuleDestroy() {
    // Limpiar el intervalo cuando el módulo se destruya
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.logger.log('🛑 Monitoreo de salud de base de datos detenido');
    }
  }

  private async checkConnection(): Promise<boolean> {
    try {
      // Verificar si el DataSource está inicializado
      if (!this.dataSource.isInitialized) {
        this.logger.warn('⚠️ DataSource no está inicializado');
        return await this.attemptReconnect();
      }

      // Realizar un ping simple a la base de datos
      await this.dataSource.query('SELECT 1');
      this.logger.log('✅ Conexión a la base de datos MySQL saludable');
      return true;
    } catch (error) {
      this.logger.error('❌ Fallo en la conexión a la base de datos:', error.message);
      
      // Identificar el tipo de error
      if (this.isConnectionError(error)) {
        return await this.attemptReconnect();
      }
      
      return false;
    }
  }

  private async attemptReconnect(): Promise<boolean> {
    try {
      this.logger.warn('🔄 Intentando reconectar a la base de datos...');
      
      // Si no está inicializado, intentar inicializar
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        this.logger.log('✅ Reconexión exitosa a la base de datos');
        return true;
      }
      
      // Si está inicializado pero no responde, intentar destruir y reinicializar
      await this.dataSource.destroy();
      await this.dataSource.initialize();
      this.logger.log('✅ Reconexión exitosa después de reinicialización');
      return true;
    } catch (reconnectError) {
      this.logger.error('❌ Fallo en la reconexión:', reconnectError.message);
      return false;
    }
  }

  private isConnectionError(error: any): boolean {
    const connectionErrors = [
      'ECONNRESET',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'EPIPE',
      'PROTOCOL_CONNECTION_LOST',
      'ER_SERVER_SHUTDOWN',
    ];
    
    return connectionErrors.some(errorCode => 
      error.message?.includes(errorCode) || 
      error.code === errorCode ||
      error.errno === errorCode
    );
  }

  // Método público para verificar el estado de la conexión
  async getHealthStatus(): Promise<{
    mysql: { healthy: boolean; status: string };
    overall: string;
  }> {
    const isHealthy = await this.checkConnection();
    
    return {
      mysql: {
        healthy: isHealthy,
        status: isHealthy ? 'connected' : 'disconnected',
      },
      overall: isHealthy ? 'healthy' : 'unhealthy',
    };
  }
}