import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegranteCirculo } from './integrante-circulo.entity';

@Injectable()
export class IntegranteCirculoService {
  constructor(
    @InjectRepository(IntegranteCirculo)
    private readonly integranteCirculoRepo: Repository<IntegranteCirculo>,
  ) {}

  // Método para crear un nuevo Integrante de Círculo
  async create(integranteCirculoData: IntegranteCirculo): Promise<IntegranteCirculo> {
    try {
      const nuevoIntegrante = this.integranteCirculoRepo.create(integranteCirculoData);
      return await this.integranteCirculoRepo.save(nuevoIntegrante);
    } catch (error) {
      console.error('Error en el servicio al crear Integrante de Círculo:', error);
      throw error;
    }
  }

  // Método para obtener todos los Integrantes de Círculo
  async findAll(): Promise<IntegranteCirculo[]> {
    return await this.integranteCirculoRepo.find({ relations: ['lider'] });
  }
}