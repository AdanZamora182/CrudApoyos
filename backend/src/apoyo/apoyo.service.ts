import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apoyo } from './apoyo.entity';

@Injectable()
export class ApoyoService {
  constructor(
    @InjectRepository(Apoyo)
    private readonly apoyoRepo: Repository<Apoyo>,
  ) {}

  // Método para crear un nuevo Apoyo
  async create(apoyoData: Apoyo): Promise<Apoyo> {
    try {
      const nuevoApoyo = this.apoyoRepo.create(apoyoData);
      return await this.apoyoRepo.save(nuevoApoyo);
    } catch (error) {
      console.error('Error en el servicio al crear Apoyo:', error);
      throw error;
    }
  }

  // Método para obtener todos los Apoyos
  async findAll(): Promise<Apoyo[]> {
    return await this.apoyoRepo.find({ relations: ['persona', 'cabeza'] });
  }
}