import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, Delete, BadRequestException } from '@nestjs/common';
import { ApoyoService } from './apoyo.service';
import { Apoyo } from './apoyo.entity';

@Controller('apoyos')
export class ApoyoController {
  constructor(private readonly apoyoService: ApoyoService) {}

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

  @Get()
  async findAll(): Promise<Apoyo[]> {
    return await this.apoyoService.findAll();
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Apoyo> {
    return await this.apoyoService.findOne(id);
  }
  
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() apoyoData: Partial<Apoyo>): Promise<Apoyo> {
    return await this.apoyoService.update(id, apoyoData);
  }
  
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.apoyoService.remove(id);
  }
}