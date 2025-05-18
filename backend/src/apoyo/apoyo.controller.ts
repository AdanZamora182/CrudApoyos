import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
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
}