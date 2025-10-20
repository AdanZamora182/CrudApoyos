import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, Delete, BadRequestException } from '@nestjs/common';
import { ApoyoService } from './apoyo.service';
import { Apoyo } from './apoyo.entity';

// Controlador que maneja las peticiones HTTP relacionadas con los apoyos
@Controller('apoyos')
export class ApoyoController {
  // Inyección de dependencia del servicio de apoyo
  constructor(private readonly apoyoService: ApoyoService) {}

  // Endpoint POST para crear un nuevo apoyo
  @Post()
  async create(@Body() apoyoData: Apoyo): Promise<Apoyo> {
    try {
      console.log("Datos recibidos en el backend:", apoyoData);
      return await this.apoyoService.create(apoyoData);
    } catch (error) {
      console.error("Error en el controlador al crear Apoyo:", error);
      throw new BadRequestException("Error al registrar el Apoyo. Verifique los datos enviados.");
    }
  }

  // Endpoint GET para obtener todos los apoyos registrados
  @Get()
  async findAll(): Promise<Apoyo[]> {
    return await this.apoyoService.findAll();
  }
  
  // Endpoint GET para obtener un apoyo específico por su ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Apoyo> {
    return await this.apoyoService.findOne(id);
  }
  
  // Endpoint PUT para actualizar un apoyo existente
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() apoyoData: Partial<Apoyo>): Promise<Apoyo> {
    return await this.apoyoService.update(id, apoyoData);
  }
  
  // Endpoint DELETE para eliminar un apoyo por su ID
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.apoyoService.remove(id);
  }
}