import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { IntegranteCirculo } from './integrante-circulo.entity';
import { IntegranteCirculoService } from './integrante-circulo.service';
import { IntegranteCirculoController } from './integrante-circulo.controller';

// Módulo que configura y exporta la funcionalidad relacionada con integrantes de círculo
@Module({
  // Importar el repositorio de TypeORM para la entidad IntegranteCirculo
  imports: [TypeOrmModule.forFeature([IntegranteCirculo])],
  // Registrar el controlador que maneja las rutas HTTP
  controllers: [IntegranteCirculoController],
  // Registrar el servicio que contiene la lógica de negocio
  providers: [IntegranteCirculoService],
})
export class IntegranteCirculoModule {}