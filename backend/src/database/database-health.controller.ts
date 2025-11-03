import { Controller, Get } from '@nestjs/common';
import { DatabaseHealthService } from './database-health.service';

@Controller('health')
export class DatabaseHealthController {
  constructor(
    private readonly databaseHealthService: DatabaseHealthService,
  ) {}

  @Get('database')
  async checkDatabaseHealth() {
    return await this.databaseHealthService.getHealthStatus();
  }

  @Get()
  async checkHealth() {
    const dbHealth = await this.databaseHealthService.getHealthStatus();
    
    return {
      status: dbHealth.overall,
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth.mysql,
      },
    };
  }
}