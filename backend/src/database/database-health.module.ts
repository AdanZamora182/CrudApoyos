import { Module, Global } from '@nestjs/common';
import { DatabaseHealthService } from './database-health.service';
import { DatabaseHealthController } from './database-health.controller';

// Hacer el módulo global para que esté disponible en toda la aplicación
@Global()
@Module({
  controllers: [DatabaseHealthController], // Controlador opcional para endpoints de health
  providers: [DatabaseHealthService],
  exports: [DatabaseHealthService],
})
export class DatabaseHealthModule {}