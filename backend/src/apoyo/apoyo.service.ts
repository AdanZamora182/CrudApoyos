import { Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.apoyoRepo.find({ 
      relations: ['persona', 'cabeza'], // Removed 'persona.lider' relation
      order: { id: 'DESC' }
    });
  }
  
  // Método para buscar un apoyo por ID
  async findOne(id: number): Promise<Apoyo> {
    const apoyo = await this.apoyoRepo.findOne({ 
      where: { id },
      relations: ['persona', 'cabeza'] // Removed 'persona.lider' relation
    });
    
    if (!apoyo) {
      throw new NotFoundException(`Apoyo con ID ${id} no encontrado`);
    }
    
    return apoyo;
  }
  
  // Método para actualizar un apoyo
  async update(id: number, apoyoData: Partial<Apoyo>): Promise<Apoyo> {
    const apoyo = await this.findOne(id);
    
    // Ensure date objects are properly handled
    if (apoyoData.fechaEntrega && typeof apoyoData.fechaEntrega === 'string') {
      apoyoData.fechaEntrega = new Date(apoyoData.fechaEntrega);
    }
    
    Object.assign(apoyo, apoyoData);
    return await this.apoyoRepo.save(apoyo);
  }
  
  // Método para eliminar un apoyo
  async remove(id: number): Promise<void> {
    const result = await this.apoyoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Apoyo con ID ${id} no encontrado`);
    }
  }
}