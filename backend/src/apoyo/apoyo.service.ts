import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apoyo } from './apoyo.entity';

// Servicio que contiene la lógica de negocio para la gestión de apoyos
@Injectable()
export class ApoyoService {
  // Inyección del repositorio de apoyo para operaciones con la base de datos
  constructor(
    @InjectRepository(Apoyo)
    private readonly apoyoRepo: Repository<Apoyo>,
  ) {}

  // Método para crear y guardar un nuevo apoyo en la base de datos
  async create(apoyoData: Apoyo): Promise<Apoyo> {
    try {
      // Crear una nueva instancia de apoyo con los datos recibidos
      const nuevoApoyo = this.apoyoRepo.create(apoyoData);
      // Guardar el apoyo en la base de datos y retornarlo
      return await this.apoyoRepo.save(nuevoApoyo);
    } catch (error) {
      console.error('Error en el servicio al crear Apoyo:', error);
      throw error;
    }
  }

  // Método para obtener todos los apoyos con sus relaciones
  async findAll(): Promise<Apoyo[]> {
    return await this.apoyoRepo.find({ 
      // Incluir las relaciones con persona (IntegranteCirculo) y cabeza (CabezaCirculo)
      relations: ['persona', 'cabeza'],
      // Ordenar por ID de forma descendente (más recientes primero)
      order: { id: 'DESC' }
    });
  }
  
  // Método para buscar un apoyo específico por su ID
  async findOne(id: number): Promise<Apoyo> {
    const apoyo = await this.apoyoRepo.findOne({ 
      where: { id },
      // Incluir las relaciones con persona y cabeza
      relations: ['persona', 'cabeza']
    });
    
    // Lanzar excepción si no se encuentra el apoyo
    if (!apoyo) {
      throw new NotFoundException(`Apoyo con ID ${id} no encontrado`);
    }
    
    return apoyo;
  }
  
  // Método para actualizar un apoyo existente
  async update(id: number, apoyoData: Partial<Apoyo>): Promise<Apoyo> {
    // Buscar el apoyo existente (lanza excepción si no existe)
    const apoyo = await this.findOne(id);
    
    // Convertir fecha de string a objeto Date si es necesario
    if (apoyoData.fechaEntrega && typeof apoyoData.fechaEntrega === 'string') {
      apoyoData.fechaEntrega = new Date(apoyoData.fechaEntrega);
    }
    
    // Aplicar los cambios al apoyo existente
    Object.assign(apoyo, apoyoData);
    // Guardar los cambios en la base de datos
    return await this.apoyoRepo.save(apoyo);
  }
  
  // Método para eliminar un apoyo por su ID
  async remove(id: number): Promise<void> {
    // Intentar eliminar el apoyo de la base de datos
    const result = await this.apoyoRepo.delete(id);
    // Verificar si se eliminó algún registro
    if (result.affected === 0) {
      throw new NotFoundException(`Apoyo con ID ${id} no encontrado`);
    }
  }
}