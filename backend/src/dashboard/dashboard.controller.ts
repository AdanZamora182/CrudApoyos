import { Controller, Get, Query, ParseIntPipe, Optional } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

// Pipe personalizado para parsear parámetros opcionales
const OptionalParseIntPipe = new ParseIntPipe({ optional: true });

// Controlador que maneja las peticiones HTTP relacionadas con el dashboard
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // Endpoint GET para obtener todas las estadísticas del dashboard
  @Get('stats')
  async getDashboardStats(
    @Query('year', OptionalParseIntPipe) year?: number,
  ) {
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
  async getApoyosStats(
    @Query('year', OptionalParseIntPipe) year?: number,
  ): Promise<{ total: number; promedio: number }> {
    const currentYear = year || new Date().getFullYear();
    const total = await this.dashboardService.getApoyosTotalByYear(currentYear);
    const promedio = await this.dashboardService.getApoyosMonthlyAverage(currentYear);
    
    return { total, promedio };
  }

  // Endpoint GET para obtener cantidad de apoyos por mes
  @Get('charts/apoyos-por-mes')
  async getApoyosByMonth(
    @Query('year', OptionalParseIntPipe) year?: number,
  ) {
    return await this.dashboardService.getApoyosByMonth(year);
  }

  // Endpoint GET para obtener distribución de apoyos por tipo
  // Si no se especifica month, retorna datos de todos los meses del año (hasta el mes actual si es el año en curso)
  @Get('charts/apoyos-por-tipo')
  async getApoyosByType(
    @Query('year', OptionalParseIntPipe) year?: number,
    @Query('month', OptionalParseIntPipe) month?: number,
  ) {
    return await this.dashboardService.getApoyosByType(year, month);
  }

  // Endpoint GET para obtener top colonias con más apoyos
  // Si no se especifica month, retorna datos de todos los meses del año (hasta el mes actual si es el año en curso)
  @Get('tables/top-colonias-mas-apoyos')
  async getTopColoniasMasApoyos(
    @Query('year', OptionalParseIntPipe) year?: number,
    @Query('month', OptionalParseIntPipe) month?: number,
  ) {
    return await this.dashboardService.getTopColoniasMasApoyos(year, month);
  }

  // Endpoint GET para obtener top colonias con menos apoyos
  // Si no se especifica month, retorna datos de todos los meses del año (hasta el mes actual si es el año en curso)
  @Get('tables/top-colonias-menos-apoyos')
  async getTopColoniasMenosApoyos(
    @Query('year', OptionalParseIntPipe) year?: number,
    @Query('month', OptionalParseIntPipe) month?: number,
  ) {
    return await this.dashboardService.getTopColoniasMenosApoyos(year, month);
  }
}
