import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
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
  async findAll(): Promise<IntegranteCirculo[]> {
    return await this.integranteCirculoService.findAll();
  }
}