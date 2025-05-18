import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apoyo } from './apoyo.entity';
import { ApoyoService } from './apoyo.service';
import { ApoyoController } from './apoyo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Apoyo])],
  controllers: [ApoyoController],
  providers: [ApoyoService],
})
export class ApoyoModule {}