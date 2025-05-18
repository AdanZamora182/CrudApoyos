import { Controller, Post, Body, BadRequestException, Get, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { CabezaCirculoService } from './cabeza-circulo.service';
import { CabezaCirculo } from './cabeza-circulo.entity';

@Controller('cabezas-circulo')
export class CabezaCirculoController {
  constructor(private readonly cabezaCirculoService: CabezaCirculoService) {}

  @Post()
  async create(@Body() cabezaCirculoData: CabezaCirculo): Promise<CabezaCirculo> {
    try {
      return await this.cabezaCirculoService.create(cabezaCirculoData);
    } catch (error) {
      console.error("Error en el controlador al crear:", error);
      // Considera si quieres que el error específico de la base de datos (si es un error de validación o duplicado)
      // se propague al cliente, o si siempre quieres un BadRequestException genérico.
      // Si el servicio ya lanza un BadRequestException específico, podrías simplemente hacer `throw error;`
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al registrar la Cabeza de Círculo. Verifique los datos enviados.');
    }
  }
}
