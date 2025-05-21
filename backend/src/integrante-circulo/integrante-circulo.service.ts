import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Método para buscar un integrante por ID
  async findOne(id: number): Promise<IntegranteCirculo> {
    const integrante = await this.integranteCirculoRepo.findOne({ where: { id }, relations: ['lider'] });
    if (!integrante) {
      throw new NotFoundException(`Integrante de Círculo con ID ${id} no encontrado`);
    }
    return integrante;
  }

  // Método para actualizar un integrante
  async update(id: number, integranteData: Partial<IntegranteCirculo>): Promise<IntegranteCirculo> {
    const integrante = await this.findOne(id);
    
    // Asegurar que la fecha de nacimiento sea un objeto Date si viene como string
    if (integranteData.fechaNacimiento && typeof integranteData.fechaNacimiento === 'string') {
      integranteData.fechaNacimiento = new Date(integranteData.fechaNacimiento);
    }
    
    Object.assign(integrante, integranteData);
    return await this.integranteCirculoRepo.save(integrante);
  }

  // Método para eliminar un integrante
  async remove(id: number): Promise<void> {
    const result = await this.integranteCirculoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Integrante de Círculo con ID ${id} no encontrado`);
    }
  }

  // Método para buscar Integrantes de Círculo por nombre o Clave_Elector
  async buscar(query: string): Promise<IntegranteCirculo[]> {
    // If no query is provided, return all records with their complete data
    if (!query || query.trim() === '') {
      return await this.findAll();
    }
    
    // When there is a query, make sure to include all fields and the lider relationship
    return this.integranteCirculoRepo
      .createQueryBuilder('integranteCirculo')
      .leftJoinAndSelect('integranteCirculo.lider', 'lider') // Include lider relationship
      .where('integranteCirculo.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.apellidoPaterno LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.apellidoMaterno LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.claveElector LIKE :query', { query: `%${query}%` })
      .getMany();
  }
}