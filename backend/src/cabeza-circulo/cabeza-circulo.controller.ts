import { Controller, Post, Body, BadRequestException, Get, Param, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al registrar la Cabeza de Círculo. Verifique los datos enviados.');
    }
  }

  @Get('buscar')
  async buscar(@Query('query') query: string): Promise<CabezaCirculo[]> {
    return this.cabezaCirculoService.buscar(query);
  }
  
  @Get()
  async findAll(): Promise<CabezaCirculo[]> {
    return this.cabezaCirculoService.findAll();
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CabezaCirculo> {
    return this.cabezaCirculoService.findOne(id);
  }
  
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() cabezaData: Partial<CabezaCirculo>): Promise<CabezaCirculo> {
    return this.cabezaCirculoService.update(id, cabezaData);
  }
  
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cabezaCirculoService.remove(id);
  }
}
