import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegranteCirculo } from './integrante-circulo.entity';

// Servicio que contiene la lógica de negocio para la gestión de integrantes de círculo
@Injectable()
export class IntegranteCirculoService {
  // Inyección del repositorio de integrante de círculo para operaciones con la base de datos
  constructor(
    @InjectRepository(IntegranteCirculo)
    private readonly integranteCirculoRepo: Repository<IntegranteCirculo>,
  ) {}

  // Método para crear y guardar un nuevo integrante de círculo en la base de datos
  async create(integranteCirculoData: IntegranteCirculo): Promise<IntegranteCirculo> {
    try {
      // Crear una nueva instancia de integrante de círculo con los datos recibidos
      const nuevoIntegrante = this.integranteCirculoRepo.create(integranteCirculoData);
      // Guardar el integrante en la base de datos y retornarlo
      return await this.integranteCirculoRepo.save(nuevoIntegrante);
    } catch (error) {
      console.error('Error en el servicio al crear Integrante de Círculo:', error);
      throw error;
    }
  }

  // Método para obtener todos los integrantes de círculo con sus relaciones
  async findAll(): Promise<IntegranteCirculo[]> {
    // Incluir la relación con el líder (CabezaCirculo)
    return await this.integranteCirculoRepo.find({ relations: ['lider'] });
  }

  // Método para buscar un integrante específico por su ID
  async findOne(id: number): Promise<IntegranteCirculo> {
    // Buscar el integrante incluyendo la relación con el líder
    const integrante = await this.integranteCirculoRepo.findOne({ where: { id }, relations: ['lider'] });
    // Lanzar excepción si no se encuentra el integrante
    if (!integrante) {
      throw new NotFoundException(`Integrante de Círculo con ID ${id} no encontrado`);
    }
    return integrante;
  }

  // Método para actualizar un integrante existente
  async update(id: number, integranteData: Partial<IntegranteCirculo>): Promise<IntegranteCirculo> {
    // Buscar el integrante existente (lanza excepción si no existe)
    const integrante = await this.findOne(id);
    
    // Convertir fecha de string a objeto Date si es necesario
    if (integranteData.fechaNacimiento && typeof integranteData.fechaNacimiento === 'string') {
      integranteData.fechaNacimiento = new Date(integranteData.fechaNacimiento);
    }
    
    // Aplicar los cambios al integrante existente
    Object.assign(integrante, integranteData);
    // Guardar los cambios en la base de datos
    return await this.integranteCirculoRepo.save(integrante);
  }

  // Método para eliminar un integrante por su ID
  async remove(id: number): Promise<void> {
    // Intentar eliminar el integrante de la base de datos
    const result = await this.integranteCirculoRepo.delete(id);
    // Verificar si se eliminó algún registro
    if (result.affected === 0) {
      throw new NotFoundException(`Integrante de Círculo con ID ${id} no encontrado`);
    }
  }

  // Método para buscar integrantes por nombre, apellidos o clave de elector
  async buscar(query: string): Promise<IntegranteCirculo[]> {
    // Si no hay consulta de búsqueda, retornar todos los registros con datos completos
    if (!query || query.trim() === '') {
      return await this.findAll();
    }
    
    // Realizar búsqueda usando Query Builder incluyendo la relación con el líder
    return this.integranteCirculoRepo
      .createQueryBuilder('integranteCirculo')
      .leftJoinAndSelect('integranteCirculo.lider', 'lider') // Incluir relación con el líder
      .where('integranteCirculo.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.apellidoPaterno LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.apellidoMaterno LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.claveElector LIKE :query', { query: `%${query}%` })
      .getMany();
  }
}