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

  // Método para buscar Integrantes de Círculo por nombre o Clave_Elector
  async buscar(query: string): Promise<IntegranteCirculo[]> {
    return this.integranteCirculoRepo
      .createQueryBuilder('integranteCirculo')
      .select([
        'integranteCirculo.id',
        'integranteCirculo.nombre',
        'integranteCirculo.apellidoPaterno',
        'integranteCirculo.apellidoMaterno',
        'integranteCirculo.claveElector',
      ]) // Seleccionar explícitamente los campos requeridos
      .where('integranteCirculo.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.apellidoPaterno LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.apellidoMaterno LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.claveElector LIKE :query', { query: `%${query}%` })
      .getMany();
  }
}