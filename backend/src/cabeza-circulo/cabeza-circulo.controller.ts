import { Controller, Post, Body, BadRequestException, Get, Param, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
import { CabezaCirculoService } from './cabeza-circulo.service';
import { CabezaCirculo } from './cabeza-circulo.entity';

// Controlador que maneja las peticiones HTTP relacionadas con las cabezas de círculo
@Controller('cabezas-circulo')
export class CabezaCirculoController {
  // Inyección de dependencia del servicio de cabeza de círculo
  constructor(private readonly cabezaCirculoService: CabezaCirculoService) {}

  // Endpoint POST para crear una nueva cabeza de círculo
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

  // Endpoint GET para buscar cabezas de círculo por nombre o clave de elector
  @Get('buscar')
  async buscar(@Query('query') query: string): Promise<CabezaCirculo[]> {
    return this.cabezaCirculoService.buscar(query);
  }
  
  // Endpoint GET para obtener todas las cabezas de círculo registradas
  @Get()
  async findAll(): Promise<CabezaCirculo[]> {
    return this.cabezaCirculoService.findAll();
  }
  
  // Endpoint GET para obtener una cabeza de círculo específica por su ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CabezaCirculo> {
    return this.cabezaCirculoService.findOne(id);
  }
  
  // Endpoint PUT para actualizar una cabeza de círculo existente
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() cabezaData: Partial<CabezaCirculo>): Promise<CabezaCirculo> {
    return this.cabezaCirculoService.update(id, cabezaData);
  }
  
  // Endpoint DELETE para eliminar una cabeza de círculo por su ID
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cabezaCirculoService.remove(id);
  }
}
