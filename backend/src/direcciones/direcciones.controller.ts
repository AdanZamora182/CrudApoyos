import { Controller, Get, Query } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';

// Controlador que maneja las peticiones HTTP relacionadas con direcciones y códigos postales
@Controller('direcciones')
export class DireccionesController {
  // Inyección de dependencia del servicio de direcciones
  constructor(private readonly direccionesService: DireccionesService) {}

  // Endpoint GET para buscar colonias y municipio basado en un código postal específico
  @Get('buscar')
  async buscarPorCodigoPostal(@Query('cp') cp: string) {
    return this.direccionesService.findColoniasYMunicipioPorCodigoPostal(Number(cp));
  }

  // Endpoint GET para obtener todas las direcciones (principalmente para pruebas y desarrollo)
  @Get()
  async findAll() {
    return this.direccionesService.findAll();
  }
}