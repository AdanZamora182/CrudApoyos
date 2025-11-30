import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioCommand } from './usuario.command';
import { AuthModule } from '../auth/auth.module';

// Módulo que configura y exporta la funcionalidad relacionada con usuarios
@Module({
  imports: [
    // Registrar la entidad Usuario con TypeORM
    TypeOrmModule.forFeature([Usuario]), 
    // Módulo HTTP para realizar peticiones externas (reCAPTCHA)
    HttpModule, 
    // Módulo de configuración para acceder a variables de entorno
    ConfigModule,
    // Módulo de autenticación JWT
    AuthModule,
  ],
  // Registrar el controlador que maneja las rutas HTTP
  controllers: [UsuarioController],
  // Registrar los servicios y comandos disponibles
  providers: [UsuarioService, UsuarioCommand],
  // Exportar el servicio para uso en otros módulos
  exports: [UsuarioService],
})
export class UsuarioModule {}