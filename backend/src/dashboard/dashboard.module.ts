import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { CabezaCirculo } from '../cabeza-circulo/cabeza-circulo.entity';
import { IntegranteCirculo } from '../integrante-circulo/integrante-circulo.entity';
import { Apoyo } from '../apoyo/apoyo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CabezaCirculo, IntegranteCirculo, Apoyo]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
