import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

// Controlador que maneja las peticiones HTTP relacionadas con el dashboard
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // Endpoint GET para obtener todas las estadísticas del dashboard
  @Get('stats')
  async getDashboardStats(@Query('year', ParseIntPipe) year?: number) {
    return await this.dashboardService.getDashboardStats(year);
  }

  // Endpoint GET para obtener el total de cabezas de círculo
  @Get('stats/cabezas-circulo')
  async getCabezasCirculoCount(): Promise<{ total: number }> {
    const total = await this.dashboardService.getCabezasCirculoCount();
    return { total };
  }

  // Endpoint GET para obtener el total de integrantes de círculo
  @Get('stats/integrantes-circulo')
  async getIntegrantesCirculoCount(): Promise<{ total: number }> {
    const total = await this.dashboardService.getIntegrantesCirculoCount();
    return { total };
  }

  // Endpoint GET para obtener estadísticas de apoyos del año
  @Get('stats/apoyos')
  async getApoyosStats(@Query('year', ParseIntPipe) year?: number): Promise<{ total: number; promedio: number }> {
    const currentYear = year || new Date().getFullYear();
    const total = await this.dashboardService.getApoyosTotalByYear(currentYear);
    const promedio = await this.dashboardService.getApoyosMonthlyAverage(currentYear);
    
    return { total, promedio };
  }

  // Endpoint GET para obtener cantidad de apoyos por mes
  @Get('charts/apoyos-por-mes')
  async getApoyosByMonth(@Query('year', ParseIntPipe) year?: number) {
    return await this.dashboardService.getApoyosByMonth(year);
  }

  // Endpoint GET para obtener distribución de apoyos por tipo
  @Get('charts/apoyos-por-tipo')
  async getApoyosByType(
    @Query('year', ParseIntPipe) year?: number,
    @Query('month', ParseIntPipe) month?: number,
  ) {
    return await this.dashboardService.getApoyosByType(year, month);
  }

  // Endpoint GET para obtener top colonias con más apoyos
  @Get('tables/top-colonias-mas-apoyos')
  async getTopColoniasMasApoyos(
    @Query('year', ParseIntPipe) year?: number,
    @Query('month', ParseIntPipe) month?: number,
  ) {
    return await this.dashboardService.getTopColoniasMasApoyos(year, month);
  }

  // Endpoint GET para obtener top colonias con menos apoyos
  @Get('tables/top-colonias-menos-apoyos')
  async getTopColoniasMenosApoyos(
    @Query('year', ParseIntPipe) year?: number,
    @Query('month', ParseIntPipe) month?: number,
  ) {
    return await this.dashboardService.getTopColoniasMenosApoyos(year, month);
  }
}
