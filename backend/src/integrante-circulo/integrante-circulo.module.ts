import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; // Importar HttpModule desde @nestjs/axios
import { IntegranteCirculo } from './integrante-circulo.entity';
import { IntegranteCirculoService } from './integrante-circulo.service';
import { IntegranteCirculoController } from './integrante-circulo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IntegranteCirculo])],
  controllers: [IntegranteCirculoController],
  providers: [IntegranteCirculoService],
})
export class IntegranteCirculoModule {}