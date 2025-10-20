import { Controller, Get, Query } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';

@Controller('direcciones')
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) {}

  // Endpoint para buscar colonias y municipio por código postal
  @Get('buscar')
  async buscarPorCodigoPostal(@Query('cp') cp: string) {
    return this.direccionesService.findColoniasYMunicipioPorCodigoPostal(Number(cp));
  }

  // Endpoint para obtener todas (prueba)
  @Get()
  async findAll() {
    return this.direccionesService.findAll();
  }
}