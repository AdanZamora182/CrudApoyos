import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apoyo } from './apoyo.entity';
import { ApoyoService } from './apoyo.service';
import { ApoyoController } from './apoyo.controller';

// Módulo que configura y exporta la funcionalidad relacionada con apoyos
@Module({
  // Importar el repositorio de TypeORM para la entidad Apoyo
  imports: [TypeOrmModule.forFeature([Apoyo])],
  // Registrar el controlador que maneja las rutas HTTP
  controllers: [ApoyoController],
  // Registrar el servicio que contiene la lógica de negocio
  providers: [ApoyoService],
})
export class ApoyoModule {}