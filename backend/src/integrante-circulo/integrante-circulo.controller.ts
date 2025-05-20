import { Controller, Post, Body, BadRequestException, Get, Param, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
import { IntegranteCirculoService } from './integrante-circulo.service';
import { IntegranteCirculo } from './integrante-circulo.entity';

@Controller('integrantes-circulo')
export class IntegranteCirculoController {
  constructor(private readonly integranteCirculoService: IntegranteCirculoService) {}

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
  
  @Get()
  async findAll(@Query('query') query?: string): Promise<IntegranteCirculo[]> {
    if (query) {
      return await this.integranteCirculoService.buscar(query);
    }
    return await this.integranteCirculoService.findAll();
  }
}