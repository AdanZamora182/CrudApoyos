import { Controller, Post, Body, BadRequestException, Get, Param, ParseIntPipe, Put, Delete, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { IntegranteCirculoService } from './integrante-circulo.service';
import { IntegranteCirculo } from './integrante-circulo.entity';

// Controlador que maneja las peticiones HTTP relacionadas con los integrantes de círculo
@Controller('integrantes-circulo')
export class IntegranteCirculoController {
  // Inyección de dependencia del servicio de integrante de círculo
  constructor(private readonly integranteCirculoService: IntegranteCirculoService) {}

  // Endpoint POST para crear un nuevo integrante de círculo
  @Post()
  async create(@Body() integranteCirculoData: IntegranteCirculo): Promise<IntegranteCirculo> {
    try {
      console.log("Datos recibidos en el backend:", integranteCirculoData);
      return await this.integranteCirculoService.create(integranteCirculoData);
    } catch (error) {
      console.error("Error en el controlador al crear Integrante de Círculo:", error);
      throw new BadRequestException("Error al registrar el Integrante de Círculo.");
    }
  }

  // Endpoint GET para exportar todos los registros a Excel
  @Get('export/excel')
  async exportToExcel(@Res() res: Response): Promise<void> {
    const buffer = await this.integranteCirculoService.exportToExcel();

    const fileName = `integrantes-circulo-${new Date().toISOString().split('T')[0]}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  }

  // Endpoint GET para obtener todos los integrantes o buscar por query
  @Get()
  async findAll(@Query('query') query?: string): Promise<IntegranteCirculo[]> {
    // Si se proporciona un query, realizar búsqueda específica
    if (query) {
      return await this.integranteCirculoService.buscar(query);
    }
    // Si no hay query, retornar todos los integrantes
    return await this.integranteCirculoService.findAll();
  }

  // Endpoint GET para obtener un integrante específico por su ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<IntegranteCirculo> {
    return this.integranteCirculoService.findOne(id);
  }
  
  // Endpoint PUT para actualizar un integrante existente
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() integranteData: Partial<IntegranteCirculo>): Promise<IntegranteCirculo> {
    return this.integranteCirculoService.update(id, integranteData);
  }
  
  // Endpoint DELETE para eliminar un integrante por su ID
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.integranteCirculoService.remove(id);
  }
}