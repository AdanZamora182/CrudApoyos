import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; // Importar HttpModule desde @nestjs/axios
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), HttpModule],
  controllers: [UsuarioController], // Asegúrate de que el controlador esté registrado aquí
  providers: [UsuarioService],
})
export class UsuarioModule {}
