import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CabezaCirculo } from '../cabeza-circulo/cabeza-circulo.entity';
import { IntegranteCirculo } from '../integrante-circulo/integrante-circulo.entity';
import { Apoyo } from '../apoyo/apoyo.entity';

// Servicio que contiene la lógica de negocio para el dashboard
@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(CabezaCirculo)
    private readonly cabezaCirculoRepo: Repository<CabezaCirculo>,
    @InjectRepository(IntegranteCirculo)
    private readonly integranteCirculoRepo: Repository<IntegranteCirculo>,
    @InjectRepository(Apoyo)
    private readonly apoyoRepo: Repository<Apoyo>,
  ) {}

  // Método para obtener el total de cabezas de círculo
  async getCabezasCirculoCount(): Promise<number> {
    return await this.cabezaCirculoRepo.count();
  }

  // Método para obtener el total de integrantes de círculo
  async getIntegrantesCirculoCount(): Promise<number> {
    return await this.integranteCirculoRepo.count();
  }

  // Método para obtener el total de apoyos del año (suma de cantidad)
  async getApoyosTotalByYear(year: number): Promise<number> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    
    const result = await this.apoyoRepo
      .createQueryBuilder('apoyo')
      .select('SUM(apoyo.cantidad)', 'total')
      .where('apoyo.fechaEntrega >= :startDate', { startDate })
      .andWhere('apoyo.fechaEntrega <= :endDate', { endDate })
      .getRawOne();
    
    return result?.total ? parseInt(result.total, 10) : 0;
  }

  // Método para obtener el promedio mensual de apoyos (hasta el mes actual)
  async getApoyosMonthlyAverage(year: number): Promise<number> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // Mes actual (1-12)
    
    // Si el año solicitado es el actual, usar el mes actual
    // Si es un año pasado, usar 12 meses
    const monthsToConsider = year === currentYear ? currentMonth : 12;
    
    const total = await this.getApoyosTotalByYear(year);
    
    // Retornar el promedio truncado sin decimales
    return total > 0 ? Math.floor(total / monthsToConsider) : 0;
  }

  // Método para obtener todas las estadísticas del dashboard (optimizado)
  async getDashboardStats(year?: number): Promise<{
    cabezasCirculo: number;
    integrantesCirculo: number;
    apoyosTotal: number;
    apoyosPromedio: number;
  }> {
    const currentYear = year || new Date().getFullYear();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const monthsToConsider = currentYear === now.getFullYear() ? currentMonth : 12;

    // Ejecutar todas las consultas en paralelo (sin duplicar la de apoyos)
    const [cabezasCirculo, integrantesCirculo, apoyosTotal] = await Promise.all([
      this.getCabezasCirculoCount(),
      this.getIntegrantesCirculoCount(),
      this.getApoyosTotalByYear(currentYear),
    ]);

    // Calcular promedio sin hacer otra consulta
    const apoyosPromedio = apoyosTotal > 0 ? Math.floor(apoyosTotal / monthsToConsider) : 0;

    return {
      cabezasCirculo,
      integrantesCirculo,
      apoyosTotal,
      apoyosPromedio,
    };
  }

  // Método para obtener cantidad de apoyos entregados por mes del año actual
  async getApoyosByMonth(year?: number): Promise<{ mes: string; cantidad: number }[]> {
    const currentYear = year || new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

    const result = await this.apoyoRepo
      .createQueryBuilder('apoyo')
      .select('MONTH(apoyo.fechaEntrega)', 'mes')
      .addSelect('SUM(apoyo.cantidad)', 'cantidad')
      .where('apoyo.fechaEntrega >= :startDate', { startDate })
      .andWhere('apoyo.fechaEntrega <= :endDate', { endDate })
      .groupBy('MONTH(apoyo.fechaEntrega)')
      .orderBy('mes', 'ASC')
      .getRawMany();

    // Nombres de los meses en español
    const mesesNombres = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Crear un objeto con todos los meses inicializados en 0
    const mesesData = mesesNombres.map((nombre, index) => ({
      mes: nombre,
      cantidad: 0,
      numeroMes: index + 1
    }));

    // Rellenar con los datos obtenidos de la base de datos
    result.forEach((item) => {
      const mesIndex = parseInt(item.mes, 10) - 1;
      if (mesIndex >= 0 && mesIndex < 12) {
        mesesData[mesIndex].cantidad = parseInt(item.cantidad, 10) || 0;
      }
    });

    // Retornar solo mes y cantidad
    return mesesData.map(({ mes, cantidad }) => ({ mes, cantidad }));
  }

  // Método para obtener distribución de apoyos por tipo (todos los meses o por mes específico)
  async getApoyosByType(year?: number, month?: number): Promise<{ tipo: string; cantidad: number; porcentaje: number }[]> {
    const currentYear = year || new Date().getFullYear();
    const now = new Date();
    
    let startDate: Date;
    let endDate: Date;

    if (month) {
      // Si se especifica un mes, filtrar solo ese mes
      startDate = new Date(currentYear, month - 1, 1);
      endDate = new Date(currentYear, month, 0, 23, 59, 59); // Último día del mes
    } else {
      // Si no se especifica mes (Todos los meses)
      startDate = new Date(currentYear, 0, 1);
      
      // Si el año es el actual, usar hasta hoy
      if (currentYear === now.getFullYear()) {
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      } else {
        // Si es un año pasado, usar todo el año
        endDate = new Date(currentYear, 11, 31, 23, 59, 59);
      }
    }

    const result = await this.apoyoRepo
      .createQueryBuilder('apoyo')
      .select('apoyo.tipoApoyo', 'tipo')
      .addSelect('SUM(apoyo.cantidad)', 'cantidad')
      .where('apoyo.fechaEntrega >= :startDate', { startDate })
      .andWhere('apoyo.fechaEntrega <= :endDate', { endDate })
      .groupBy('apoyo.tipoApoyo')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Calcular total para obtener porcentajes
    const total = result.reduce((acc, item) => acc + parseInt(item.cantidad, 10), 0);

    // Calcular porcentajes
    return result.map((item) => {
      const cantidad = parseInt(item.cantidad, 10) || 0;
      const porcentaje = total > 0 ? parseFloat(((cantidad / total) * 100).toFixed(2)) : 0;
      
      return {
        tipo: item.tipo || 'Sin especificar',
        cantidad,
        porcentaje,
      };
    });
  }

  // Método para obtener top colonias con más apoyos (optimizado con consultas en paralelo)
  async getTopColoniasMasApoyos(year?: number, month?: number, limit: number = 7): Promise<{ 
    posicion: number; 
    colonia: string; 
    codigoPostal: number; 
    totalApoyos: number 
  }[]> {
    const { startDate, endDate } = this.getDateRange(year, month);

    // Ejecutar ambas consultas en paralelo
    const [cabezasData, integrantesData] = await Promise.all([
      this.apoyoRepo
        .createQueryBuilder('apoyo')
        .innerJoin('apoyo.cabeza', 'cabeza')
        .select('cabeza.colonia', 'colonia')
        .addSelect('cabeza.codigoPostal', 'codigoPostal')
        .addSelect('SUM(apoyo.cantidad)', 'totalApoyos')
        .where('apoyo.fechaEntrega >= :startDate', { startDate })
        .andWhere('apoyo.fechaEntrega <= :endDate', { endDate })
        .andWhere('apoyo.cabeza IS NOT NULL')
        .groupBy('cabeza.colonia')
        .addGroupBy('cabeza.codigoPostal')
        .getRawMany(),
      this.apoyoRepo
        .createQueryBuilder('apoyo')
        .innerJoin('apoyo.persona', 'persona')
        .select('persona.colonia', 'colonia')
        .addSelect('persona.codigoPostal', 'codigoPostal')
        .addSelect('SUM(apoyo.cantidad)', 'totalApoyos')
        .where('apoyo.fechaEntrega >= :startDate', { startDate })
        .andWhere('apoyo.fechaEntrega <= :endDate', { endDate })
        .andWhere('apoyo.persona IS NOT NULL')
        .groupBy('persona.colonia')
        .addGroupBy('persona.codigoPostal')
        .getRawMany(),
    ]);

    return this.combineAndSortColonias(cabezasData, integrantesData, limit, 'desc');
  }

  // Método para obtener top colonias con menos apoyos (optimizado con consultas en paralelo)
  async getTopColoniasMenosApoyos(year?: number, month?: number, limit: number = 7): Promise<{ 
    posicion: number; 
    colonia: string; 
    codigoPostal: number; 
    totalApoyos: number 
  }[]> {
    const { startDate, endDate } = this.getDateRange(year, month);

    // Ejecutar ambas consultas en paralelo
    const [cabezasData, integrantesData] = await Promise.all([
      this.apoyoRepo
        .createQueryBuilder('apoyo')
        .innerJoin('apoyo.cabeza', 'cabeza')
        .select('cabeza.colonia', 'colonia')
        .addSelect('cabeza.codigoPostal', 'codigoPostal')
        .addSelect('SUM(apoyo.cantidad)', 'totalApoyos')
        .where('apoyo.fechaEntrega >= :startDate', { startDate })
        .andWhere('apoyo.fechaEntrega <= :endDate', { endDate })
        .andWhere('apoyo.cabeza IS NOT NULL')
        .groupBy('cabeza.colonia')
        .addGroupBy('cabeza.codigoPostal')
        .getRawMany(),
      this.apoyoRepo
        .createQueryBuilder('apoyo')
        .innerJoin('apoyo.persona', 'persona')
        .select('persona.colonia', 'colonia')
        .addSelect('persona.codigoPostal', 'codigoPostal')
        .addSelect('SUM(apoyo.cantidad)', 'totalApoyos')
        .where('apoyo.fechaEntrega >= :startDate', { startDate })
        .andWhere('apoyo.fechaEntrega <= :endDate', { endDate })
        .andWhere('apoyo.persona IS NOT NULL')
        .groupBy('persona.colonia')
        .addGroupBy('persona.codigoPostal')
        .getRawMany(),
    ]);

    return this.combineAndSortColonias(cabezasData, integrantesData, limit, 'asc');
  }

  // Método helper para calcular rango de fechas
  private getDateRange(year?: number, month?: number): { startDate: Date; endDate: Date } {
    const currentYear = year || new Date().getFullYear();
    const now = new Date();
    
    let startDate: Date;
    let endDate: Date;

    if (month) {
      startDate = new Date(currentYear, month - 1, 1);
      endDate = new Date(currentYear, month, 0, 23, 59, 59);
    } else {
      startDate = new Date(currentYear, 0, 1);
      if (currentYear === now.getFullYear()) {
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      } else {
        endDate = new Date(currentYear, 11, 31, 23, 59, 59);
      }
    }

    return { startDate, endDate };
  }

  // Método helper para combinar y ordenar colonias
  private combineAndSortColonias(
    cabezasData: any[],
    integrantesData: any[],
    limit: number,
    order: 'asc' | 'desc'
  ): { posicion: number; colonia: string; codigoPostal: number; totalApoyos: number }[] {
    const coloniaMap = new Map<string, { colonia: string; codigoPostal: number; totalApoyos: number }>();

    [...cabezasData, ...integrantesData].forEach((item) => {
      const key = `${item.colonia}-${item.codigoPostal || 0}`;
      const cantidad = parseInt(item.totalApoyos, 10) || 0;
      
      if (coloniaMap.has(key)) {
        coloniaMap.get(key).totalApoyos += cantidad;
      } else {
        coloniaMap.set(key, {
          colonia: item.colonia,
          codigoPostal: item.codigoPostal || 0,
          totalApoyos: cantidad,
        });
      }
    });

    return Array.from(coloniaMap.values())
      .sort((a, b) => order === 'desc' ? b.totalApoyos - a.totalApoyos : a.totalApoyos - b.totalApoyos)
      .slice(0, limit)
      .map((item, index) => ({
        posicion: index + 1,
        colonia: item.colonia,
        codigoPostal: item.codigoPostal,
        totalApoyos: item.totalApoyos,
      }));
  }
}
