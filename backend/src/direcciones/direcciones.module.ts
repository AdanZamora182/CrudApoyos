import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DireccionesController } from './direcciones.controller';
import { DireccionesService } from './direcciones.service';
import { Direccion, DireccionSchema } from './schemas/direccion.schema';

// Módulo que configura y exporta la funcionalidad relacionada con direcciones y códigos postales
@Module({
  imports: [
    // Configuración de Mongoose para registrar el esquema de Direccion
    MongooseModule.forFeature([
      { name: Direccion.name, schema: DireccionSchema }
    ]),
  ],
  // Registrar el controlador que maneja las rutas HTTP
  controllers: [DireccionesController],
  // Registrar el servicio que contiene la lógica de negocio
  providers: [DireccionesService],
  // Exportar el servicio para que pueda ser utilizado en otros módulos
  exports: [DireccionesService],
})
export class DireccionesModule {}