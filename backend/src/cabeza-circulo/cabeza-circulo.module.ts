import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; // Importar HttpModule desde @nestjs/axios
import { CabezaCirculo } from './cabeza-circulo.entity';
import { CabezaCirculoService } from './cabeza-circulo.service';
import { CabezaCirculoController } from './cabeza-circulo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CabezaCirculo])],
  controllers: [CabezaCirculoController],
  providers: [CabezaCirculoService],
})
export class CabezaCirculoModule {}