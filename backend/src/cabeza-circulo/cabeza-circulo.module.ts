import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CabezaCirculo } from './cabeza-circulo.entity';
import { CabezaCirculoService } from './cabeza-circulo.service';
import { CabezaCirculoController } from './cabeza-circulo.controller';

// Módulo que configura y exporta la funcionalidad relacionada con cabezas de círculo
@Module({
  // Importar el repositorio de TypeORM para la entidad CabezaCirculo
  imports: [TypeOrmModule.forFeature([CabezaCirculo])],
  // Registrar el controlador que maneja las rutas HTTP
  controllers: [CabezaCirculoController],
  // Registrar el servicio que contiene la lógica de negocio
  providers: [CabezaCirculoService],
})
export class CabezaCirculoModule {}