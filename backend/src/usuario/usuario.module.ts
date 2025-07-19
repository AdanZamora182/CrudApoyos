import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioCommand } from './usuario.command'; // Agregar esto

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), HttpModule, ConfigModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioCommand], // Agregar UsuarioCommand aquí
})
export class UsuarioModule {}